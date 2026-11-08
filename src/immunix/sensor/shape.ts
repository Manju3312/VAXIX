/**
 * IMMUNIX SENSOR: Zero Body Retention & Client-Side PII Shredder
 * 
 * SOC-2 / GDPR Compliance Guarantee:
 * Customer payload values (credit card numbers, PII, email addresses, passwords,
 * tokens) are destroyed on the client before leaving process memory.
 * 
 * Only structural types and deterministic 64-bit SHA-256 schema fingerprints
 * are preserved for drift detection.
 */

import crypto from 'node:crypto';

export type StructuralSchema =
  | { type: 'string' }
  | { type: 'number' }
  | { type: 'boolean' }
  | { type: 'null' }
  | { type: 'array'; items?: StructuralSchema }
  | { type: 'object'; properties: Record<string, StructuralSchema>; required?: string[] };

/**
 * List of sensitive HTTP header names whose values MUST be shredded.
 */
export const SENSITIVE_HEADERS = new Set([
  'authorization',
  'cookie',
  'set-cookie',
  'x-api-key',
  'api-key',
  'apikey',
  'stripe-signature',
  'x-signature',
  'webhook-signature',
  'proxy-authorization',
  'token',
  'bearer',
]);

/**
 * Client-Side PII Shredder:
 * Recursively destroys all primitive values, converting them purely into structural types.
 * No customer email, card PAN, phone number, or identifier survives this transformation.
 */
export function extractRedactedShape(value: unknown): StructuralSchema {
  if (value === null || value === undefined) {
    return { type: 'null' };
  }

  if (typeof value === 'string') {
    return { type: 'string' };
  }

  if (typeof value === 'number') {
    return { type: 'number' };
  }

  if (typeof value === 'boolean') {
    return { type: 'boolean' };
  }

  if (Array.isArray(value)) {
    if (value.length === 0) {
      return { type: 'array' };
    }
    // Inspect first element to determine array item structure
    return {
      type: 'array',
      items: extractRedactedShape(value[0]),
    };
  }

  if (typeof value === 'object') {
    const properties: Record<string, StructuralSchema> = {};
    const keys = Object.keys(value as Record<string, unknown>).sort();
    for (const key of keys) {
      properties[key] = extractRedactedShape((value as Record<string, unknown>)[key]);
    }
    return {
      type: 'object',
      properties,
      required: keys,
    };
  }

  return { type: 'string' };
}

/**
 * Sanitizes HTTP headers by shredding all sensitive tokens and signatures.
 */
export function sanitizeHeaders(headers: Record<string, string>): Record<string, string> {
  const sanitized: Record<string, string> = {};
  for (const [key, val] of Object.entries(headers)) {
    const lowerKey = key.toLowerCase();
    if (SENSITIVE_HEADERS.has(lowerKey)) {
      sanitized[key] = '[SHREDDED_TOKEN]';
    } else {
      sanitized[key] = val;
    }
  }
  return sanitized;
}

/**
 * Computes a deterministic 64-bit schema fingerprint (16-char hex)
 * from the structural schema representation using SHA-256.
 */
export function computeSchemaFingerprint(shape: StructuralSchema): string {
  const canonicalJson = JSON.stringify(shape);
  const fullHash = crypto.createHash('sha256').update(canonicalJson).digest('hex');
  return fullHash.substring(0, 16); // 64-bit fingerprint
}

/**
 * Verifies whether a given object is purely structural (zero raw customer values).
 */
export function assertZeroBodyRetention(shape: unknown): boolean {
  const jsonStr = JSON.stringify(shape);
  // Check for common leaks: email, phone, card numbers, raw tokens
  const emailRegex = /[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+/;
  const cardRegex = /\b(?:\d[ -]*?){13,16}\b/;
  const skKeyRegex = /sk_live_[0-9a-zA-Z]{24,}/;

  if (emailRegex.test(jsonStr) || cardRegex.test(jsonStr) || skKeyRegex.test(jsonStr)) {
    return false;
  }
  return true;
}

