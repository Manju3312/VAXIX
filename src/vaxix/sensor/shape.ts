import * as crypto from 'node:crypto';

export type StructuralType = 'string' | 'number' | 'boolean' | 'null' | 'array' | 'object' | 'undefined';

export interface RedactedShape {
  type: StructuralType;
  properties?: Record<string, RedactedShape>;
  items?: RedactedShape;
}

export type StructuralSchema = RedactedShape;

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
 * Strips all values and derives purely structural schema representation.
 * Invariant: Raw values (PII, credentials, payloads) are destroyed immediately here.
 */
export function extractRedactedShape(value: unknown): RedactedShape {
  if (value === null) return { type: 'null' };
  if (value === undefined) return { type: 'undefined' };

  const t = typeof value;
  if (t === 'string') return { type: 'string' };
  if (t === 'number') return { type: 'number' };
  if (t === 'boolean') return { type: 'boolean' };

  if (Array.isArray(value)) {
    if (value.length === 0) return { type: 'array' };
    return { type: 'array', items: extractRedactedShape(value[0]) };
  }

  if (t === 'object') {
    const props: Record<string, RedactedShape> = {};
    const keys = Object.keys(value as Record<string, unknown>).sort();
    for (const key of keys) {
      props[key] = extractRedactedShape((value as Record<string, unknown>)[key]);
    }
    return { type: 'object', properties: props };
  }

  return { type: 'string' };
}

export function computeShapeFingerprint(shape: RedactedShape): string {
  const canonicalJson = JSON.stringify(shape);
  return crypto.createHash('sha256').update(canonicalJson).digest('hex').slice(0, 32);
}

export const computeSchemaFingerprint = computeShapeFingerprint;

export function redactHeaders(headers: Record<string, string>): Record<string, string> {
  const clean: Record<string, string> = {};
  for (const [key, value] of Object.entries(headers)) {
    const lowerKey = key.toLowerCase();
    if (!SENSITIVE_HEADERS.has(lowerKey)) {
      clean[lowerKey] = value;
    }
  }
  return clean;
}

export const sanitizeHeaders = redactHeaders;
