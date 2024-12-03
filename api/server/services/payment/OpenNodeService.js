const opennode = require('opennode');
const crypto = require('crypto');
const User = require('~/models/User');
const { Transaction } = require('~/models/Transaction');

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

    console.log('Initializing OpenNode with environment:', process.env.NODE_ENV);

    try {
      opennode.setCredentials(
        process.env.OPENNODE_API_KEY,
        process.env.NODE_ENV === 'production' ? 'live' : 'dev',
      );
      console.log('OpenNode credentials set successfully', {
        environment: process.env.NODE_ENV,
        apiKeyPrefix: process.env.OPENNODE_API_KEY.substring(0, 4) + '...',
      });
    } catch (error) {
      console.log('Failed to set OpenNode credentials:', error);
      throw error;
    }
  }

  async createCharge({ amount, userId, priceId, email }) {
    try {
      console.log('Starting OpenNode charge creation with params:', {
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

      console.log('Attempting OpenNode API call with payload:', payload);

      const charge = await opennode.createCharge(payload);
      console.log('OpenNode charge created successfully:', {
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
      console.log('OpenNode charge creation failed:', {
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
      console.log('Processing payment notification:', {
        chargeId: charge.id,
        status: charge.status,
        metadata: charge.metadata,
        transactions: charge.transactions,
      });

      switch (charge.status) {
        case 'processing':
          console.log('Payment is processing (in mempool)', {
            id: charge.id,
            transactions: charge.transactions,
          });
          return;

        case 'underpaid':
          console.log('Payment was underpaid', {
            id: charge.id,
            missing: charge.missing_amt,
            transactions: charge.transactions,
          });
          return;

        case 'expired':
          console.log('Charge expired', { id: charge.id });
          return;

        case 'refunded':
          console.log('Payment was refunded', {
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
            console.log('User not found for payment:', {
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
            console.log('Payment already processed', { id: charge.id });
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

          console.log('Bitcoin payment processed successfully', {
            chargeId: charge.id,
            userId,
            tokens,
            transactionId: transaction._id,
            newBalance: updatedUser.tokenBalance,
          });

          return updatedUser;

        default:
          console.log('Unhandled payment status', {
            id: charge.id,
            status: charge.status,
          });
          return null;
      }
    } catch (error) {
      console.log('Payment notification processing failed:', {
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
      console.log('Fetching charge info:', { chargeId });
      const charge = await opennode.chargeInfo(chargeId);
      console.log('Charge info retrieved:', {
        id: charge.id,
        status: charge.status,
        amount: charge.amount,
        transactions: charge.transactions,
      });
      return charge;
    } catch (error) {
      console.log('Failed to fetch charge:', {
        error: error.message,
        chargeId,
        stack: error.stack,
      });
      throw error;
    }
  }

  validateWebhook(payload, signature) {
    try {
      if (!payload?.id || !signature) {
        logger.warn('Missing required webhook fields', {
          hasId: !!payload?.id,
          hasSignature: !!signature,
        });
        return false;
      }

      // Calculate signature using charge ID
      const calculated = crypto
        .createHmac('sha256', process.env.OPENNODE_API_KEY)
        .update(payload.id)
        .digest('hex');

      // Compare with received signature
      const isValid = signature === calculated;

      console.log('Webhook validation:', {
        calculated: calculated?.substring(0, 10) + '...',
        received: signature?.substring(0, 10) + '...',
        isValid,
        chargeId: payload.id,
      });

      return isValid;
    } catch (error) {
      console.log('Webhook validation failed:', {
        error,
        chargeId: payload?.id,
      });
      return false;
    }
  }

  async handleWebhook(payload) {
    try {
      console.log('Processing webhook:', {
        id: payload.id,
        status: payload.status,
        hashedOrder: payload.hashed_order,
      });

      if (!this.validateWebhook(payload)) {
        throw new Error('Invalid webhook signature');
      }

      const updatedUser = await this.handlePaymentNotification(payload);
      console.log('Webhook processing completed', {
        userId: updatedUser?.id,
        newBalance: updatedUser?.tokenBalance,
      });
      return true;
    } catch (error) {
      console.log('Webhook processing failed:', {
        error: error.message,
        stack: error.stack,
        payload: payload,
      });
      throw error;
    }
  }

  async listTransactions(userId) {
    try {
      console.log('Listing transactions for user:', { userId });
      const transactions = await Transaction.find({
        user: userId,
        tokenType: 'credits',
        context: 'purchase',
      }).sort({ createdAt: -1 });

      console.log('Transactions retrieved:', {
        userId,
        count: transactions.length,
      });

      return transactions;
    } catch (error) {
      console.log('Failed to list transactions:', {
        error: error.message,
        userId,
        stack: error.stack,
      });
      throw error;
    }
  }
}

module.exports = new OpenNodeService();
