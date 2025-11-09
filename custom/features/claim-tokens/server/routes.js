/**
 * CUSTOM: gptchina fork
 *
 * Feature: Claim Tokens
 * Created: 2025-11-09
 * Upstream Impact: None (standalone module)
 *
 * Express routes for the Claim Tokens feature.
 */

const express = require('express');
const { claimTokens, getClaimStatus } = require('./controller');
const { requireJwtAuth } = require('../../../../api/server/middleware');

const router = express.Router();

/**
 * POST /api/custom/claim-tokens
 * Claim 20,000 tokens (with 24-hour cooldown)
 * Requires authentication
 */
router.post('/claim-tokens', requireJwtAuth, claimTokens);

/**
 * GET /api/custom/claim-tokens/status
 * Get current claim status (can claim, time remaining)
 * Requires authentication
 */
router.get('/claim-tokens/status', requireJwtAuth, getClaimStatus);

module.exports = router;
