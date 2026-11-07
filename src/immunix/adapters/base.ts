/**
 * IMMUNIX ADAPTERS: Modular Upstream SaaS Specification
 * 
 * Each vendor has a dedicated adapter defining endpoint contracts,
 * Zod validation schemas, and canary payloads. When a vendor updates,
 * only the adapter file needs to be modified.
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

export interface VendorAdapter {
  id: string;
  name: string;
  baseUrl: string;
  endpoints: Record<string, EndpointSpec>;
  parseDeprecationHeaders: (headers: Record<string, string>) => {
    isDeprecated: boolean;
    sunsetDate?: string;
    warningMessage?: string;
  };
}

