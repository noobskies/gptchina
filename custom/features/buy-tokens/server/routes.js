/**
 * CUSTOM: gptchina fork
 *
 * Feature: Buy Tokens (Stripe Integration)
 * Created: 2025-11-09
 * Upstream Impact: None (standalone module)
 *
 * Express routes for the Buy Tokens feature.
 */

const express = require('express');
const {
  createPaymentIntentHandler,
  handleWebhook,
  getPaymentMethodsHandler,
} = require('./controller');
const { requireJwtAuth } = require('../../../../api/server/middleware');

const router = express.Router();

/**
 * POST /api/custom/stripe/create-payment-intent
 * Create a Stripe payment intent for token purchase
 * Requires authentication
 */
router.post('/stripe/create-payment-intent', requireJwtAuth, createPaymentIntentHandler);

/**
 * POST /api/custom/stripe/webhook
 * Handle Stripe webhook events (payment confirmations)
 * No authentication required - signature verification used instead
 * IMPORTANT: express.raw() middleware applied at app level (see api/server/index.js)
 */
router.post('/stripe/webhook', handleWebhook);

/**
 * GET /api/custom/stripe/payment-methods
 * Get available payment methods for user's region
 * Requires authentication
 */
router.get('/stripe/payment-methods', requireJwtAuth, getPaymentMethodsHandler);

module.exports = router;
