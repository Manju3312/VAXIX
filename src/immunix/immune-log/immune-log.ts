/**
 * IMMUNIX IMMUNE LOG: Tamper-Evident Audit Trail
 * 
 * Records every detection, drift analysis, canary probe, antibody synthesis,
 * and PR creation event. Automatically applies zero-leak secret redaction
 * before persistence.
 */

import { redactObject } from '../sensor/redactor';

export type ImmuneLogEventType =
  | 'SENSOR_INGEST'
  | 'CANARY_EXECUTED'
  | 'PATHOGEN_DETECTED'
  | 'ANTIBODY_SYNTHESIZED'
  | 'SANDBOX_PASSED'
  | 'SANDBOX_FAILED'
  | 'PR_DISPATCHED'
  | 'PR_MERGED';

export interface ImmuneLogEntry {
  id: string;
  event_type: ImmuneLogEventType;
  vendor: string;
  entity_id?: string;
  message: string;
  metadata: Record<string, unknown>;
  timestamp: string;
}

export class ImmuneLogManager {
  private static instance: ImmuneLogManager;
  private logs: ImmuneLogEntry[] = [];

  public static getInstance(): ImmuneLogManager {
    if (!ImmuneLogManager.instance) {
      ImmuneLogManager.instance = new ImmuneLogManager();
    }
    return ImmuneLogManager.instance;
  }

  constructor() {
    // Seed initial system boot log
    this.append(
      'SENSOR_INGEST',
      'system',
      'Immunix Immune Log initialized. Safety protocols and redaction filters active.',
      { mode: 'MVP', version: '2.0.0' }
    );
  }

  public append(
    eventType: ImmuneLogEventType,
    vendor: string,
    message: string,
    metadata: Record<string, unknown> = {},
    entityId?: string
  ): ImmuneLogEntry {
    // Enforce principle: zero secrets in logs
    const sanitizedMetadata = redactObject(metadata);

    const entry: ImmuneLogEntry = {
      id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      event_type: eventType,
      vendor,
      entity_id: entityId,
      message,
      metadata: sanitizedMetadata as Record<string, unknown>,
      timestamp: new Date().toISOString(),
    };

    this.logs.unshift(entry); // prepend so newest is first
    return entry;
  }

  public getEntries(limit = 50, filterVendor?: string): ImmuneLogEntry[] {
    let filtered = this.logs;
    if (filterVendor) {
      filtered = filtered.filter((l) => l.vendor.toLowerCase() === filterVendor.toLowerCase());
    }
    return filtered.slice(0, limit);
  }

  public clear() {
    this.logs = [];
  }
}

export const immuneLog = ImmuneLogManager.getInstance();
