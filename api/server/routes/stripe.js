const express = require('express');
const router = express.Router();
const { requireJwtAuth } = require('../middleware/');
const stripeController = require('../controllers/StripeController');
const { logger } = require('~/config');

// Create a payment intent
router.post('/create-payment-intent', requireJwtAuth, stripeController.createPaymentIntent);

// Special middleware to handle Stripe webhook raw body
const stripeWebhookMiddleware = (req, res, next) => {
  let data = '';
  req.on('data', (chunk) => {
    data += chunk;
  });

  req.on('end', () => {
    req.rawBody = Buffer.from(data);
    logger.debug('[StripeRoutes] Raw body set from request data stream');
    next();
  });
};

// Handle Stripe webhook events
// Note: Stripe webhooks don't include auth tokens, so no JWT auth here
router.post(
  '/webhook',
  express.raw({ type: 'application/json' }),
  (req, res, next) => {
    logger.debug('[StripeRoutes] Received webhook request');

    // Make raw body available for webhook verification
    if (req.body instanceof Buffer) {
      req.rawBody = req.body;
      logger.debug('[StripeRoutes] Raw body set from buffer');
    } else {
      logger.error('[StripeRoutes] Request body is not a Buffer', {
        bodyType: typeof req.body,
        isBuffer: Buffer.isBuffer(req.body),
        contentType: req.headers['content-type'],
      });
      // Try to convert the body to a buffer if it's not already
      if (req.body) {
        try {
          req.rawBody = Buffer.from(JSON.stringify(req.body));
          logger.debug('[StripeRoutes] Converted body to buffer');
        } catch (error) {
          logger.error('[StripeRoutes] Failed to convert body to buffer', error);
        }
      }
    }
    next();
  },
  stripeController.handleWebhook,
);

module.exports = router;
