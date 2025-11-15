/**
 * CUSTOM: gptchina fork
 *
 * Feature: Token Info / Pricing Guide
 * Created: 2025-11-14
 * Upstream Impact: None (standalone module)
 *
 * Routes for token pricing information.
 */

const express = require('express');
const { getPricingData, calculateCost } = require('./controller');

const router = express.Router();

// GET /api/custom/token-info/pricing - Get categorized pricing data
router.get('/pricing', getPricingData);

// GET /api/custom/token-info/calculate - Calculate cost for specific usage
router.get('/calculate', calculateCost);

module.exports = router;
