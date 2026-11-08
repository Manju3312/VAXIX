/**
 * IMMUNIX ADAPTER: Stripe Billing & Charges Adapter
 * Standards: RFC 9745 (Deprecation), RFC 8594 (Sunset), RFC 9457 (Problem Details)
 */

import { z } from 'zod';
import { VendorAdapter, RfcComplianceHeaderResult } from './base';

export const StripeChargeRequestSchema = z.object({
  amount: z.number().positive(),
  currency: z.string().length(3),
  source: z.string().optional(),
  payment_method: z.string().optional(),
  customer_email: z.string().email().optional(),
  email_address: z.string().email().optional(),
});

export const StripeChargeResponseSchema = z.object({
  id: z.string().startsWith('ch_').or(z.string().startsWith('pi_')),
  status: z.enum(['succeeded', 'pending', 'failed', 'requires_action']),
  amount: z.number(),
  currency: z.string(),
  paid: z.boolean(),
});

export const stripeAdapter: VendorAdapter = {
  id: 'stripe',
  name: 'Stripe Billing & Payments',
  baseUrl: 'https://api.stripe.com',
  endpoints: {
    '/v1/charges': {
      path: '/v1/charges',
      method: 'POST',
      description: 'Create a Stripe charge or payment intent',
      requestSchema: StripeChargeRequestSchema,
      responseSchema: StripeChargeResponseSchema,
      canaryPayload: {
        amount: 2000,
        currency: 'usd',
        source: 'tok_visa',
      },
    },
    '/v1/payment_intents': {
      path: '/v1/payment_intents',
      method: 'POST',
      description: 'Create a Stripe PaymentIntent',
      requestSchema: StripeChargeRequestSchema,
      responseSchema: StripeChargeResponseSchema,
      canaryPayload: {
        amount: 5000,
        currency: 'usd',
        payment_method: 'pm_card_visa',
      },
    },
  },
  parseDeprecationHeaders: (headers: Record<string, string>, responseBody?: Record<string, unknown>): RfcComplianceHeaderResult => {
    const deprecation = headers['deprecation'];
    const sunset = headers['sunset'];
    const stripeVersion = headers['stripe-version'];
    const contentType = headers['content-type'] || '';

    const isDeprecated = Boolean(deprecation || sunset);
    let rfcStandard: 'RFC_8594' | 'RFC_9745' | 'RFC_9457' | undefined = undefined;

    if (sunset) rfcStandard = 'RFC_8594';
    if (deprecation) rfcStandard = 'RFC_9745';
    if (contentType.includes('problem+json')) rfcStandard = 'RFC_9457';

    // Parse RFC 9457 problem details if present in body
    let problemDetails: RfcComplianceHeaderResult['problemDetails'] = undefined;
    if (responseBody && typeof responseBody === 'object') {
      const err = (responseBody.error || responseBody) as Record<string, unknown>;
      if (err.type || err.title || err.detail || err.message) {
        problemDetails = {
          type: String(err.type || 'https://stripe.com/docs/error-codes/parameter-deprecated'),
          title: String(err.title || 'Parameter Deprecated'),
          detail: String(err.detail || err.message || ''),
          code: String(err.code || 'parameter_deprecated'),
        };
      }
    }

    return {
      isDeprecated,
      sunsetDate: sunset || undefined,
      deprecationDate: deprecation || undefined,
      rfcStandard,
      warningMessage: isDeprecated
        ? `Stripe API version ${stripeVersion || '2025-03-31.basil'} deprecated. Sunset date: ${sunset || 'Immediate'}`
        : undefined,
      problemDetails,
    };
  },
};
