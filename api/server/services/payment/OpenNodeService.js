const axios = require('axios');
const crypto = require('crypto');
const User = require('~/models/User');
const { Transaction } = require('~/models/Transaction');
const { logger } = require('~/config');

const PRICE_TOKEN_MAPPING = {
  price_1P6dqBHKD0byXXClWuA2RGY2: 100000,
  price_1P6dqdHKD0byXXClcboa06Tu: 500000,
  price_1P6drEHKD0byXXClOjmSkPKm: 1000000,
  price_1P6drxHKD0byXXClVVLokkLh: 10000000,
  price_1ORgxoHKD0byXXClx3u1yLa0: 100000,
  price_1ORgyJHKD0byXXClfvOyCbp7: 500000,
  price_1ORgyiHKD0byXXClHetdaI3W: 1000000,
  price_1ORgzMHKD0byXXClDCm5PkwO: 10000000,
};

const PRICE_AMOUNT_MAPPING = {
  price_1P6dqBHKD0byXXClWuA2RGY2: 150,
  price_1P6dqdHKD0byXXClcboa06Tu: 500,
  price_1P6drEHKD0byXXClOjmSkPKm: 750,
  price_1P6drxHKD0byXXClVVLokkLh: 4000,
  price_1ORgxoHKD0byXXClx3u1yLa0: 1000,
  price_1ORgyJHKD0byXXClfvOyCbp7: 3500,
  price_1ORgyiHKD0byXXClHetdaI3W: 5000,
  price_1ORgzMHKD0byXXClDCm5PkwO: 25000,
};

class OpenNodeService {
  constructor() {
    this.baseUrl =
      process.env.NODE_ENV === 'production'
        ? 'https://api.opennode.com/v1'
        : 'https://api.opennode.com/v1';

    this.client = axios.create({
      baseURL: this.baseUrl,
      headers: { Authorization: process.env.OPENNODE_API_KEY },
    });
  }

  isValidPriceId(priceId) {
    return !!PRICE_TOKEN_MAPPING[priceId];
  }

  async createCharge({ amount, userId, priceId, email }) {
    try {
      if (!priceId || !this.isValidPriceId(priceId)) {
        throw new Error(`Invalid priceId: ${priceId}`);
      }

      const expectedAmount = PRICE_AMOUNT_MAPPING[priceId];
      if (amount !== expectedAmount) {
        throw new Error(`Invalid amount for priceId. Expected: ${expectedAmount}, Got: ${amount}`);
      }

      logger.info('Creating OpenNode charge', { amount, userId, priceId, email });

      const response = await this.client.post('/charges', {
        amount: amount / 100, // Convert cents to dollars
        currency: 'USD',
        order_id: `order_${Date.now()}`,
        description: `Token Purchase - ${PRICE_TOKEN_MAPPING[priceId]} tokens`,
        callback_url: `${process.env.DOMAIN_SERVER}/api/payment/opennode/webhook`,
        success_url: `${process.env.DOMAIN_SERVER}/payment/success`,
        metadata: { userId, priceId, tokens: PRICE_TOKEN_MAPPING[priceId] },
      });

      return response.data.data;
    } catch (error) {
      logger.error('Failed to create OpenNode charge', {
        error: error.response?.data || error.message,
        amount,
        userId,
        priceId,
      });
      throw error;
    }
  }

  validateWebhook(payload) {
    if (!payload?.id || !payload?.hashed_order) return false;

    const received = payload.hashed_order;
    const calculated = crypto
      .createHmac('sha256', process.env.OPENNODE_API_KEY)
      .update(payload.id)
      .digest('hex');

    return received === calculated;
  }

  async handleSuccessfulPayment(charge) {
    const { userId, priceId, tokens } = charge.metadata;

    try {
      const user = await User.findById(userId);
      if (!user) throw new Error('User not found');

      const existingTransaction = await Transaction.findOne({
        user: userId,
        tokenType: 'credits',
        context: 'purchase',
        paymentId: charge.id,
      });

      if (existingTransaction) {
        logger.info('Payment already processed', { id: charge.id });
        return;
      }

      const transaction = await Transaction.create({
        user: userId,
        tokenType: 'credits',
        context: 'purchase',
        rawAmount: tokens,
        paymentId: charge.id,
        priceId,
      });

      logger.info('Bitcoin payment processed', {
        chargeId: charge.id,
        userId,
        tokens,
        transactionId: transaction._id,
      });

      return transaction;
    } catch (error) {
      logger.error('Failed to process Bitcoin payment', {
        error: error.message,
        stack: error.stack,
        chargeId: charge.id,
        userId,
        priceId,
      });
      throw error;
    }
  }

  async getCharge(chargeId) {
    try {
      const response = await this.client.get(`/charge/${chargeId}`);
      return response.data.data;
    } catch (error) {
      logger.error('Failed to fetch OpenNode charge', { error, chargeId });
      throw error;
    }
  }

  async handleWebhook(payload) {
    try {
      logger.info('Processing OpenNode webhook:', {
        id: payload.id,
        status: payload.status,
      });

      if (!this.validateWebhook(payload)) {
        throw new Error('Invalid webhook signature');
      }

      if (payload.status === 'paid') {
        await this.handleSuccessfulPayment(payload);
      }

      return true;
    } catch (error) {
      logger.error('OpenNode webhook processing error:', error);
      throw error;
    }
  }

  async listTransactions(userId) {
    try {
      return await Transaction.find({
        user: userId,
        tokenType: 'credits',
        context: 'purchase',
      }).sort({ createdAt: -1 });
    } catch (error) {
      logger.error('Failed to list transactions', { error, userId });
      throw error;
    }
  }
}

module.exports = new OpenNodeService();
