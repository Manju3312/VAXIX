/**
 * IMMUNIX ADAPTER: OpenAI Model & Inference Adapter
 */

import { z } from 'zod';
import { VendorAdapter } from './base';

export const OpenAIChatRequestSchema = z.object({
  model: z.string(),
  messages: z.array(
    z.object({
      role: z.enum(['system', 'user', 'assistant', 'developer']),
      content: z.string(),
    })
  ),
  temperature: z.number().min(0).max(2).optional(),
  max_tokens: z.number().positive().optional(),
  max_completion_tokens: z.number().positive().optional(),
});

export const OpenAIChatResponseSchema = z.object({
  id: z.string().startsWith('chatcmpl-'),
  object: z.literal('chat.completion'),
  created: z.number(),
  model: z.string(),
  choices: z.array(
    z.object({
      index: z.number(),
      message: z.object({
        role: z.string(),
        content: z.string(),
      }),
      finish_reason: z.string(),
    })
  ),
});

export const openaiAdapter: VendorAdapter = {
  id: 'openai',
  name: 'OpenAI AI Platform',
  baseUrl: 'https://api.openai.com',
  endpoints: {
    '/v1/chat/completions': {
      path: '/v1/chat/completions',
      method: 'POST',
      description: 'Create chat completion models (GPT-4o, etc.)',
      requestSchema: OpenAIChatRequestSchema,
      responseSchema: OpenAIChatResponseSchema,
      canaryPayload: {
        model: 'gpt-4o',
        messages: [{ role: 'user', content: 'Ping' }],
        max_tokens: 16,
      },
    },
  },
  parseDeprecationHeaders: (headers: Record<string, string>) => {
    const deprecation = headers['openai-model-deprecated'] || headers['deprecation'];
    const sunset = headers['sunset'];
    const isDeprecated = Boolean(deprecation || sunset);
    return {
      isDeprecated,
      sunsetDate: sunset || undefined,
      warningMessage: isDeprecated
        ? `OpenAI model sunset detected. Migrate to supported chat completion endpoint.`
        : undefined,
    };
  },
};

