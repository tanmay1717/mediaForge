/**
 * DynamoDB-based token bucket rate limiter.
 *
 * TODO:
 * - Use a DynamoDB table (or the ApiKeys table) to track request counts
 * - Key: userId or apiKeyHash
 * - Implement a sliding window counter:
 *   1. Read the current count and window start time
 *   2. If the window has expired (> 1 minute), reset count to 0
 *   3. If count < RATE_LIMIT_REQUESTS_PER_MINUTE, increment and allow
 *   4. If count >= limit, throw 429 Too Many Requests
 * - Use DynamoDB conditional writes to handle concurrency
 * - Return remaining requests and reset time in response headers:
 *   X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset
 */
export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number; // Unix timestamp
}

export async function checkRateLimit(
  _userId: string,
  _limit: number,
): Promise<RateLimitResult> {
  // TODO: Implement DynamoDB-based rate limiting
  // For now, always allow
  return {
    allowed: true,
    remaining: 999,
    resetAt: Math.floor(Date.now() / 1000) + 60,
  };
}
