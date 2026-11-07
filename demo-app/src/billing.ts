/**
 * DEMO APP: Customer Billing Service
 * Integrates with Stripe via the Immunix Sensor SDK
 */

import { createSensorClient } from '../../src/immunix/sensor';

export interface ChargeResult {
  id: string;
  status: string;
  amount: number;
  currency: string;
  paid: boolean;
}

export class BillingService {
  private stripeUrl: string;
  private sensorFetch: (url: string | URL, init?: RequestInit) => Promise<Response>;

  constructor(stripeUrl = 'http://localhost:4000') {
    this.stripeUrl = stripeUrl;
    this.sensorFetch = createSensorClient({
      vendor: 'stripe',
    });
  }

  public async chargeCustomer(token: string, amountCents: number): Promise<ChargeResult> {
    const response = await this.sensorFetch(`${this.stripeUrl}/v1/charges`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer sk_live_mock_secret_key_9941a82b9c',
      },
      body: JSON.stringify({
        amount: amountCents,
        currency: 'usd',
        source: token,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Stripe charge failed [HTTP ${response.status}]: ${JSON.stringify(errorData)}`);
    }

    return (await response.json()) as ChargeResult;
  }
}

