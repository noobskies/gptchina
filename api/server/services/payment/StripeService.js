const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const User = require('~/models/User');
const { logger } = require('~/config');

// Price to token mapping based on your constants
const PRICE_TOKEN_MAPPING = {
  // Global prices (USD)
  price_1P6dqBHKD0byXXClWuA2RGY2: 100000, // $1.50 = 100k tokens
  price_1P6dqdHKD0byXXClcboa06Tu: 500000, // $5.00 = 500k tokens
  price_1P6drEHKD0byXXClOjmSkPKm: 1000000, // $7.50 = 1M tokens
  price_1P6drxHKD0byXXClVVLokkLh: 10000000, // $40.00 = 10M tokens

  // China prices (CNY)
  price_1ORgxoHKD0byXXClx3u1yLa0: 100000, // ¥10 = 100k tokens
  price_1ORgyJHKD0byXXClfvOyCbp7: 500000, // ¥35 = 500k tokens
  price_1ORgyiHKD0byXXClHetdaI3W: 1000000, // ¥50 = 1M tokens
  price_1ORgzMHKD0byXXClDCm5PkwO: 10000000, // ¥250 = 10M tokens
};

const PRICE_AMOUNT_MAPPING = {
  // Global prices (USD)
  price_1P6dqBHKD0byXXClWuA2RGY2: 150, // $1.50 in cents
  price_1P6dqdHKD0byXXClcboa06Tu: 500, // $5.00 in cents
  price_1P6drEHKD0byXXClOjmSkPKm: 750, // $7.50 in cents
  price_1P6drxHKD0byXXClVVLokkLh: 4000, // $40.00 in cents

  // China prices (CNY)
  price_1ORgxoHKD0byXXClx3u1yLa0: 1000, // ¥10 in cents
  price_1ORgyJHKD0byXXClfvOyCbp7: 3500, // ¥35 in cents
  price_1ORgyiHKD0byXXClHetdaI3W: 5000, // ¥50 in cents
  price_1ORgzMHKD0byXXClDCm5PkwO: 25000, // ¥250 in cents
};

// Helper to validate price IDs
const isValidPriceId = (priceId) => {
  return !!PRICE_TOKEN_MAPPING[priceId];
};

// Helper to determine currency from priceId
const getCurrencyFromPriceId = (priceId) => {
  return priceId.startsWith('price_1ORg') ? 'cny' : 'usd';
};

class StripeService {
  static async createPaymentIntent({ amount, userId, email, priceId }) {
    try {
      if (!priceId) {
        throw new Error('priceId is required');
      }

      if (!isValidPriceId(priceId)) {
        throw new Error(`Invalid priceId: ${priceId}`);
      }

      logger.info('Creating payment intent', {
        amount,
        userId,
        priceId,
        email,
      });

      let customer;
      if (email) {
        const customers = await stripe.customers.list({ email });
        customer = customers.data[0] || (await stripe.customers.create({ email }));
      }

      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency: getCurrencyFromPriceId(priceId),
        customer: customer?.id,
        metadata: {
          userId,
          priceId,
        },
        automatic_payment_methods: {
          enabled: true,
        },
      });

      return paymentIntent;
    } catch (error) {
      logger.error('Failed to create payment intent', { error, amount, userId, priceId });
      throw error;
    }
  }

  static async confirmPayment({ paymentIntentId, user }) {
    try {
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

      if (paymentIntent.status !== 'succeeded') {
        throw new Error('Payment has not been completed');
      }

      if (paymentIntent.metadata.userId !== user._id.toString()) {
        throw new Error('Payment intent does not match user');
      }

      const { priceId } = paymentIntent.metadata;
      if (!priceId || !PRICE_TOKEN_MAPPING[priceId]) {
        throw new Error('Invalid or missing priceId in payment metadata');
      }

      const tokenAmount = PRICE_TOKEN_MAPPING[priceId];

      // Update user's token balance with the correct number of tokens
      const updatedUser = await User.findByIdAndUpdate(
        user._id,
        {
          $inc: { tokenBalance: tokenAmount },
          $push: {
            transactions: {
              type: 'purchase',
              tokens: tokenAmount,
              amount: paymentIntent.amount,
              paymentId: paymentIntentId,
              priceId,
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
      console.log('Processing webhook payload:', JSON.stringify(payload, null, 2));

      const event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);

      console.log('Webhook event constructed:', {
        type: event.type,
        paymentIntent: event.data.object,
      });

      switch (event.type) {
        case 'payment_intent.created':
          // Log the creation event
          logger.info('Payment intent created:', {
            id: event.data.object.id,
            amount: event.data.object.amount,
            metadata: event.data.object.metadata,
            status: event.data.object.status,
          });
          break;

        case 'payment_intent.succeeded':
          await this.handleSuccessfulPayment(event.data.object);
          break;

        case 'payment_intent.payment_failed':
          await this.handleFailedPayment(event.data.object);
          break;

        case 'payment_intent.canceled':
          logger.info('Payment intent canceled:', {
            id: event.data.object.id,
            metadata: event.data.object.metadata,
          });
          break;

        default:
          logger.info(`Unhandled event type: ${event.type}`, {
            id: event.id,
            type: event.type,
          });
      }

      return event;
    } catch (error) {
      console.error('Webhook processing error:', error);
      throw error;
    }
  }

  static async handleSuccessfulPayment(paymentIntent) {
    console.log('Starting handleSuccessfulPayment:', {
      id: paymentIntent.id,
      metadata: paymentIntent.metadata,
      amount: paymentIntent.amount,
    });

    const { userId, priceId } = paymentIntent.metadata || {};

    if (!priceId || !PRICE_TOKEN_MAPPING[priceId]) {
      console.error('Missing or invalid priceId in payment metadata:', paymentIntent);
      throw new Error('Valid priceId is required');
    }

    try {
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

      const tokenAmount = PRICE_TOKEN_MAPPING[priceId];

      // Update user's token balance
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        {
          $inc: { tokenBalance: tokenAmount },
          $push: {
            transactions: {
              type: 'purchase',
              tokens: tokenAmount,
              amount: paymentIntent.amount,
              paymentId: paymentIntent.id,
              priceId,
              status: paymentIntent.status,
              timestamp: new Date(),
            },
          },
        },
        { new: true },
      );

      logger.info('Successful payment processed via webhook', {
        id: paymentIntent.id,
        userId,
        tokenAmount,
        newBalance: updatedUser.tokenBalance,
      });

      return updatedUser;
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
            priceId: paymentIntent.metadata.priceId,
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

  static async listTransactions(userId) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      return user.transactions || [];
    } catch (error) {
      logger.error('Failed to list transactions', { error, userId });
      throw error;
    }
  }
}

module.exports = StripeService;
