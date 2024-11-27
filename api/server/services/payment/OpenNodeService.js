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

class OpenNodeService {
  constructor() {
    this.baseUrl =
      process.env.NODE_ENV === 'production'
        ? 'https://api.opennode.com/v1'
        : 'https://dev-api.opennode.com/v1';

    this.client = axios.create({
      baseURL: this.baseUrl,
      headers: {
        Authorization: process.env.OPENNODE_API_KEY,
        'Content-Type': 'application/json',
      },
    });
  }

  async createCharge({ amount, userId, priceId, email }) {
    try {
      const payload = {
        amount: amount / 100,
        currency: 'USD',
        order_id: `order_${Date.now()}`,
        description: `Token Purchase - ${PRICE_TOKEN_MAPPING[priceId]} tokens`,
        callback_url: `${process.env.DOMAIN_SERVER}/api/payment/opennode/webhook`,
        success_url: `${process.env.DOMAIN_SERVER}/payment/success`,
        customer_email: email,
        auto_settle: true,
        ttl: 60,
        metadata: {
          userId,
          priceId,
          tokens: PRICE_TOKEN_MAPPING[priceId],
        },
      };

      console.log('Creating OpenNode charge', payload);
      const response = await this.client.post('/charges', payload);

      const charge = response.data.data;
      return {
        id: charge.id,
        chargeId: charge.id,
        amount: charge.amount,
        fiat_value: charge.fiat_value,
        status: charge.status,
        lightning_invoice: charge.lightning_invoice,
        chain_invoice: charge.chain_invoice,
        address: charge.chain_invoice,
        hosted_checkout_url: charge.hosted_checkout_url,
      };
    } catch (error) {
      console.log('Failed to create OpenNode charge', {
        error: error.response?.data || error.message,
      });
      throw error;
    }
  }

  async handlePaymentNotification(charge) {
    try {
      if (charge.status !== 'paid') {
        console.log('Charge not paid yet', { id: charge.id, status: charge.status });
        return;
      }

      const { userId, priceId, tokens } = charge.metadata;
      if (!userId || !priceId || !tokens) {
        throw new Error('Missing metadata in charge');
      }

      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      const existingTransaction = await Transaction.findOne({
        user: userId,
        tokenType: 'credits',
        context: 'purchase',
        paymentId: charge.id,
      });

      if (existingTransaction) {
        console.log('Payment already processed', { id: charge.id });
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

      await User.findByIdAndUpdate(userId, {
        $inc: { tokenBalance: tokens },
      });

      console.log('Bitcoin payment processed', {
        chargeId: charge.id,
        userId,
        tokens,
        transactionId: transaction._id,
      });

      return transaction;
    } catch (error) {
      console.log('Failed to process payment notification', {
        error: error.message,
        chargeId: charge.id,
      });
      throw error;
    }
  }

  async getCharge(chargeId) {
    try {
      const response = await this.client.get(`/charge/${chargeId}`);
      return response.data.data;
    } catch (error) {
      console.log('Failed to fetch charge', { error, chargeId });
      throw error;
    }
  }

  validateWebhook(payload, signature) {
    try {
      if (!payload?.id || !signature) return false;

      const calculated = crypto
        .createHmac('sha256', process.env.OPENNODE_API_KEY)
        .update(payload.id)
        .digest('hex');

      return calculated === signature;
    } catch (error) {
      console.log('Webhook validation failed', { error });
      return false;
    }
  }

  async handleWebhook(payload, signature) {
    try {
      console.log('Processing webhook', {
        id: payload.id,
        status: payload.status,
      });

      if (!this.validateWebhook(payload, signature)) {
        throw new Error('Invalid webhook signature');
      }

      await this.handlePaymentNotification(payload);
      return true;
    } catch (error) {
      console.log('Webhook processing error', error);
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
      console.log('Failed to list transactions', { error, userId });
      throw error;
    }
  }
}

module.exports = new OpenNodeService();
