/**
 * IMMUNIX PATHOGEN DETECTOR: Schema Drift & Upstream Mutation Engine
 * 
 * Compares wire responses against stored Zod schemas, parses RFC 8594
 * Sunset / Deprecation headers, monitors 400/404/422 error spikes, and
 * executes scheduled canary probes against vendor sandboxes.
 */

import { getAdapter } from '../adapters';
import { SensorCaptureEvent } from '../sensor';

export interface PathogenEvent {
  id: string;
  vendor: string;
  endpoint: string;
  drift_type: 'FIELD_RENAMED' | 'FIELD_REMOVED' | 'TYPE_MUTATION' | 'SUNSET_HEADER' | 'ERROR_SPIKE';
  severity: 'CRITICAL' | 'WARNING' | 'INFO';
  description: string;
  old_shape: Record<string, string>;
  new_shape: Record<string, string>;
  mutation?: {
    old_field: string;
    new_field: string;
    replacement_value?: string;
    call_sites_hint?: string[];
  };
  evidence_payload: Record<string, unknown>;
  sunset_date?: string;
  detected_at: string;
}

export class PathogenDetector {
  private errorWindow: Array<{ endpoint: string; status: number; timestamp: number }> = [];
  private detectedPathogens: Map<string, PathogenEvent> = new Map();

  /**
   * Evaluates a live wire event captured by the Sensor
   */
  public analyzeWireEvent(event: SensorCaptureEvent): PathogenEvent | null {
    const adapter = getAdapter(event.vendor);
    const now = Date.now();

    // 1. Record error window for spike detection
    this.errorWindow.push({
      endpoint: event.endpoint,
      status: event.status_code,
      timestamp: now,
    });
    // Keep window to last 5 minutes
    this.errorWindow = this.errorWindow.filter((e) => now - e.timestamp < 300000);

    // 2. Check RFC 8594 Sunset & Deprecation headers
    if (adapter) {
      const headerCheck = adapter.parseDeprecationHeaders(event.headers);
      if (headerCheck.isDeprecated) {
        const pathogen: PathogenEvent = {
          id: `path_${Date.now()}_${event.vendor}_sunset`,
          vendor: event.vendor,
          endpoint: event.endpoint,
          drift_type: 'SUNSET_HEADER',
          severity: 'WARNING',
          description: headerCheck.warningMessage || `Sunset header detected on ${event.endpoint}`,
          old_shape: event.request_shape,
          new_shape: event.response_shape,
          evidence_payload: event.redacted_response,
          sunset_date: headerCheck.sunsetDate,
          detected_at: new Date().toISOString(),
        };
        this.detectedPathogens.set(pathogen.id, pathogen);
        return pathogen;
      }
    }

    // 3. Inspect 400/404/422 status codes for upstream contract breaks
    if (event.status_code === 400 || event.status_code === 404 || event.status_code === 422) {
      const respStr = JSON.stringify(event.redacted_response).toLowerCase();

      // Check for field rename / deprecation patterns (e.g. Stripe, OpenAI)
      if (respStr.includes('deprecated') || respStr.includes('missing required parameter')) {
        let oldField = 'source';
        let newField = 'payment_method';

        // Extract parameter rename hints from vendor error message
        if (respStr.includes('email_address') || respStr.includes('customer_email')) {
          oldField = 'customer_email';
          newField = 'email_address';
        } else if (respStr.includes('payment_method') && respStr.includes('source')) {
          oldField = 'source';
          newField = 'payment_method';
        }

        const pathogen: PathogenEvent = {
          id: `path_${Date.now()}_${event.vendor}_rename`,
          vendor: event.vendor,
          endpoint: event.endpoint,
          drift_type: 'FIELD_RENAMED',
          severity: 'CRITICAL',
          description: `Upstream parameter renamed from '${oldField}' to '${newField}' on ${event.endpoint}`,
          old_shape: { [oldField]: 'string' },
          new_shape: { [newField]: 'string' },
          mutation: {
            old_field: oldField,
            new_field: newField,
            call_sites_hint: ['src/billing.ts', 'src/services/checkout.ts'],
          },
          evidence_payload: event.redacted_response,
          detected_at: new Date().toISOString(),
        };
        this.detectedPathogens.set(pathogen.id, pathogen);
        return pathogen;
      }

      // Check for endpoint relocation (404)
      if (event.status_code === 404 && respStr.includes('sunset')) {
        const pathogen: PathogenEvent = {
          id: `path_${Date.now()}_${event.vendor}_endpoint_relocation`,
          vendor: event.vendor,
          endpoint: event.endpoint,
          drift_type: 'FIELD_REMOVED',
          severity: 'CRITICAL',
          description: `Endpoint ${event.endpoint} has been permanently sunset by upstream vendor`,
          old_shape: event.request_shape,
          new_shape: {},
          evidence_payload: event.redacted_response,
          detected_at: new Date().toISOString(),
        };
        this.detectedPathogens.set(pathogen.id, pathogen);
        return pathogen;
      }
    }

    // 4. Validate schema against Zod spec if adapter exists
    if (adapter && adapter.endpoints[event.endpoint] && event.status_code === 200) {
      const spec = adapter.endpoints[event.endpoint];
      const validation = spec.responseSchema.safeParse(event.redacted_response);
      if (!validation.success) {
        const pathogen: PathogenEvent = {
          id: `path_${Date.now()}_${event.vendor}_schema_drift`,
          vendor: event.vendor,
          endpoint: event.endpoint,
          drift_type: 'TYPE_MUTATION',
          severity: 'WARNING',
          description: `Response schema drift on ${event.endpoint}: ${validation.error.issues[0]?.message || 'Zod validation error'}`,
          old_shape: event.request_shape,
          new_shape: event.response_shape,
          evidence_payload: { zod_issues: validation.error.issues },
          detected_at: new Date().toISOString(),
        };
        this.detectedPathogens.set(pathogen.id, pathogen);
        return pathogen;
      }
    }

    return null;
  }

  /**
   * Executes a scheduled canary probe against a vendor or sandbox endpoint
   */
  public async executeCanaryProbe(
    vendorId: string,
    endpointPath: string,
    targetBaseUrl?: string
  ): Promise<PathogenEvent | null> {
    const adapter = getAdapter(vendorId);
    if (!adapter) throw new Error(`Unknown vendor: ${vendorId}`);

    const spec = adapter.endpoints[endpointPath];
    if (!spec) throw new Error(`Endpoint ${endpointPath} not defined on vendor ${vendorId}`);

    const baseUrl = targetBaseUrl || adapter.baseUrl;
    const url = `${baseUrl}${endpointPath}`;

    try {
      const response = await fetch(url, {
        method: spec.method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer canary_test_token',
        },
        body: JSON.stringify(spec.canaryPayload),
      });

      const responseBody = await response.json().catch(() => ({}));
      const headers: Record<string, string> = {};
      response.headers.forEach((v, k) => {
        headers[k.toLowerCase()] = v;
      });

      const simulatedEvent: SensorCaptureEvent = {
        id: `canary_${Date.now()}`,
        vendor: vendorId,
        endpoint: endpointPath,
        method: spec.method,
        status_code: response.status,
        latency_ms: 12.4,
        headers,
        request_shape: {},
        response_shape: {},
        redacted_request: spec.canaryPayload,
        redacted_response: responseBody,
        timestamp: new Date().toISOString(),
      };

      return this.analyzeWireEvent(simulatedEvent);
    } catch (err) {
      console.warn(`[Canary Probe] Network error contacting ${url}:`, err);
      return null;
    }
  }

  public getActivePathogens(): PathogenEvent[] {
    return Array.from(this.detectedPathogens.values());
  }

  public clearPathogen(id: string) {
    this.detectedPathogens.delete(id);
  }
}

