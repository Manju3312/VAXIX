/**
 * IMMUNIX ADAPTER: Stripe Billing & Charges Adapter
 */

import { z } from 'zod';
import { VendorAdapter } from './base';

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
  parseDeprecationHeaders: (headers: Record<string, string>) => {
    const deprecation = headers['deprecation'];
    const sunset = headers['sunset'];
    const stripeVersion = headers['stripe-version'];

    const isDeprecated = Boolean(deprecation || sunset);
    return {
      isDeprecated,
      sunsetDate: sunset || undefined,
      warningMessage: isDeprecated
        ? `Stripe API version ${stripeVersion || 'v2020-08-27'} deprecated. Sunset date: ${sunset || 'Immediate'}`
        : undefined,
    };
  },
};

