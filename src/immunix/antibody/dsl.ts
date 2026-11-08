/**
 * IMMUNIX ANTIBODY DSL: Allowlisted 5-Operation Declarative AST Grammar
 * 
 * Invariant:
 * 1. Restricts mutations strictly to 5 deterministic operations.
 *    Zero generative LLM guesswork, zero non-deterministic modifications.
 * 2. Sensitive routes (financial/destructive) are hard-locked to Pull Request only.
 *    In-flight live rewriting is strictly blocked by default on sensitive routes.
 */

export type DslOperationType =
  | 'rename_field'
  | 'move_endpoint'
  | 'coerce_type'
  | 'add_default'
  | 'drop_field';

export interface RenameFieldOp {
  type: 'rename_field';
  target: 'body' | 'headers' | 'query';
  oldField: string;
  newField: string;
}

export interface MoveEndpointOp {
  type: 'move_endpoint';
  oldEndpoint: string;
  newEndpoint: string;
}

export interface CoerceTypeOp {
  type: 'coerce_type';
  target: 'body';
  field: string;
  fromType: 'string' | 'number' | 'boolean';
  toType: 'string' | 'number' | 'boolean' | 'integer';
}

export interface AddDefaultOp {
  type: 'add_default';
  target: 'body' | 'headers';
  field: string;
  defaultValue: string | number | boolean;
}

export interface DropFieldOp {
  type: 'drop_field';
  target: 'body' | 'headers' | 'query';
  field: string;
}

export type DslOperation =
  | RenameFieldOp
  | MoveEndpointOp
  | CoerceTypeOp
  | AddDefaultOp
  | DropFieldOp;

export interface DeclarativeAntibodyRule {
  id: string;
  vendor: string;
  version: string;
  endpointPattern: string;
  sensitive: boolean;
  operations: DslOperation[];
  signature?: string;
  createdAt: string;
}

/**
 * Sensitive Endpoint Classifier:
 * Any route involving financial transactions or destructive mutations is hard-locked.
 */
export function checkIsSensitiveEndpoint(endpointOrUrl: string, method = 'POST'): boolean {
  const normalized = endpointOrUrl.toLowerCase();
  const sensitiveKeywords = [
    'charge',
    'payment',
    'payout',
    'refund',
    'transfer',
    'subscription',
    'card',
    'bank_account',
    'balance',
  ];

  if (method.toUpperCase() === 'DELETE') {
    return true;
  }

  return sensitiveKeywords.some((keyword) => normalized.includes(keyword));
}

/**
 * Validates that an operation conforms strictly to the 5 allowed DSL operations.
 */
export function validateDslOperation(op: unknown): DslOperation {
  if (!op || typeof op !== 'object') {
    throw new Error('DSL Operation must be a non-null object');
  }

  const { type } = op as { type?: string };
  switch (type) {
    case 'rename_field': {
      const o = op as RenameFieldOp;
      if (!o.target || !o.oldField || !o.newField) {
        throw new Error('rename_field requires target, oldField, and newField');
      }
      return o;
    }
    case 'move_endpoint': {
      const o = op as MoveEndpointOp;
      if (!o.oldEndpoint || !o.newEndpoint) {
        throw new Error('move_endpoint requires oldEndpoint and newEndpoint');
      }
      return o;
    }
    case 'coerce_type': {
      const o = op as CoerceTypeOp;
      if (!o.field || !o.fromType || !o.toType) {
        throw new Error('coerce_type requires field, fromType, and toType');
      }
      return o;
    }
    case 'add_default': {
      const o = op as AddDefaultOp;
      if (!o.field || o.defaultValue === undefined) {
        throw new Error('add_default requires field and defaultValue');
      }
      return o;
    }
    case 'drop_field': {
      const o = op as DropFieldOp;
      if (!o.target || !o.field) {
        throw new Error('drop_field requires target and field');
      }
      return o;
    }
    default:
      throw new Error(`Disallowed DSL operation type: ${type}. Allowed: rename_field, move_endpoint, coerce_type, add_default, drop_field.`);
  }
}

/**
 * Evaluates in-memory pre-flight payload mutation for Path A (Known Drift)
 * If the endpoint is sensitive and not explicitly allowed, execution is rejected.
 */
export function applyDslRuleToPayload(
  rule: DeclarativeAntibodyRule,
  payload: Record<string, unknown>,
  allowSensitiveOverride = false
): {
  success: boolean;
  mutatedPayload: Record<string, unknown>;
  blockedReason?: string;
} {
  if (rule.sensitive && !allowSensitiveOverride) {
    return {
      success: false,
      mutatedPayload: payload,
      blockedReason: 'In-flight rewrite blocked: Financial/sensitive endpoint. Routed to Human-Approved PR Lane.',
    };
  }

  const result: Record<string, unknown> = { ...payload };

  for (const op of rule.operations) {
    if (op.type === 'rename_field' && op.target === 'body') {
      if (op.oldField in result) {
        result[op.newField] = result[op.oldField];
        delete result[op.oldField];
      }
    } else if (op.type === 'add_default' && op.target === 'body') {
      if (!(op.field in result)) {
        result[op.field] = op.defaultValue;
      }
    } else if (op.type === 'drop_field' && op.target === 'body') {
      delete result[op.field];
    } else if (op.type === 'coerce_type' && op.target === 'body') {
      if (op.field in result) {
        const val = result[op.field];
        if (op.toType === 'integer') {
          result[op.field] = parseInt(String(val), 10);
        } else if (op.toType === 'number') {
          result[op.field] = Number(val);
        } else if (op.toType === 'string') {
          result[op.field] = String(val);
        } else if (op.toType === 'boolean') {
          result[op.field] = Boolean(val);
        }
      }
    }
  }

  return {
    success: true,
    mutatedPayload: result,
  };
}

