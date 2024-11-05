// routes/payment/stripe.js
const express = require('express');
const router = express.Router();
const StripeController = require('../../controllers/payment/StripeController');
const { requireJwtAuth } = require('../../middleware');

router.post('/create-intent', requireJwtAuth, StripeController.createPaymentIntent);
router.post('/confirm', requireJwtAuth, StripeController.confirmPayment);
router.post('/webhook', express.raw({ type: 'application/json' }), StripeController.handleWebhook);

module.exports = router;
