/**
 * IMMUNIX SENSOR: Sovereign HTTP Proxy & Telemetry Capture Layer (Two Honest Paths)
 * 
 * Invariants (Driftshot Architecture):
 * 1. Two Honest Paths:
 *    - Path A [Known Drift]: In-process pre-flight AST rewrite in SDK before network dispatch (<2ms, 1 roundtrip, 200 OK).
 *    - Path B [Unknown Drift]: Honest vendor 400 error passed to caller + async telemetry (zero bodies) + verified GitHub PR.
 * 2. Fail-Open Circuit Breaker:
 *    Internal overhead capped at <2ms p99, 15ms hard cutoff.
 *    Any internal timeout/error fails open immediately without affecting client requests.
 * 3. Zero Body Retention:
 *    Client-side value destruction via extractRedactedShape(). Zero customer email, card PANs, or tokens retained.
 */

import { circuitBreaker } from './circuit-breaker';
import { extractRedactedShape, sanitizeHeaders, computeSchemaFingerprint, StructuralSchema } from './shape';
import { checkIsSensitiveEndpoint } from '../antibody/dsl';
import { immuneLog } from '../immune-log/immune-log';

export interface SensorCaptureEvent {
  id: string;
  vendor: string;
  endpoint: string;
  method: string;
  status_code: number;
  latency_ms: number;
  path_mode: 'PATH_A_PREFLIGHT' | 'PATH_B_COLD_START';
  is_sensitive: boolean;
  request_fingerprint: string;
  response_fingerprint: string;
  request_shape: StructuralSchema;
  response_shape: StructuralSchema;
  headers: Record<string, string>;
  timestamp: string;
}

export interface PreFlightAntibodyRule {
  id: string;
  vendor: string;
  endpoint: string;
  sensitive: boolean;
  rewrite: (body: Record<string, unknown>) => Record<string, unknown>;
}

export interface SensorOptions {
  vendor: string;
  activeAntibodies?: PreFlightAntibodyRule[];
  onCapture?: (event: SensorCaptureEvent) => Promise<void> | void;
}

/**
 * Creates an instrumented, fail-open fetch client implementing the Two Honest Paths.
 */
export function createSensorClient(options: SensorOptions) {
  const { vendor, activeAntibodies = [], onCapture } = options;

  return async function sensorFetch(
    url: string | URL,
    init?: RequestInit
  ): Promise<Response> {
    const startTime = performance.now();
    const method = init?.method || 'GET';
    const targetUrl = typeof url === 'string' ? url : url.toString();
    const urlObj = new URL(targetUrl, 'http://localhost');
    const endpoint = urlObj.pathname;
    const isSensitive = checkIsSensitiveEndpoint(endpoint, method);

    // Parse request body for shape analysis and in-flight pre-flight check
    let parsedRequestBody: Record<string, unknown> = {};
    let isJson = false;
    if (init?.body && typeof init.body === 'string') {
      try {
        parsedRequestBody = JSON.parse(init.body);
        isJson = true;
      } catch {
        parsedRequestBody = {};
      }
    }

    let effectiveInit = init;
    let pathMode: 'PATH_A_PREFLIGHT' | 'PATH_B_COLD_START' = 'PATH_B_COLD_START';

    // PATH A CHECK: Is there a known in-memory antibody rule for this vendor + endpoint?
    const matchedRule = activeAntibodies.find(
      (rule) =>
        rule.vendor.toLowerCase() === vendor.toLowerCase() &&
        (rule.endpoint === endpoint || endpoint.includes(rule.endpoint))
    );

    if (matchedRule && isJson) {
      if (isSensitive) {
        // Invariant: Sensitive/financial routes are hard-locked against live in-flight rewrites
        console.warn(
          `[IMMUNIX SENSOR] 🛡️ Sensitive endpoint detected: ${endpoint}. Live rewrite BLOCKED by policy. Routing to Human-Approved PR Lane.`
        );
      } else {
        // Execute pre-flight rewrite within strict circuit breaker budget
        effectiveInit = await circuitBreaker.executeWithBudget(
          () => {
            const mutatedBody = matchedRule.rewrite(parsedRequestBody);
            pathMode = 'PATH_A_PREFLIGHT';
            return {
              ...init,
              body: JSON.stringify(mutatedBody),
            };
          },
          () => init, // Fallback: send unmodified if internal budget exceeded
          'preflight_ast_rewrite'
        );
      }
    }

    // Network dispatch: single roundtrip to vendor
    let response: Response;
    try {
      response = await fetch(url, effectiveInit);
    } catch (networkError) {
      const latencyMs = Math.round((performance.now() - startTime) * 100) / 100;
      const reqShape = extractRedactedShape(parsedRequestBody);
      const resShape = extractRedactedShape({ error: 'network_failure' });

      const captureEvent: SensorCaptureEvent = {
        id: `sen_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        vendor,
        endpoint,
        method,
        status_code: 503,
        latency_ms: latencyMs,
        path_mode: pathMode,
        is_sensitive: isSensitive,
        request_fingerprint: computeSchemaFingerprint(reqShape),
        response_fingerprint: computeSchemaFingerprint(resShape),
        request_shape: reqShape,
        response_shape: resShape,
        headers: {},
        timestamp: new Date().toISOString(),
      };

      // Asynchronous non-blocking telemetry logging
      circuitBreaker.executeWithBudget(
        () => onCapture?.(captureEvent),
        () => {},
        'async_telemetry_capture'
      );

      throw networkError;
    }

    const latencyMs = Math.round((performance.now() - startTime) * 100) / 100;

    // Clone response to inspect shape without consuming stream
    const clonedResponse = response.clone();
    let parsedResponseBody: Record<string, unknown> = {};
    try {
      parsedResponseBody = await clonedResponse.json();
    } catch {
      parsedResponseBody = { _status: response.statusText };
    }

    // Extract headers (specifically RFC 9745 Deprecation, RFC 8594 Sunset, RFC 9457 Problem Details)
    const rawHeaders: Record<string, string> = {};
    response.headers.forEach((val, key) => {
      rawHeaders[key.toLowerCase()] = val;
    });

    const sanitizedHeaders = sanitizeHeaders(rawHeaders);
    const reqShape = extractRedactedShape(parsedRequestBody);
    const resShape = extractRedactedShape(parsedResponseBody);

    const captureEvent: SensorCaptureEvent = {
      id: `sen_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      vendor,
      endpoint,
      method,
      status_code: response.status,
      latency_ms: latencyMs,
      path_mode: pathMode,
      is_sensitive: isSensitive,
      request_fingerprint: computeSchemaFingerprint(reqShape),
      response_fingerprint: computeSchemaFingerprint(resShape),
      request_shape: reqShape,
      response_shape: resShape,
      headers: sanitizedHeaders,
      timestamp: new Date().toISOString(),
    };

    // Asynchronously log to Immune Log (Zero Body Retention)
    circuitBreaker.executeWithBudget(
      () => {
        if (response.status >= 400) {
          immuneLog.append(
            'PATHOGEN_DETECTED',
            vendor,
            `Vendor returned HTTP ${response.status} on ${endpoint}`,
            {
              endpoint,
              status: response.status,
              latencyMs,
              pathMode,
              reqFingerprint: captureEvent.request_fingerprint,
              resFingerprint: captureEvent.response_fingerprint,
            },
            endpoint
          );
        }
        onCapture?.(captureEvent);
      },
      () => {},
      'async_immune_logging'
    );

    return response;
  };
}
