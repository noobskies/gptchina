// server/controllers/payment/StripeController.js
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const StripeService = require('../../services/payment/StripeService');
const User = require('~/models/User');
const { logger } = require('~/config');

class StripeController {
  static async createPaymentIntent(req, res) {
    try {
      console.log('Received payment intent request with body:', req.body);
      const { amount } = req.body;

      // Get user from the request
      const user = await User.findById(req.user?._id);

      if (!user) {
        return res.status(401).json({ error: 'User not found' });
      }

      if (!amount) {
        return res.status(400).json({ error: 'Amount is required' });
      }

      logger.info('Creating payment intent', { amount, userId: user._id });
      console.log('Creating payment intent with amount:', amount);

      const paymentIntent = await StripeService.createPaymentIntent({
        amount,
        userId: user._id.toString(),
        email: user.email, // Optional: pass email for Stripe customer creation
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

  static async confirmPayment(req, res) {
    try {
      const { paymentIntentId, amount } = req.body;

      const user = await User.findById(req.user?._id);

      if (!user) {
        return res.status(401).json({ error: 'User not found' });
      }

      const updatedUser = await StripeService.confirmPayment({
        paymentIntentId,
        amount,
        user,
      });

      res.json({
        success: true,
        balance: updatedUser.tokenBalance, // Or whatever field you use for tokens
      });
    } catch (error) {
      logger.error('Payment confirmation error:', error);
      res.status(500).json({
        error: 'Failed to confirm payment',
        details: error.message,
      });
    }
  }

  static async handleWebhook(rawBody, signature) {
    try {
      if (!signature) {
        throw new Error('No stripe signature found in headers');
      }

      logger.info('Controller processing webhook', {
        signatureExists: !!signature,
        bodyLength: rawBody?.length,
        bodyContent: JSON.parse(rawBody),
      });

      // Pass through to service
      const event = await StripeService.handleWebhook(rawBody, signature);

      logger.info('Controller processed webhook', {
        eventType: event.type,
        paymentIntent: event.data?.object,
        metadata: event.data?.object?.metadata,
      });

      return event;
    } catch (error) {
      logger.error('Controller webhook error:', {
        message: error.message,
        name: error.name,
        type: error.type,
        stack: error.stack,
        fullError: JSON.stringify(error),
      });
      throw error;
    }
  }
}

module.exports = StripeController;
