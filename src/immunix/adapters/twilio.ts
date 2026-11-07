/**
 * IMMUNIX ADAPTER: Twilio Programmable Communications Adapter
 */

import { z } from 'zod';
import { VendorAdapter } from './base';

export const TwilioMessageRequestSchema = z.object({
  To: z.string().startsWith('+'),
  From: z.string().startsWith('+').optional(),
  Body: z.string().min(1),
});

export const TwilioMessageResponseSchema = z.object({
  sid: z.string().startsWith('SM'),
  date_created: z.string(),
  status: z.enum(['queued', 'sending', 'sent', 'delivered', 'failed']),
  to: z.string(),
  from: z.string().optional(),
  body: z.string(),
});

export const twilioAdapter: VendorAdapter = {
  id: 'twilio',
  name: 'Twilio Programmable SMS',
  baseUrl: 'https://api.twilio.com',
  endpoints: {
    '/2010-04-01/Accounts/AC123/Messages.json': {
      path: '/2010-04-01/Accounts/AC123/Messages.json',
      method: 'POST',
      description: 'Send programmable SMS dispatch',
      requestSchema: TwilioMessageRequestSchema,
      responseSchema: TwilioMessageResponseSchema,
      canaryPayload: {
        To: '+14155552671',
        Body: 'Immunix Canary Test verification code: 894120',
      },
    },
  },
  parseDeprecationHeaders: (headers: Record<string, string>) => {
    const sunset = headers['sunset'];
    const deprecation = headers['deprecation'];
    const isDeprecated = Boolean(sunset || deprecation);
    return {
      isDeprecated,
      sunsetDate: sunset || undefined,
      warningMessage: isDeprecated
        ? `Twilio API v1 message dispatch endpoint will sunset on ${sunset || 'soon'}.`
        : undefined,
    };
  },
};

