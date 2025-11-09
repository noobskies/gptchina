/**
 * CUSTOM: gptchina fork
 *
 * Feature: Claim Tokens
 * Created: 2025-11-09
 * Upstream Impact: None (standalone module)
 *
 * Shared constants for the Claim Tokens feature.
 */

const CLAIM_TOKENS_CONFIG = {
  // Amount of tokens to award per claim
  CLAIM_AMOUNT: 20000,

  // Cooldown period in milliseconds (24 hours)
  COOLDOWN_MS: 24 * 60 * 60 * 1000,

  // Cooldown period in hours (for display)
  COOLDOWN_HOURS: 24,
};

const CLAIM_TOKENS_ERRORS = {
  COOLDOWN_ACTIVE: 'COOLDOWN_ACTIVE',
  USER_NOT_FOUND: 'USER_NOT_FOUND',
  BALANCE_NOT_FOUND: 'BALANCE_NOT_FOUND',
  UNAUTHORIZED: 'UNAUTHORIZED',
  SERVER_ERROR: 'SERVER_ERROR',
};

module.exports = {
  CLAIM_TOKENS_CONFIG,
  CLAIM_TOKENS_ERRORS,
};
