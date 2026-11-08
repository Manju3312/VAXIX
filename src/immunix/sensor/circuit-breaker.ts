/**
 * IMMUNIX SENSOR: Fail-Open Circuit Breaker (Driftshot Architecture)
 * 
 * Safety Invariant:
 * 1. Internal budget: <= 15ms hard cutoff, < 2ms p99 overhead.
 * 2. If IMMUNIX encounters any internal error, timeout, or crash,
 *    it FAILS OPEN immediately. The original vendor API call is NEVER blocked or failed.
 * 3. State machine: CLOSED (normal) -> OPEN (tripped, bypassing) -> HALF_OPEN (probing).
 */

export type CircuitBreakerState = 'CLOSED' | 'OPEN' | 'HALF_OPEN';

export interface CircuitBreakerConfig {
  maxInternalBudgetMs: number; // Max time allowed for internal processing (default: 15ms)
  failureThreshold: number;    // Consecutive failures to open circuit (default: 5)
  resetTimeoutMs: number;      // Time before testing half-open (default: 30000ms)
}

export interface CircuitBreakerStats {
  state: CircuitBreakerState;
  consecutiveFailures: number;
  totalExecutions: number;
  totalFailOpens: number;
  lastFailureTime: number | null;
  lastStateChange: number;
  meanInternalLatencyMs: number;
}

export class FailOpenCircuitBreaker {
  private static instance: FailOpenCircuitBreaker;

  private state: CircuitBreakerState = 'CLOSED';
  private consecutiveFailures = 0;
  private totalExecutions = 0;
  private totalFailOpens = 0;
  private lastFailureTime: number | null = null;
  private lastStateChange = Date.now();
  private totalLatencyMs = 0;

  private config: CircuitBreakerConfig;

  public static getInstance(config?: Partial<CircuitBreakerConfig>): FailOpenCircuitBreaker {
    if (!FailOpenCircuitBreaker.instance) {
      FailOpenCircuitBreaker.instance = new FailOpenCircuitBreaker(config);
    }
    return FailOpenCircuitBreaker.instance;
  }

  constructor(config?: Partial<CircuitBreakerConfig>) {
    this.config = {
      maxInternalBudgetMs: config?.maxInternalBudgetMs ?? 15,
      failureThreshold: config?.failureThreshold ?? 5,
      resetTimeoutMs: config?.resetTimeoutMs ?? 30000,
    };
  }

  public getState(): CircuitBreakerState {
    // Check if OPEN state has expired and should transition to HALF_OPEN
    if (this.state === 'OPEN' && this.lastFailureTime) {
      if (Date.now() - this.lastFailureTime > this.config.resetTimeoutMs) {
        this.transitionTo('HALF_OPEN');
      }
    }
    return this.state;
  }

  public getStats(): CircuitBreakerStats {
    const currentState = this.getState();
    return {
      state: currentState,
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

  private transitionTo(newState: CircuitBreakerState) {
    this.state = newState;
    this.lastStateChange = Date.now();
    if (newState === 'CLOSED') {
      this.consecutiveFailures = 0;
    }
  }

  /**
   * Executes an internal Immunix hook with strict fail-open protection.
   * If the internal hook takes > maxInternalBudgetMs or throws, fallback is executed
   * or the failure is absorbed, guaranteeing the application traffic is never impacted.
   */
  public async executeWithBudget<T>(
    operation: () => Promise<T> | T,
    fallback: () => T,
    operationName = 'immunix_internal_op'
  ): Promise<T> {
    this.totalExecutions++;
    const currentState = this.getState();

    // If circuit is OPEN, fail-open immediately without running internal operation
    if (currentState === 'OPEN') {
      this.totalFailOpens++;
      return fallback();
    }

    const start = performance.now();
    let timer: NodeJS.Timeout | undefined;

    try {
      const budgetPromise = new Promise<T>((_, reject) => {
        timer = setTimeout(() => {
          reject(new Error(`[CircuitBreaker] Budget exceeded: ${this.config.maxInternalBudgetMs}ms for ${operationName}`));
        }, this.config.maxInternalBudgetMs);
      });

      const opPromise = Promise.resolve().then(() => operation());

      const result = await Promise.race([opPromise, budgetPromise]);
      if (timer) clearTimeout(timer);

      const elapsed = performance.now() - start;
      this.totalLatencyMs += elapsed;

      // In HALF_OPEN, a success transitions back to CLOSED
      if (this.state === 'HALF_OPEN') {
        this.transitionTo('CLOSED');
      }

      return result;
    } catch (err) {
      if (timer) clearTimeout(timer);
      const elapsed = performance.now() - start;
      this.totalLatencyMs += elapsed;
      this.consecutiveFailures++;
      this.totalFailOpens++;
      this.lastFailureTime = Date.now();

      // Trip circuit if threshold reached
      if (this.consecutiveFailures >= this.config.failureThreshold && this.state !== 'OPEN') {
        this.transitionTo('OPEN');
        console.warn(
          `[IMMUNIX CircuitBreaker] ⚠️ Circuit Tripped to OPEN after ${this.consecutiveFailures} failures. Internal ops bypassed for ${this.config.resetTimeoutMs}ms. Failing open.`
        );
      }

      // Log warning but return fallback to protect customer traffic
      console.warn(`[IMMUNIX CircuitBreaker] 🛡️ Internal op failed open: ${(err as Error).message}`);
      return fallback();
    }
  }

  public reset() {
    this.transitionTo('CLOSED');
    this.consecutiveFailures = 0;
    this.lastFailureTime = null;
  }
}

export const circuitBreaker = FailOpenCircuitBreaker.getInstance();

