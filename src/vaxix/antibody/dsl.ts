/**
 * VAXIX ANTIBODY DSL: Allowlisted 5-Operation Declarative AST Grammar
 * 
 * Invariants:
 * 1. Restricts mutations strictly to 5 deterministic operations.
 *    Zero generative LLM guesswork, zero non-deterministic modifications.
 * 2. Sensitive routes (financial/destructive) are hard-locked to Pull Request only.
 *    In-flight live rewriting is strictly blocked by default on sensitive routes.
 */

export type AllowlistedOperation =
  | { op: 'rename_field'; path: string; from: string; to: string }
  | { op: 'move_endpoint'; from: string; to: string; method?: string }
  | { op: 'coerce_type'; path: string; targetType: 'string' | 'number' | 'boolean' | 'integer' }
  | { op: 'add_default'; path: string; defaultValue: unknown }
  | { op: 'drop_field'; path: string };

export type RuleLifecycle =
  | 'PROPOSED'
  | 'SANDBOX_VERIFIED'
  | 'HUMAN_APPROVED'
  | 'SHADOW'
  | 'ACTIVE'
  | 'REVOKED';

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
  defaultValue: unknown;
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
  | DropFieldOp
  | AllowlistedOperation;

export interface DeclarativeAntibodyRule {
  id: string;
  vendor: string;
  version: string;
  endpointPattern: string;
  sensitive: boolean;
  operations: (DslOperation | AllowlistedOperation)[];
  signature?: string;
  createdAt: string;
}

/**
 * Enforces sensitive defaults: endpoints matching charges, payments, transfers, or deletions
 * MUST have sensitive=true and cannot bypass human approval or live rewrite gates.
 */
export function checkIsSensitiveEndpoint(endpoint: string, method?: string): boolean {
  const lower = endpoint.toLowerCase();
  const m = method?.toUpperCase();
  if (m === 'DELETE') return true;
  return (
    lower.includes('charge') ||
    lower.includes('payment') ||
    lower.includes('payout') ||
    lower.includes('refund') ||
    lower.includes('transfer') ||
    lower.includes('delete') ||
    lower.includes('card') ||
    lower.includes('bank_account') ||
    lower.includes('balance')
  );
}

/**
 * Validates that an operation conforms strictly to the 5 allowed DSL operations.
 */
export function validateDslOperation(op: unknown): DslOperation {
  if (!op || typeof op !== 'object') {
    throw new Error('DSL Operation must be a non-null object');
  }

  const candidate = op as Record<string, unknown>;
  const opType = (candidate.op || candidate.type) as string;

  const validTypes = ['rename_field', 'move_endpoint', 'coerce_type', 'add_default', 'drop_field'];
  if (!validTypes.includes(opType)) {
    throw new Error(
      `Disallowed AST operation: "${opType}". Allowed grammar strictly limited to: ${validTypes.join(', ')}`
    );
  }

  return op as DslOperation;
}

/**
 * Applies a declarative rule to an in-flight JSON payload in memory.
 */
export function applyDslRuleToPayload(
  body: Record<string, unknown>,
  rule: DeclarativeAntibodyRule
): Record<string, unknown> {
  const cloned = JSON.parse(JSON.stringify(body));

  for (const op of rule.operations) {
    if ('op' in op) {
      if (op.op === 'rename_field') {
        if (op.from in cloned) {
          cloned[op.to] = cloned[op.from];
          delete cloned[op.from];
        }
      } else if (op.op === 'add_default') {
        if (!(op.path in cloned)) {
          cloned[op.path] = op.defaultValue;
        }
      } else if (op.op === 'drop_field') {
        delete cloned[op.path];
      }
    } else {
      if (op.type === 'rename_field') {
        if (op.target === 'body' && op.oldField in cloned) {
          cloned[op.newField] = cloned[op.oldField];
          delete cloned[op.oldField];
        }
      } else if (op.type === 'add_default') {
        if (op.target === 'body' && !(op.field in cloned)) {
          cloned[op.field] = op.defaultValue;
        }
      } else if (op.type === 'drop_field') {
        if (op.target === 'body') {
          delete cloned[op.field];
        }
      }
    }
  }

  return cloned;
}
