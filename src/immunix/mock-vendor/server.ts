/**
 * IMMUNIX MOCK VENDOR SERVER
 * 
 * Simulates upstream vendor APIs (Stripe, Twilio, OpenAI) with controllable
 * schema drift, field renames, and RFC 8594 Sunset / Deprecation headers.
 */

import http from 'node:http';

export interface MockServerOptions {
  port?: number;
  initialDrift?: boolean;
}

export class MockVendorServer {
  private server: http.Server | null = null;
  public port: number;
  public driftEnabled: boolean;
  public requestHistory: Array<{
    method: string;
    path: string;
    body: Record<string, unknown>;
    timestamp: string;
  }> = [];

  constructor(options: MockServerOptions = {}) {
    this.port = options.port || 4000;
    this.driftEnabled = options.initialDrift || false;
  }

  public setDrift(enabled: boolean) {
    this.driftEnabled = enabled;
  }

  public start(): Promise<number> {
    return new Promise((resolve) => {
      this.server = http.createServer((req, res) => {
        let rawBody = '';
        req.on('data', (chunk) => {
          rawBody += chunk;
        });

        req.on('end', () => {
          const url = new URL(req.url || '/', `http://localhost:${this.port}`);
          let parsedBody: Record<string, unknown> = {};
          try {
            parsedBody = rawBody ? JSON.parse(rawBody) : {};
          } catch {
            parsedBody = { _raw: rawBody };
          }

          this.requestHistory.push({
            method: req.method || 'GET',
            path: url.pathname,
            body: parsedBody,
            timestamp: new Date().toISOString(),
          });

          // Check for drift header override or server-level drift
          const driftForced = req.headers['x-simulate-drift'] === 'true' || this.driftEnabled;

          // 1. Control endpoint to toggle drift dynamically
          if (url.pathname === '/mock/drift') {
            if (req.method === 'POST') {
              this.driftEnabled = parsedBody.enabled === true;
              res.writeHead(200, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ success: true, driftEnabled: this.driftEnabled }));
              return;
            }
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ driftEnabled: this.driftEnabled }));
            return;
          }

          // 2. Stripe Charges / PaymentIntents endpoint
          if (url.pathname === '/v1/charges' || url.pathname === '/v1/payment_intents') {
            if (driftForced) {
              // The upstream drift sneeze: 'source' is rejected; 'payment_method' is required
              if (parsedBody.source && !parsedBody.payment_method) {
                res.writeHead(400, {
                  'Content-Type': 'application/json',
                  'Deprecation': '@1735689600',
                  'Sunset': 'Wed, 01 Jan 2026 00:00:00 GMT',
                  'Stripe-Version': '2025-03-31.basil',
                });
                res.end(
                  JSON.stringify({
                    error: {
                      type: 'invalid_request_error',
                      message: "Missing required parameter 'payment_method'. Note: Parameter 'source' was deprecated at 03:00 UTC.",
                      param: 'payment_method',
                      code: 'parameter_deprecated',
                    },
                  })
                );
                return;
              }
            }

            // Normal success response
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(
              JSON.stringify({
                id: 'ch_mock_stripe_9941a82',
                status: 'succeeded',
                amount: parsedBody.amount || 2000,
                currency: parsedBody.currency || 'usd',
                paid: true,
                payment_method: parsedBody.payment_method || parsedBody.source || 'pm_card_visa',
                created: Math.floor(Date.now() / 1000),
              })
            );
            return;
          }

          // 3. Twilio SMS Dispatch endpoint
          if (url.pathname.includes('/Messages.json')) {
            if (driftForced && req.headers['x-simulate-sunset'] === 'true') {
              res.writeHead(404, {
                'Content-Type': 'application/json',
                'Sunset': 'Wed, 01 Jan 2026 00:00:00 GMT',
              });
              res.end(
                JSON.stringify({
                  code: 20404,
                  message: 'Endpoint /v1/Messages sunset permanently. Relocated to /v2/Dispatches.',
                })
              );
              return;
            }

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(
              JSON.stringify({
                sid: 'SMmocktwilio9921',
                date_created: new Date().toISOString(),
                status: 'delivered',
                to: parsedBody.To || '+14155552671',
                body: parsedBody.Body || 'Test SMS',
              })
            );
            return;
          }

          // 4. OpenAI Chat Completions endpoint
          if (url.pathname === '/v1/chat/completions') {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(
              JSON.stringify({
                id: 'chatcmpl-mock-9982',
                object: 'chat.completion',
                created: Math.floor(Date.now() / 1000),
                model: parsedBody.model || 'gpt-4o',
                choices: [
                  {
                    index: 0,
                    message: { role: 'assistant', content: 'Immunix verified response.' },
                    finish_reason: 'stop',
                  },
                ],
              })
            );
            return;
          }

          // Default fallback
          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Endpoint not found on mock vendor server' }));
        });
      });

      this.server.listen(this.port, () => {
        resolve(this.port);
      });
    });
  }

  public stop(): Promise<void> {
    return new Promise((resolve) => {
      if (this.server) {
        this.server.close(() => resolve());
      } else {
        resolve();
      }
    });
  }
}

