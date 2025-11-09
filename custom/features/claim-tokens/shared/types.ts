/**
 * CUSTOM: gptchina fork
 *
 * Feature: Claim Tokens
 * Created: 2025-11-09
 * Upstream Impact: None (standalone module)
 *
 * Shared TypeScript types for the Claim Tokens feature.
 */

export interface ClaimTokensResponse {
  success: boolean;
  balance?: number;
  tokensAdded?: number;
  nextClaimAvailable?: string;
  error?: string;
  remainingTime?: number;
}

export interface ClaimTokensStatus {
  canClaim: boolean;
  nextClaimAvailable: string | null;
  remainingTime: number;
}
