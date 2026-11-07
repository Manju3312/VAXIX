/**
 * DEMO APP TEST SUITE: Billing Service Unit Test
 */

import { BillingService } from './billing';

export async function runBillingTests(mockServerUrl = 'http://localhost:4000'): Promise<{
  success: boolean;
  testsRun: number;
  output: string;
}> {
  const service = new BillingService(mockServerUrl);
  const logs: string[] = [];

  try {
    logs.push('Executing Test 1: Charge customer with standard token tok_visa ($20.00)...');
    const result = await service.chargeCustomer('tok_visa', 2000);

    if (result.status !== 'succeeded') {
      throw new Error(`Expected status 'succeeded', got '${result.status}'`);
    }
    logs.push('✓ Test 1 Passed: Payment succeeded with HTTP 200');

    logs.push('Executing Test 2: Verify paid assertion and currency...');
    if (!result.paid || result.currency !== 'usd') {
      throw new Error(`Invalid payment outcome: paid=${result.paid}, currency=${result.currency}`);
    }
    logs.push('✓ Test 2 Passed: Paid flag is true, currency is USD');

    logs.push('Executing Test 3: Verify amount charged...');
    if (result.amount !== 2000) {
      throw new Error(`Expected amount 2000, got ${result.amount}`);
    }
    logs.push('✓ Test 3 Passed: Amount 2000 cents correctly booked');

    return {
      success: true,
      testsRun: 3,
      output: logs.join('\n'),
    };
  } catch (err) {
    logs.push(`✗ Test Failed: ${(err as Error).message}`);
    return {
      success: false,
      testsRun: 3,
      output: logs.join('\n'),
    };
  }
}

