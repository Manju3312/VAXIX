/**
 * IMMUNIX ADAPTERS: Modular Upstream SaaS Specification
 * 
 * Each vendor has a dedicated adapter defining endpoint contracts,
 * Zod validation schemas, and canary payloads. Standardized against:
 * - RFC 8594: Sunset HTTP Header
 * - RFC 9745: Deprecation HTTP Header
 * - RFC 9457: Problem Details for HTTP APIs (replacing RFC 7807)
 */

import { z } from 'zod';

export interface EndpointSpec {
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  description: string;
  requestSchema: z.ZodTypeAny;
  responseSchema: z.ZodTypeAny;
  canaryPayload: Record<string, unknown>;
  expectedHeaders?: string[];
}

export interface RfcComplianceHeaderResult {
  isDeprecated: boolean;
  sunsetDate?: string;
  deprecationDate?: string;
  rfcStandard?: 'RFC_8594' | 'RFC_9745' | 'RFC_9457';
  warningMessage?: string;
  problemDetails?: {
    type?: string;
    title?: string;
    detail?: string;
    instance?: string;
    code?: string;
  };
}

export interface VendorAdapter {
  id: string;
  name: string;
  baseUrl: string;
  endpoints: Record<string, EndpointSpec>;
  parseDeprecationHeaders: (headers: Record<string, string>, responseBody?: Record<string, unknown>) => RfcComplianceHeaderResult;
}
