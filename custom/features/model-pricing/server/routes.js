/**
 * CUSTOM: gptchina fork
 *
 * Feature: Model Pricing Display
 * Created: 2025-11-09
 * Upstream Impact: None (standalone module)
 *
 * Express routes for model pricing API endpoints.
 *
 * See: custom/features/model-pricing/README.md
 */

const express = require('express');
const { getModelPricing, getAllPricing } = require('./controller');

const router = express.Router();

/**
 * GET /api/custom/pricing/model/:modelName
 * Get pricing information for a specific model
 */
router.get('/model/:modelName', getModelPricing);

/**
 * GET /api/custom/pricing
 * Get all pricing information (optional - for future use)
 */
router.get('/', getAllPricing);

module.exports = router;
