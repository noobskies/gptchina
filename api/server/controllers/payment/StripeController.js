// server/controllers/payment/StripeController.js
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const StripeService = require('../../services/payment/StripeService');
const User = require('~/models/User');
const { logger } = require('~/config');

class StripeController {
  static async createPaymentIntent(req, res) {
    try {
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

      const event = stripe.webhooks.constructEvent(
        rawBody, // This will now be a raw buffer
        signature,
        process.env.STRIPE_WEBHOOK_SECRET,
      );

      logger.info('Webhook event constructed successfully:', {
        type: event.type,
        id: event.id,
      });

      // Handle the event
      switch (event.type) {
        case 'payment_intent.succeeded':
          const paymentIntent = event.data.object;
          // Handle successful payment
          break;
        // ... handle other event types
      }

      return event;
    } catch (error) {
      logger.error('Webhook processing error:', error);
      throw error;
    }
  }
}

module.exports = StripeController;
