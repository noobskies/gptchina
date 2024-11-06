const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const User = require('~/models/User');
const { Transaction } = require('~/models/Transaction');
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

// Price amount mapping in cents
const PRICE_AMOUNT_MAPPING = {
  // Global prices (USD)
  price_1P6dqBHKD0byXXClWuA2RGY2: 150, // $1.50
  price_1P6dqdHKD0byXXClcboa06Tu: 500, // $5.00
  price_1P6drEHKD0byXXClOjmSkPKm: 750, // $7.50
  price_1P6drxHKD0byXXClVVLokkLh: 4000, // $40.00

  // China prices (CNY)
  price_1ORgxoHKD0byXXClx3u1yLa0: 1000, // ¥10
  price_1ORgyJHKD0byXXClfvOyCbp7: 3500, // ¥35
  price_1ORgyiHKD0byXXClHetdaI3W: 5000, // ¥50
  price_1ORgzMHKD0byXXClDCm5PkwO: 25000, // ¥250
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

      // Validate amount matches the price
      const expectedAmount = PRICE_AMOUNT_MAPPING[priceId];
      if (amount !== expectedAmount) {
        throw new Error(`Invalid amount for priceId. Expected: ${expectedAmount}, Got: ${amount}`);
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

      // Check for existing transaction
      const existingTransaction = await Transaction.findOne({
        user: user._id,
        tokenType: 'credits',
        context: 'purchase',
        paymentId: paymentIntentId,
      });

      if (existingTransaction) {
        logger.info('Payment already processed', { id: paymentIntentId });
        return;
      }

      // Create transaction record
      const transaction = await Transaction.create({
        user: user._id,
        tokenType: 'credits',
        context: 'purchase',
        rawAmount: tokenAmount,
        paymentId: paymentIntentId,
        priceId: priceId,
      });

      logger.info('Payment confirmed and processed', {
        id: paymentIntentId,
        userId: user._id,
        tokenAmount,
        transactionId: transaction._id,
      });

      return transaction;
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

      // Check for existing transaction
      const existingTransaction = await Transaction.findOne({
        user: userId,
        tokenType: 'credits',
        context: 'purchase',
        paymentId: paymentIntent.id,
      });

      if (existingTransaction) {
        logger.info('Payment already processed', { id: paymentIntent.id });
        return;
      }

      const tokenAmount = PRICE_TOKEN_MAPPING[priceId];
      console.log('Adding tokens to user:', {
        userId,
        tokensToAdd: tokenAmount,
        paymentIntentId: paymentIntent.id,
      });

      // Create transaction record
      const transaction = await Transaction.create({
        user: userId,
        tokenType: 'credits',
        context: 'purchase',
        rawAmount: tokenAmount,
        paymentId: paymentIntent.id,
        priceId: priceId,
      });

      logger.info('Successful payment processed via webhook', {
        id: paymentIntent.id,
        userId,
        tokenAmount,
        transactionId: transaction._id,
      });

      return transaction;
    } catch (error) {
      logger.error('Failed to process successful payment', {
        error: error.message,
        stack: error.stack,
        paymentIntentId: paymentIntent.id,
        userId,
        priceId,
      });
      throw error;
    }
  }

  static async handleFailedPayment(paymentIntent) {
    const { userId } = paymentIntent.metadata;

    try {
      // Create failed transaction record
      const transaction = await Transaction.create({
        user: userId,
        tokenType: 'credits',
        context: 'purchase',
        rawAmount: 0,
        paymentId: paymentIntent.id,
        priceId: paymentIntent.metadata.priceId,
        error: paymentIntent.last_payment_error?.message,
      });

      logger.error('Payment failed', {
        id: paymentIntent.id,
        userId,
        error: paymentIntent.last_payment_error,
        transactionId: transaction._id,
      });

      return transaction;
    } catch (error) {
      logger.error('Failed to process failed payment', { error, paymentIntent });
      throw error;
    }
  }

  static async listTransactions(userId) {
    try {
      const transactions = await Transaction.find({
        user: userId,
        tokenType: 'credits',
        context: 'purchase',
      }).sort({ createdAt: -1 });

      return transactions;
    } catch (error) {
      logger.error('Failed to list transactions', { error, userId });
      throw error;
    }
  }
}

module.exports = StripeService;
