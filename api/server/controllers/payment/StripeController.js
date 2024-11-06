const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const StripeService = require('../../services/payment/StripeService');
const User = require('~/models/User');
const { logger } = require('~/config');

class StripeController {
  static async createPaymentIntent(req, res) {
    try {
      console.log('Received payment intent request with body:', req.body);
      const { amount, priceId } = req.body;

      const user = await User.findById(req.user?._id);

      if (!user) {
        return res.status(401).json({ error: 'User not found' });
      }

      if (!amount) {
        return res.status(400).json({ error: 'Amount is required' });
      }

      if (!priceId) {
        return res.status(400).json({ error: 'Price ID is required' });
      }

      logger.info('Creating payment intent', {
        amount,
        userId: user._id,
        priceId,
        email: user.email,
      });

      const paymentIntent = await StripeService.createPaymentIntent({
        amount,
        userId: user._id.toString(),
        email: user.email,
        priceId,
      });

      res.json({
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
      });
    } catch (error) {
      logger.error('Payment intent creation error:', error);
      res.status(500).json({
        error: 'Failed to create payment intent',
        details: error.message,
      });
    }
  }

  static async handleWebhook(payload, signature) {
    if (!signature) {
      throw new Error('No stripe signature found in headers');
    }

    logger.info('Processing webhook', {
      signatureExists: !!signature,
      bodyLength: payload?.length,
    });

    try {
      const event = await StripeService.handleWebhook(payload, signature);

      logger.info('Webhook processed', {
        type: event.type,
        id: event.id,
      });

      return event;
    } catch (error) {
      logger.error('Webhook processing error:', error);
      throw error;
    }
  }

  static async confirmPayment(req, res) {
    try {
      const { paymentIntentId } = req.body;

      if (!paymentIntentId) {
        return res.status(400).json({
          error: 'Payment Intent ID is required',
        });
      }

      const user = await User.findById(req.user?._id);

      if (!user) {
        return res.status(401).json({ error: 'User not found' });
      }

      const updatedUser = await StripeService.confirmPayment({
        paymentIntentId,
        user,
      });

      res.json({
        success: true,
        balance: updatedUser.tokenBalance,
      });
    } catch (error) {
      logger.error('Payment confirmation error:', {
        error: error.message,
        userId: req.user?._id,
      });

      res.status(500).json({
        error: 'Failed to confirm payment',
        details: error.message,
      });
    }
  }

  // Helper method to validate webhook event
  static validateWebhookEvent(event) {
    if (!event?.type) {
      throw new Error('Invalid webhook event: missing type');
    }

    if (!event?.data?.object) {
      throw new Error('Invalid webhook event: missing data object');
    }

    return true;
  }
}

module.exports = StripeController;
