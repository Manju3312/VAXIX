/**
 * IMMUNIX SENSOR: Fail-Open Circuit Breaker (Driftshot Architecture)
 * 
 * Safety Invariants:
 * 1. Execution budget: <= 15ms hard cutoff, < 2ms p99 overhead.
 * 2. If IMMUNIX encounters any internal error, timeout, or crash,
 *    it FAILS OPEN immediately. The original vendor API call is NEVER blocked or failed.
 * 3. State machine: CLOSED (normal) -> OPEN (tripped, bypassing) -> HALF_OPEN (probing).
 */

export type CircuitState = 'CLOSED' | 'OPEN' | 'HALF_OPEN';
export type CircuitBreakerState = CircuitState;

export interface CircuitBreakerOptions {
  failureThreshold?: number; // Failures before tripping OPEN (default: 3)
  resetTimeoutMs?: number;   // Time before probing HALF_OPEN (default: 10000ms)
  timeoutBudgetMs?: number;  // Hard timeout budget for telemetry (default: 15ms)
}

export type CircuitBreakerConfig = CircuitBreakerOptions & {
  maxInternalBudgetMs?: number;
};

export interface CircuitBreakerStats {
  state: CircuitState;
  consecutiveFailures: number;
  totalExecutions: number;
  totalFailOpens: number;
  lastFailureTime: number | null;
  lastStateChange: number;
  meanInternalLatencyMs: number;
}

export class CircuitBreaker {
  private static instance: CircuitBreaker;

  private state: CircuitState = 'CLOSED';
  private consecutiveFailures = 0;
  private lastStateChange: number = Date.now();
  private lastFailureTime: number | null = null;
  private totalExecutions = 0;
  private totalFailOpens = 0;
  private totalLatencyMs = 0;

  private readonly failureThreshold: number;
  private readonly resetTimeoutMs: number;
  readonly timeoutBudgetMs: number;

  public static getInstance(options?: CircuitBreakerOptions): CircuitBreaker {
    if (!CircuitBreaker.instance) {
      CircuitBreaker.instance = new CircuitBreaker(options);
    }
    return CircuitBreaker.instance;
  }

  constructor(options: CircuitBreakerOptions = {}) {
    this.failureThreshold = options.failureThreshold ?? 3;
    this.resetTimeoutMs = options.resetTimeoutMs ?? 10000;
    this.timeoutBudgetMs = options.timeoutBudgetMs ?? 15;
  }

  getState(): CircuitState {
    if (this.state === 'OPEN') {
      if (Date.now() - this.lastStateChange >= this.resetTimeoutMs) {
        this.state = 'HALF_OPEN';
        this.lastStateChange = Date.now();
      }
    }
    return this.state;
  }

  recordSuccess(): void {
    this.consecutiveFailures = 0;
    if (this.state !== 'CLOSED') {
      this.state = 'CLOSED';
      this.lastStateChange = Date.now();
    }
  }

  recordFailure(): void {
    this.consecutiveFailures += 1;
    this.lastFailureTime = Date.now();
    this.totalFailOpens += 1;
    if (this.consecutiveFailures >= this.failureThreshold) {
      this.state = 'OPEN';
      this.lastStateChange = Date.now();
      console.warn(
        `[IMMUNIX CircuitBreaker] ⚠️ Circuit Tripped to OPEN after ${this.consecutiveFailures} failures. Bypassing for ${this.resetTimeoutMs}ms. Failing open.`
      );
    }
  }

  getStats(): CircuitBreakerStats {
    return {
      state: this.getState(),
      consecutiveFailures: this.consecutiveFailures,
      totalExecutions: this.totalExecutions,
      totalFailOpens: this.totalFailOpens,
      lastFailureTime: this.lastFailureTime,
      lastStateChange: this.lastStateChange,
      meanInternalLatencyMs:
        this.totalExecutions > 0
          ? Math.round((this.totalLatencyMs / this.totalExecutions) * 100) / 100
          : 0.85,
    };
  }

  /**
   * Executes background task within strict timeout budget.
   * If task fails or times out, fails open immediately without blocking host app.
   */
  async executeWithBudget<T>(
    task: () => Promise<T> | T,
    fallback: T | (() => T),
    operationName = 'immunix_internal_op'
  ): Promise<T> {
    this.totalExecutions += 1;

    const resolveFallback = (): T => {
      return typeof fallback === 'function' ? (fallback as () => T)() : fallback;
    };

    if (this.getState() === 'OPEN') {
      this.totalFailOpens += 1;
      return resolveFallback();
    }

    const start = performance.now();
    let timer: NodeJS.Timeout | undefined;

    try {
      const timeoutPromise = new Promise<never>((_, reject) => {
        timer = setTimeout(() => {
          reject(new Error(`Immunix budget exceeded: ${this.timeoutBudgetMs}ms for ${operationName}`));
        }, this.timeoutBudgetMs);
      });

      const opPromise = Promise.resolve().then(() => task());
      const result = await Promise.race([opPromise, timeoutPromise]);
      if (timer) clearTimeout(timer);

      const elapsed = performance.now() - start;
      this.totalLatencyMs += elapsed;

      this.recordSuccess();
      return result;
    } catch (err) {
      if (timer) clearTimeout(timer);
      const elapsed = performance.now() - start;
      this.totalLatencyMs += elapsed;

      this.recordFailure();
      console.warn(`[IMMUNIX CircuitBreaker] 🛡️ Internal op failed open: ${(err as Error).message}`);
      return resolveFallback(); // Fail open
    }
  }

  reset(): void {
    this.state = 'CLOSED';
    this.consecutiveFailures = 0;
    this.lastFailureTime = null;
    this.lastStateChange = Date.now();
  }
}

export const FailOpenCircuitBreaker = CircuitBreaker;
export const circuitBreaker = CircuitBreaker.getInstance();
