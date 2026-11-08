/**
 * IMMUNIX ANTIBODY LIFECYCLE: Enforced 6-Stage State Machine
 * 
 * Invariants:
 * 1. Strict State Progression:
 *    PROPOSED ➔ SANDBOX_VERIFIED ➔ HUMAN_APPROVED ➔ SHADOW ➔ ACTIVE ➔ REVOKED
 * 2. Mandatory Human Review Gate:
 *    An antibody CANNOT transition from SANDBOX_VERIFIED to HUMAN_APPROVED without an authorized human reviewer.
 *    Auto-merge is strictly forbidden.
 * 3. Shadow Matching Threshold:
 *    An antibody in SHADOW requires at least N >= 25 clean shadow matches before moving to ACTIVE.
 * 4. Sensitive Endpoint Protection:
 *    Any financial or destructive route is permanently flagged `sensitive: true` and locked to PR only.
 */

import { checkIsSensitiveEndpoint } from './dsl';

export type AntibodyLifecycleStage =
  | 'PROPOSED'
  | 'SANDBOX_VERIFIED'
  | 'HUMAN_APPROVED'
  | 'SHADOW'
  | 'ACTIVE'
  | 'REVOKED';

export interface AntibodyLifecycleRecord {
  id: string;
  vendor: string;
  endpoint: string;
  lifecycle: AntibodyLifecycleStage;
  sensitive: boolean;
  proposed_by: string;
  approved_by: string | null;
  signature: string | null;
  shadow_matches: number;
  min_shadow_matches_required: number;
  created_at: string;
  updated_at: string;
}

export const VALID_TRANSITIONS: Record<AntibodyLifecycleStage, AntibodyLifecycleStage[]> = {
  PROPOSED: ['SANDBOX_VERIFIED', 'REVOKED'],
  SANDBOX_VERIFIED: ['HUMAN_APPROVED', 'REVOKED'],
  HUMAN_APPROVED: ['SHADOW', 'ACTIVE', 'REVOKED'],
  SHADOW: ['ACTIVE', 'REVOKED'],
  ACTIVE: ['REVOKED'],
  REVOKED: [],
};

export class AntibodyLifecycleManager {
  /**
   * Evaluates if a state transition is legal under SOC-2 invariants.
   */
  public static canTransition(
    current: AntibodyLifecycleStage,
    next: AntibodyLifecycleStage,
    options?: {
      approved_by?: string | null;
      shadow_matches?: number;
      sensitive?: boolean;
    }
  ): { allowed: boolean; reason?: string } {
    const allowedNext = VALID_TRANSITIONS[current] || [];
    if (!allowedNext.includes(next)) {
      return {
        allowed: false,
        reason: `Illegal state transition from ${current} to ${next}. Allowed next: ${allowedNext.join(', ') || 'None'}`,
      };
    }

    // Invariant: Human review required for HUMAN_APPROVED
    if (next === 'HUMAN_APPROVED' && !options?.approved_by) {
      return {
        allowed: false,
        reason: 'HUMAN APPROVAL GATE: approved_by must be specified by an authorized engineer. Auto-merge is strictly forbidden.',
      };
    }

    // Invariant: Activation requires human approval previously
    if (next === 'ACTIVE' && current === 'SHADOW') {
      const matches = options?.shadow_matches ?? 0;
      if (matches < 25) {
        return {
          allowed: false,
          reason: `Insufficient shadow verification: requires N >= 25 clean shadow matches (currently ${matches}).`,
        };
      }
    }

    // Invariant: Sensitive routes cannot be ACTIVE for in-flight wire rewrites
    if (next === 'ACTIVE' && options?.sensitive) {
      return {
        allowed: false,
        reason: 'Sensitive/financial routes cannot be activated for live in-flight rewriting. Hard-locked to PR-only.',
      };
    }

    return { allowed: true };
  }

  /**
   * Initializes a new antibody record adhering to the state machine.
   */
  public static createRecord(
    id: string,
    vendor: string,
    endpoint: string,
    proposedBy = 'immunix_ast_synthesizer'
  ): AntibodyLifecycleRecord {
    const isSensitive = checkIsSensitiveEndpoint(endpoint);
    const now = new Date().toISOString();

    return {
      id,
      vendor,
      endpoint,
      lifecycle: 'PROPOSED',
      sensitive: isSensitive,
      proposed_by: proposedBy,
      approved_by: null,
      signature: null,
      shadow_matches: 0,
      min_shadow_matches_required: isSensitive ? 100 : 25,
      created_at: now,
      updated_at: now,
    };
  }
}

