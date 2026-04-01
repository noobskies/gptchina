/**
 * CUSTOM: gptchina fork
 *
 * Feature: Buy Tokens (Stripe Integration)
 * Created: 2025-11-09
 * Upstream Impact: None (standalone module)
 *
 * Currency formatting utilities.
 */

/**
 * Format price in cents to CNY display format
 * @param priceInCents - Price in cents (e.g., 1000 = ¥10.00)
 * @returns Formatted price string (e.g., "¥10.00")
 */
export const formatPrice = (priceInCents: number): string => {
  return `¥${(priceInCents / 100).toFixed(2)}`;
};

/**
 * Format token count to readable display format
 * @param tokens - Number of tokens
 * @returns Formatted token string (e.g., "1M", "500K", "100")
 */
export const formatTokens = (tokens: number): string => {
  if (tokens >= 1000000) {
    return `${(tokens / 1000000).toFixed(0)}M`;
  }
  if (tokens >= 1000) {
    return `${(tokens / 1000).toFixed(0)}K`;
  }
  return tokens.toString();
};
