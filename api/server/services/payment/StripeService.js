const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const User = require('~/models/User');
const { logger } = require('~/config');

class StripeService {
  static async createPaymentIntent({ amount, userId, email }) {
    try {
      logger.info('Creating payment intent', {
        amount,
        userId,
      });

      let customer;
      if (email) {
        const customers = await stripe.customers.list({ email });
        customer = customers.data[0] || (await stripe.customers.create({ email }));
      }

      const paymentIntent = await stripe.paymentIntents.create({
        amount, // Already in cents
        currency: 'usd',
        customer: customer?.id,
        metadata: {
          userId,
        },
        automatic_payment_methods: {
          enabled: true,
        },
      });

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

      // Update user's token balance with the number of tokens purchased
      const updatedUser = await User.findByIdAndUpdate(
        user._id,
        {
          $inc: { tokenBalance: amount }, // Add the purchased tokens
          $push: {
            transactions: {
              type: 'purchase',
              tokens: amount, // Number of tokens purchased
              amount: paymentIntent.amount, // Cost in cents
              paymentId: paymentIntentId,
              timestamp: new Date(),
            },
          },
        },
        { new: true },
      );

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
    const { userId } = paymentIntent.metadata;

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
          $inc: { tokenBalance: paymentIntent.amount }, // amount is in cents
          $push: {
            transactions: {
              type: 'purchase',
              amount: paymentIntent.amount,
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
            amount: paymentIntent.amount,
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
