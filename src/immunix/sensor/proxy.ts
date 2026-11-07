/**
 * IMMUNIX SENSOR: HTTP Proxy & Telemetry Capture Layer
 * 
 * Intercepts outbound vendor calls, measures timing, records structural shapes,
 * extracts RFC 8594 Sunset/Deprecation headers, redacts secrets, and dispatches
 * telemetry to the Pathogen Detector.
 * 
 * Safety Guarantee: Forward traffic is never modified in-flight in this MVP.
 */

import { redactObject, extractShape } from './redactor';

export interface SensorCaptureEvent {
  id: string;
  vendor: string;
  endpoint: string;
  method: string;
  status_code: number;
  latency_ms: number;
  headers: Record<string, string>;
  request_shape: Record<string, string>;
  response_shape: Record<string, string>;
  redacted_request: Record<string, unknown>;
  redacted_response: Record<string, unknown>;
  timestamp: string;
}

export interface SensorOptions {
  vendor: string;
  onCapture?: (event: SensorCaptureEvent) => Promise<void> | void;
}

/**
 * Creates an instrumented fetch client wrapped by the Immunix Sensor
 */
export function createSensorClient(options: SensorOptions) {
  const { vendor, onCapture } = options;

  return async function sensorFetch(
    url: string | URL,
    init?: RequestInit
  ): Promise<Response> {
    const startTime = performance.now();
    const method = init?.method || 'GET';
    const targetUrl = typeof url === 'string' ? url : url.toString();
    const urlObj = new URL(targetUrl, 'http://localhost');
    const endpoint = urlObj.pathname;

    // Parse request body for shape and redaction
    let parsedRequestBody: Record<string, unknown> = {};
    if (init?.body && typeof init.body === 'string') {
      try {
        parsedRequestBody = JSON.parse(init.body);
      } catch {
        parsedRequestBody = { _raw: 'unparsed_string' };
      }
    }

    // Forward unmodified request to vendor (Safety principle: never mutate live traffic)
    let response: Response;
    try {
      response = await fetch(url, init);
    } catch (networkError) {
      const latencyMs = Math.round((performance.now() - startTime) * 100) / 100;
      const captureEvent: SensorCaptureEvent = {
        id: `sen_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        vendor,
        endpoint,
        method,
        status_code: 503,
        latency_ms: latencyMs,
        headers: {},
        request_shape: extractShape(parsedRequestBody),
        response_shape: { error: 'network_failure' },
        redacted_request: redactObject(parsedRequestBody),
        redacted_response: { error: (networkError as Error).message },
        timestamp: new Date().toISOString(),
      };
      onCapture?.(captureEvent);
      throw networkError;
    }

    const latencyMs = Math.round((performance.now() - startTime) * 100) / 100;

    // Clone response to read headers and body without consuming the stream for the caller
    const clonedResponse = response.clone();
    let parsedResponseBody: Record<string, unknown> = {};
    try {
      parsedResponseBody = await clonedResponse.json();
    } catch {
      parsedResponseBody = { _status: response.statusText };
    }

    // Extract headers (specifically RFC 8594 Sunset & Deprecation)
    const capturedHeaders: Record<string, string> = {};
    response.headers.forEach((val, key) => {
      capturedHeaders[key.toLowerCase()] = val;
    });

    const captureEvent: SensorCaptureEvent = {
      id: `sen_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      vendor,
      endpoint,
      method,
      status_code: response.status,
      latency_ms: latencyMs,
      headers: capturedHeaders,
      request_shape: extractShape(parsedRequestBody),
      response_shape: extractShape(parsedResponseBody),
      redacted_request: redactObject(parsedRequestBody),
      redacted_response: redactObject(parsedResponseBody),
      timestamp: new Date().toISOString(),
    };

    // Asynchronously trigger capture without blocking the calling application
    try {
      if (onCapture) {
        Promise.resolve(onCapture(captureEvent)).catch((err) => {
          console.warn('[Immunix Sensor] Async capture handler error:', err);
        });
      }
    } catch {}

    return response;
  };
}

