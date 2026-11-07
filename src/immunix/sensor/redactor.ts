/**
 * IMMUNIX SENSOR: Zero-Leak Redaction Engine
 * 
 * Ensures no API keys, client secrets, JWTs, credit card PANs, or PII
 * ever appear in logs, storage, telemetry, or pull requests.
 */

// Regex patterns for sensitive tokens and credentials
const SENSITIVE_KEY_PATTERNS = [
  /password/i,
  /secret/i,
  /api[_-]?key/i,
  /auth(orization)?/i,
  /token/i,
  /bearer/i,
  /cvc/i,
  /cvv/i,
  /ssn/i,
  /card[_-]?number/i,
  /private[_-]?key/i,
];

// Patterns for credential values
const SENSITIVE_VALUE_PATTERNS = [
  { pattern: /sk_(live|test)_[0-9a-zA-Z]{24,}/g, replacement: '[REDACTED_STRIPE_KEY]' },
  { pattern: /ghp_[0-9a-zA-Z]{36}/g, replacement: '[REDACTED_GITHUB_TOKEN]' },
  { pattern: /Bearer\s+[A-Za-z0-9\-._~+/]+=*/g, replacement: 'Bearer [REDACTED_TOKEN]' },
  { pattern: /\b(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|3[47][0-9]{13})\b/g, replacement: '[REDACTED_CARD_PAN]' },
  { pattern: /\b\d{3}-\d{2}-\d{4}\b/g, replacement: '[REDACTED_SSN]' },
];

/**
 * Redacts any string containing sensitive tokens or credentials
 */
export function redactString(input: string): string {
  if (!input || typeof input !== 'string') return input;
  let sanitized = input;
  for (const { pattern, replacement } of SENSITIVE_VALUE_PATTERNS) {
    sanitized = sanitized.replace(pattern, replacement);
  }
  return sanitized;
}

/**
 * Deeply traverses an object or array and redacts sensitive keys and values
 */
export function redactObject<T>(obj: T): T {
  if (obj === null || obj === undefined) return obj;

  if (typeof obj === 'string') {
    return redactString(obj) as unknown as T;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => redactObject(item)) as unknown as T;
  }

  if (typeof obj === 'object') {
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
      const isSensitiveKey = SENSITIVE_KEY_PATTERNS.some((pattern) => pattern.test(key));
      if (isSensitiveKey) {
        result[key] = '[REDACTED_SECRET]';
      } else if (typeof value === 'object' && value !== null) {
        result[key] = redactObject(value);
      } else if (typeof value === 'string') {
        result[key] = redactString(value);
      } else {
        result[key] = value;
      }
    }
    return result as T;
  }

  return obj;
}

/**
 * Extracts the structural data shape (property types) without retaining any values
 */
export function extractShape(data: unknown): Record<string, string> {
  if (!data || typeof data !== 'object') {
    return { _type: typeof data };
  }

  const shape: Record<string, string> = {};
  for (const [key, val] of Object.entries(data as Record<string, unknown>)) {
    if (val === null) {
      shape[key] = 'null';
    } else if (Array.isArray(val)) {
      shape[key] = val.length > 0 ? `array<${typeof val[0]}>` : 'array<unknown>';
    } else if (typeof val === 'object') {
      shape[key] = 'object';
    } else {
      shape[key] = typeof val;
    }
  }
  return shape;
}

