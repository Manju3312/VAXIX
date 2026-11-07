import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function POST(req: NextRequest) {
  const startTime = performance.now();

  try {
    const body = await req.json();
    const { scenario_id, custom_payload, cluster_id = 'aws-us-east-1' } = body;

    let vendor = 'Custom API';
    let beforePayload: Record<string, unknown> = {};
    let afterPayload: Record<string, unknown> = {};
    let astPatch = '';

    if (scenario_id === 'PROPERTY_RENAMED') {
      vendor = 'Stripe Payments v2026';
      beforePayload = {
        id: 'ch_3N4xLm2eZvKYlo2C1',
        object: 'charge',
        amount: 4900,
        currency: 'usd',
        email_address: 'patron@sovereign-holdings.ch',
        status: 'succeeded',
      };
      afterPayload = {
        ...beforePayload,
        customer_email: 'patron@sovereign-holdings.ch',
        _immunix_wire_bridge: 'SYNTHESIZED_FIELD_ALIAS',
        _latency_penalty_ms: 0.38,
      };
      astPatch = 'const recipient = charge.email_address ?? charge.customer_email;';
    } else if (scenario_id === 'ENDPOINT_RELOCATED') {
      vendor = 'Core Banking REST';
      beforePayload = {
        error: 'Not Found',
        status: 404,
        message: 'Endpoint /v1/charges is relocated to /v2/checkout/pay',
      };
      afterPayload = {
        status: 200,
        transaction_id: 'tx_9814a0f',
        cleared: true,
        amount: 142500,
        _immunix_rerouted: '/v1/charges ➔ /v2/checkout/pay',
        _latency_penalty_ms: 0.42,
      };
      astPatch = "return await http.post('/v2/checkout/pay', payload);";
    } else if (scenario_id === 'TYPE_MUTATED') {
      vendor = 'Twilio Cloud';
      beforePayload = {
        invoice_id: 'inv_8820',
        amount: '25000.00',
        tax: '1250.00',
      };
      afterPayload = {
        invoice_id: 'inv_8820',
        amount: 25000.0,
        tax: 1250.0,
        _immunix_type_coerced: ['string->number'],
        _latency_penalty_ms: 0.29,
      };
      astPatch = 'amount: z.union([z.number(), z.string().transform(Number)])';
    } else if (scenario_id === 'ENVELOPE_WRAPPED') {
      vendor = 'Salesforce Graph';
      beforePayload = {
        status: 'success',
        data: [{ id: 'usr_1', email: 'director@enterprise.com' }],
      };
      afterPayload = {
        data: [{ id: 'usr_1', email: 'director@enterprise.com' }],
        _immunix_unwrapped: true,
        _latency_penalty_ms: 0.35,
      };
      astPatch = 'const users = Array.isArray(res) ? res : res.data;';
    } else if (custom_payload) {
      beforePayload = custom_payload;
      afterPayload = {
        ...custom_payload,
        _immunix_healed: true,
        _latency_penalty_ms: 0.38,
      };
      astPatch = '// Custom AST alias automatically synthesized by IMMUNIX compiler engine';
    }

    const duration = Math.round((performance.now() - startTime + 0.38) * 100) / 100;
    const eventId = `evt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    // Persist event into SQLite
    try {
      const insertEvent = db.prepare(`
        INSERT INTO sabotage_events (id, scenario_id, vendor, status, latency_ms, payload_before, payload_after, ast_patch)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `);

      insertEvent.run(
        eventId,
        scenario_id || 'CUSTOM',
        vendor,
        'HEALED_ZERO_DOWNTIME',
        duration,
        JSON.stringify(beforePayload),
        JSON.stringify(afterPayload),
        astPatch
      );

      // Increment cluster shielded count
      db.prepare(`
        UPDATE clusters 
        SET shielded_count = shielded_count + 1, last_sync_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `).run(cluster_id);
    } catch (dbErr) {
      console.error('Database write error (non-fatal):', dbErr);
    }

    return NextResponse.json({
      success: true,
      event_id: eventId,
      vendor,
      cluster_id,
      wire_interception_speed: `${duration}ms`,
      outage_prevented: true,
      http_status_delivered: 200,
      raw_broken_payload: beforePayload,
      healed_payload: afterPayload,
      ast_patch: astPatch,
      herd_immunity_sync: '14,280 clusters notified',
      timestamp: new Date().toISOString(),
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json(
      {
        success: false,
        error: 'Sabotage processing exception',
        details: errorMsg,
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const events = db
      .prepare('SELECT * FROM sabotage_events ORDER BY created_at DESC LIMIT 10')
      .all();
    return NextResponse.json({
      success: true,
      count: events.length,
      events,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ success: false, error: errorMsg }, { status: 500 });
  }
}

