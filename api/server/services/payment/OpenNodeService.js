const opennode = require('opennode');
const { Transaction } = require('~/models/Transaction');
const User = require('~/models/User');
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
  static apiKey = process.env.OPENNODE_API_KEY;

  static async createCharge({ amount, userId, email, priceId, tokens, successUrl, callbackUrl }) {
    try {
      opennode.setCredentials(this.apiKey, process.env.NODE_ENV === 'production' ? 'live' : 'dev');

      const requestData = {
        amount: amount / 100,
        description: `${tokens} tokens purchase`,
        currency: 'USD',
        success_url: successUrl,
        callback_url: callbackUrl,
        auto_settle: true,
        notif_email: email,
        customer_email: email,
        customer_name: userId,
        order_id: Date.now().toString(),
        ttl: 10,
        metadata: {
          userId,
          priceId,
          tokens: PRICE_TOKEN_MAPPING[priceId],
        },
      };

      console.log('OpenNode API request', { data: requestData });
      const charge = await opennode.createCharge(requestData);

      console.log('OpenNode charge created:', {
        chargeId: charge.id,
        amount,
        userId,
        priceId,
      });

      return charge;
    } catch (error) {
      console.log('OpenNode charge creation failed:', {
        error: error.message,
        status: error.status,
      });
      throw new Error(error.message || 'Failed to create charge');
    }
  }

  static async handleWebhook(payload, signature) {
    try {
      const event = JSON.parse(payload);
      const isValid = await opennode.signatureIsValid(event);

      if (!isValid) {
        throw new Error('Invalid webhook signature');
      }

      if (event.status === 'paid') {
        await this.handleSuccessfulPayment(event);
      } else if (event.status === 'expired') {
        await this.handleFailedPayment(event);
      }

      return event;
    } catch (error) {
      console.log('OpenNode webhook processing failed:', error);
      throw error;
    }
  }

  static async handleSuccessfulPayment(event) {
    const { userId, priceId } = event.metadata;

    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      const existingTransaction = await Transaction.findOne({
        user: userId,
        tokenType: 'credits',
        context: 'purchase',
        paymentId: event.id,
      });

      if (existingTransaction) {
        console.log('Payment already processed', { id: event.id });
        return;
      }

      const tokenAmount = PRICE_TOKEN_MAPPING[priceId];
      const transaction = await Transaction.create({
        user: userId,
        tokenType: 'credits',
        context: 'purchase',
        rawAmount: tokenAmount,
        paymentId: event.id,
        priceId,
      });

      logger.info('Bitcoin payment processed successfully', {
        chargeId: event.id,
        userId,
        tokenAmount,
        transactionId: transaction._id,
      });

      return transaction;
    } catch (error) {
      console.log('Failed to process successful payment', {
        error: error.message,
        chargeId: event.id,
        userId,
      });
      throw error;
    }
  }

  static async handleFailedPayment(event) {
    const { userId, priceId } = event.metadata;

    try {
      const transaction = await Transaction.create({
        user: userId,
        tokenType: 'credits',
        context: 'purchase',
        rawAmount: 0,
        paymentId: event.id,
        priceId,
        error: 'Payment expired or failed',
      });

      console.log('Bitcoin payment failed', {
        id: event.id,
        userId,
        transactionId: transaction._id,
      });

      return transaction;
    } catch (error) {
      console.log('Failed to process failed payment', { error, event });
      throw error;
    }
  }

  static async getCharge(chargeId) {
    try {
      return await opennode.getCharge(chargeId);
    } catch (error) {
      console.log('OpenNode charge retrieval failed:', error);
      throw new Error('Failed to retrieve charge');
    }
  }
}

module.exports = OpenNodeService;
