export * from './base';
export * from './stripe';
export * from './openai';
export * from './twilio';

import { VendorAdapter } from './base';
import { stripeAdapter } from './stripe';
import { openaiAdapter } from './openai';
import { twilioAdapter } from './twilio';

export const ADAPTER_REGISTRY: Record<string, VendorAdapter> = {
  stripe: stripeAdapter,
  openai: openaiAdapter,
  twilio: twilioAdapter,
};

export function getAdapter(vendorId: string): VendorAdapter | undefined {
  return ADAPTER_REGISTRY[vendorId.toLowerCase()];
}

