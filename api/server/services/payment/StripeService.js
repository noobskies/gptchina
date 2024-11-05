// server/services/payment/StripeService.js
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { calculateTokenAmount, validatePaymentAmount } = require('../../utils/payment');
const User = require('~/models/User');
const { logger } = require('~/config');

class StripeService {
  static async createPaymentIntent({ amount, userId, email }) {
    try {
      if (!validatePaymentAmount(amount)) {
        throw new Error('Invalid payment amount');
      }

      const amountInCents = calculateTokenAmount(amount);

      logger.info('Creating payment intent', { amount, amountInCents, userId });

      // Optionally create or get Stripe customer
      let customer;
      if (email) {
        const customers = await stripe.customers.list({ email });
        customer = customers.data[0] || (await stripe.customers.create({ email }));
      }

      const paymentIntent = await stripe.paymentIntents.create({
        amount: amountInCents,
        currency: 'usd',
        customer: customer?.id,
        metadata: {
          userId,
          tokens: amount,
        },
        automatic_payment_methods: {
          enabled: true,
        },
      });

      logger.info('Payment intent created', { id: paymentIntent.id });

      return paymentIntent;
    } catch (error) {
      logger.error('Failed to create payment intent', { error, amount, userId });
      throw error;
    }
  }

  static async confirmPayment({ paymentIntentId, amount, user }) {
    try {
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

      if (paymentIntent.status !== 'succeeded') {
        throw new Error('Payment has not been completed');
      }

      if (paymentIntent.metadata.userId !== user._id.toString()) {
        throw new Error('Payment intent does not match user');
      }

      if (parseInt(paymentIntent.metadata.tokens) !== amount) {
        throw new Error('Payment amount mismatch');
      }

      // Update user's token balance
      const updatedUser = await User.findByIdAndUpdate(
        user._id,
        {
          $inc: { tokenBalance: amount }, // Increment token balance
          $push: {
            transactions: {
              type: 'purchase',
              amount: amount,
              paymentId: paymentIntentId,
              timestamp: new Date(),
            },
          },
        },
        { new: true }, // Return updated document
      );

      logger.info('Payment confirmed and user updated', {
        id: paymentIntentId,
        userId: user._id,
        newBalance: updatedUser.tokenBalance,
      });

      return updatedUser;
    } catch (error) {
      logger.error('Failed to confirm payment', { error, paymentIntentId, userId: user._id });
      throw error;
    }
  }

  static async handleWebhook(payload, signature) {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    try {
      const event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);

      switch (event.type) {
        case 'payment_intent.succeeded':
          await this.handleSuccessfulPayment(event.data.object);
          break;

        case 'payment_intent.payment_failed':
          await this.handleFailedPayment(event.data.object);
          break;
      }

      return event;
    } catch (error) {
      logger.error('Webhook error:', error);
      throw new Error(`Webhook Error: ${error.message}`);
    }
  }

  static async handleSuccessfulPayment(paymentIntent) {
    const { userId, tokens } = paymentIntent.metadata;

    try {
      // Double-check that payment hasn't been processed already
      const user = await User.findById(userId);

      if (!user) {
        throw new Error('User not found');
      }

      // Check if this payment has already been processed
      const existingTransaction = user.transactions?.find((t) => t.paymentId === paymentIntent.id);

      if (existingTransaction) {
        logger.info('Payment already processed', { id: paymentIntent.id });
        return;
      }

      // Update user's token balance
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        {
          $inc: { tokenBalance: parseInt(tokens) },
          $push: {
            transactions: {
              type: 'purchase',
              amount: parseInt(tokens),
              paymentId: paymentIntent.id,
              timestamp: new Date(),
            },
          },
        },
        { new: true },
      );

      logger.info('Successful payment processed via webhook', {
        id: paymentIntent.id,
        userId,
        newBalance: updatedUser.tokenBalance,
      });
    } catch (error) {
      logger.error('Failed to process successful payment', { error, paymentIntent });
      throw error;
    }
  }

  static async handleFailedPayment(paymentIntent) {
    const { userId } = paymentIntent.metadata;

    try {
      const user = await User.findById(userId);

      if (!user) {
        logger.error('User not found for failed payment', { userId });
        return;
      }

      // Log the failed transaction
      await User.findByIdAndUpdate(userId, {
        $push: {
          transactions: {
            type: 'failed',
            amount: parseInt(paymentIntent.metadata.tokens),
            paymentId: paymentIntent.id,
            error: paymentIntent.last_payment_error?.message,
            timestamp: new Date(),
          },
        },
      });

      logger.error('Payment failed', {
        id: paymentIntent.id,
        userId,
        error: paymentIntent.last_payment_error,
      });
    } catch (error) {
      logger.error('Failed to process failed payment', { error, paymentIntent });
      throw error;
    }
  }
}

module.exports = StripeService;
