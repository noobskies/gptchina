const opennode = require('opennode');
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
    if (!process.env.OPENNODE_API_KEY) {
      throw new Error('OPENNODE_API_KEY is required');
    }

    logger.info('Initializing OpenNode with environment:', process.env.NODE_ENV);

    try {
      opennode.setCredentials(
        process.env.OPENNODE_API_KEY,
        process.env.NODE_ENV === 'production' ? 'live' : 'dev',
      );
      logger.info('OpenNode credentials set successfully', {
        environment: process.env.NODE_ENV,
        apiKeyPrefix: process.env.OPENNODE_API_KEY.substring(0, 4) + '...',
      });
    } catch (error) {
      logger.error('Failed to set OpenNode credentials:', error);
      throw error;
    }
  }

  async createCharge({ amount, userId, priceId, email }) {
    try {
      logger.info('Starting OpenNode charge creation with params:', {
        amount,
        userId,
        priceId,
        email,
        apiKeyExists: !!process.env.OPENNODE_API_KEY,
      });

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

      logger.info('Attempting OpenNode API call with payload:', payload);

      const charge = await opennode.createCharge(payload);
      logger.info('OpenNode charge created successfully:', {
        id: charge.id,
        status: charge.status,
        amount: charge.amount,
        hasLightningInvoice: !!charge.lightning_invoice,
        hasChainInvoice: !!charge.chain_invoice,
        completeCharge: charge,
      });

      return {
        id: charge.id,
        chargeId: charge.id,
        amount: charge.amount,
        fiat_value: charge.fiat_value,
        status: charge.status,
        lightning_invoice: charge.lightning_invoice,
        chain_invoice: charge.chain_invoice,
        address: charge.chain_invoice,
      };
    } catch (error) {
      logger.error('OpenNode charge creation failed:', {
        error: error.message,
        status: error.status,
        response: error.response?.data,
        stack: error.stack,
      });
      throw error;
    }
  }

  async handlePaymentNotification(charge) {
    try {
      logger.info('Processing payment notification:', {
        chargeId: charge.id,
        status: charge.status,
        metadata: charge.metadata,
        transactions: charge.transactions,
      });

      switch (charge.status) {
        case 'processing':
          logger.info('Payment is processing (in mempool)', {
            id: charge.id,
            transactions: charge.transactions,
          });
          return;

        case 'underpaid':
          logger.warn('Payment was underpaid', {
            id: charge.id,
            missing: charge.missing_amt,
            transactions: charge.transactions,
          });
          return;

        case 'expired':
          logger.info('Charge expired', { id: charge.id });
          return;

        case 'refunded':
          logger.info('Payment was refunded', {
            id: charge.id,
            transactions: charge.transactions,
          });
          return;

        case 'paid':
          const { userId, priceId, tokens } = charge.metadata;
          if (!userId || !priceId || !tokens) {
            throw new Error('Missing metadata in charge');
          }

          // Find user first
          const user = await User.findById(userId);
          if (!user) {
            logger.error('User not found for payment:', {
              userId,
              chargeId: charge.id,
            });
            throw new Error('User not found');
          }

          // Check for existing transaction
          const existingTransaction = await Transaction.findOne({
            user: userId,
            tokenType: 'credits',
            context: 'purchase',
            paymentId: charge.id,
          });

          if (existingTransaction) {
            logger.info('Payment already processed', { id: charge.id });
            return user;
          }

          // Create transaction first
          const transaction = await Transaction.create({
            user: userId,
            tokenType: 'credits',
            context: 'purchase',
            rawAmount: tokens,
            paymentId: charge.id,
            priceId,
          });

          // Update user balance and return updated user
          const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $inc: { tokenBalance: tokens } },
            { new: true },
          );

          logger.info('Bitcoin payment processed successfully', {
            chargeId: charge.id,
            userId,
            tokens,
            transactionId: transaction._id,
            newBalance: updatedUser.tokenBalance,
          });

          return updatedUser;

        default:
          logger.warn('Unhandled payment status', {
            id: charge.id,
            status: charge.status,
          });
          return null;
      }
    } catch (error) {
      logger.error('Payment notification processing failed:', {
        error: error.message,
        chargeId: charge?.id,
        stack: error.stack,
        metadata: charge?.metadata,
      });
      throw error;
    }
  }

  async getCharge(chargeId) {
    try {
      logger.info('Fetching charge info:', { chargeId });
      const charge = await opennode.chargeInfo(chargeId);
      logger.info('Charge info retrieved:', {
        id: charge.id,
        status: charge.status,
        amount: charge.amount,
        transactions: charge.transactions,
      });
      return charge;
    } catch (error) {
      logger.error('Failed to fetch charge:', {
        error: error.message,
        chargeId,
        stack: error.stack,
      });
      throw error;
    }
  }

  validateWebhook(payload) {
    try {
      if (!payload?.id || !payload?.hashed_order) {
        logger.warn('Missing required webhook fields', {
          hasId: !!payload?.id,
          hasHashedOrder: !!payload?.hashed_order,
        });
        return false;
      }

      const received = payload.hashed_order;
      const calculated = crypto
        .createHmac('sha256', process.env.OPENNODE_API_KEY)
        .update(payload.id)
        .digest('hex');

      const isValid = received === calculated;
      logger.info('Webhook validation result:', {
        isValid,
        chargeId: payload.id,
      });

      return isValid;
    } catch (error) {
      logger.error('Webhook validation failed', { error });
      return false;
    }
  }

  async handleWebhook(payload) {
    try {
      logger.info('Processing webhook:', {
        id: payload.id,
        status: payload.status,
        hashedOrder: payload.hashed_order,
      });

      if (!this.validateWebhook(payload)) {
        throw new Error('Invalid webhook signature');
      }

      const updatedUser = await this.handlePaymentNotification(payload);
      logger.info('Webhook processing completed', {
        userId: updatedUser?.id,
        newBalance: updatedUser?.tokenBalance,
      });
      return true;
    } catch (error) {
      logger.error('Webhook processing failed:', {
        error: error.message,
        stack: error.stack,
        payload: payload,
      });
      throw error;
    }
  }

  async listTransactions(userId) {
    try {
      logger.info('Listing transactions for user:', { userId });
      const transactions = await Transaction.find({
        user: userId,
        tokenType: 'credits',
        context: 'purchase',
      }).sort({ createdAt: -1 });

      logger.info('Transactions retrieved:', {
        userId,
        count: transactions.length,
      });

      return transactions;
    } catch (error) {
      logger.error('Failed to list transactions:', {
        error: error.message,
        userId,
        stack: error.stack,
      });
      throw error;
    }
  }
}

module.exports = new OpenNodeService();
