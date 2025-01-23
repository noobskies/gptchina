// services/payment/OpenNodeService.js
const opennode = require('opennode');
const User = require('~/models/User');
const { Transaction } = require('~/models/Transaction');
const { logger } = require('~/config');

// Initialize OpenNode with API key
opennode.setCredentials(process.env.OPENNODE_API_KEY);

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

const isValidPriceId = (priceId) => {
  return !!PRICE_TOKEN_MAPPING[priceId];
};

const getCurrencyFromPriceId = (priceId) => {
  return priceId.startsWith('price_1ORg') ? 'CNY' : 'USD';
};

class OpenNodeService {
  static async createCharge({ amount, userId, email, priceId }) {
    try {
      if (!priceId || !isValidPriceId(priceId)) {
        throw new Error(`Invalid priceId: ${priceId}`);
      }

      const expectedAmount = PRICE_AMOUNT_MAPPING[priceId];
      if (amount !== expectedAmount) {
        throw new Error(`Invalid amount for priceId. Expected: ${expectedAmount}, Got: ${amount}`);
      }

      console.log('Creating OpenNode charge', {
        amount,
        userId,
        priceId,
        email,
      });

      // Convert amount from cents to dollars for OpenNode
      const chargeAmount = amount / 100;

      const chargePayload = {
        amount: chargeAmount,
        currency: getCurrencyFromPriceId(priceId),
        order_id: `${userId}_${priceId}`,
        customer_email: email,
        description: `Purchase of ${PRICE_TOKEN_MAPPING[priceId]} tokens`,
        success_url: `${process.env.DOMAIN_CLIENT}/`,
        callback_url: `${process.env.DOMAIN_CLIENT}/api/payment/opennode/webhook`,
        auto_settle: false,
        metadata: {
          userId,
          priceId,
        },
      };

      console.log('OpenNode charge payload:', {
        payload: JSON.stringify(chargePayload, null, 2),
      });

      try {
        const charge = await opennode.createCharge(chargePayload);
        console.log('OpenNode charge response:', {
          response: JSON.stringify(charge, null, 2),
        });
        return charge;
      } catch (openNodeError) {
        // Log the complete error
        console.log('OpenNode API Error Details:', {
          message: openNodeError.message,
          status: openNodeError.status,
          response: openNodeError.response?.data,
          rawError: JSON.stringify(openNodeError, Object.getOwnPropertyNames(openNodeError), 2),
          stack: openNodeError.stack,
        });

        // If there's an error response, log it separately
        if (openNodeError.response) {
          console.log('OpenNode API Response:', {
            status: openNodeError.response.status,
            statusText: openNodeError.response.statusText,
            data: JSON.stringify(openNodeError.response.data, null, 2),
            headers: openNodeError.response.headers,
          });
        }

        throw openNodeError;
      }
    } catch (error) {
      console.log('Failed to create charge', {
        error: error.message,
        errorObject: JSON.stringify(error, Object.getOwnPropertyNames(error), 2),
        amount,
        userId,
        priceId,
      });
      throw error;
    }
  }

  static async handleWebhook(payload) {
    try {
      logger.info('Received OpenNode webhook payload:', {
        payloadType: typeof payload,
        rawPayload: JSON.stringify(payload, null, 2),
      });

      if (!payload) {
        logger.error('Empty webhook payload received');
        throw new Error('Empty webhook payload');
      }

      logger.info('Webhook basic details:', {
        status: payload.status,
        id: payload.id,
        orderId: payload.order_id,
        metadata: payload.metadata,
      });

      const isValid = await opennode.signatureIsValid(payload);
      logger.info('Webhook signature validation:', { isValid });

      if (!isValid) {
        logger.error('Invalid webhook signature');
        throw new Error('Invalid webhook signature');
      }

      const { status, id, metadata } = payload;

      logger.info('Processing webhook with status:', {
        status,
        id,
        metadata,
      });

      switch (status) {
        case 'processing':
          logger.info('Payment processing:', {
            id,
            metadata,
            amount: payload.amount,
            fiatValue: payload.fiat_value,
          });
          break;

        case 'paid':
          logger.info('Starting paid payment processing');
          const transaction = await this.handleSuccessfulPayment(payload);
          logger.info('Successfully processed paid payment:', {
            transactionId: transaction._id,
            chargeId: id,
            userId: metadata?.userId,
          });
          break;

        case 'expired':
        case 'cancelled':
          logger.info('Starting failed payment processing');
          await this.handleFailedPayment(payload);
          logger.info('Processed failed payment:', {
            status,
            id,
            userId: metadata?.userId,
          });
          break;

        default:
          logger.info(`Unhandled payment status: ${status}`, {
            id,
            status,
          });
      }

      return payload;
    } catch (error) {
      console.log('Webhook processing error:', {
        error: error.message,
        stack: error.stack,
        payload: JSON.stringify(payload, null, 2),
      });
      throw error;
    }
  }

  static async handleSuccessfulPayment(charge) {
    logger.info('Starting successful payment processing:', {
      chargeId: charge.id,
      metadata: charge.metadata,
    });

    const { userId, priceId } = charge.metadata || {};

    if (!priceId || !PRICE_TOKEN_MAPPING[priceId]) {
      console.log('Invalid metadata in charge:', {
        chargeId: charge.id,
        metadata: charge.metadata,
      });
      throw new Error('Valid priceId is required');
    }

    try {
      const user = await User.findById(userId);
      if (!user) {
        console.log('User not found:', { userId });
        throw new Error('User not found');
      }

      // Check for existing transaction
      const existingTransaction = await Transaction.findOne({
        user: userId,
        tokenType: 'credits',
        context: 'purchase',
        paymentId: charge.id,
        paymentProvider: 'opennode',
      });

      if (existingTransaction) {
        console.log('Payment already processed:', {
          chargeId: charge.id,
          transactionId: existingTransaction._id,
        });
        return existingTransaction;
      }

      const tokenAmount = PRICE_TOKEN_MAPPING[priceId];
      console.log('Creating transaction record:', {
        userId,
        tokenAmount,
        chargeId: charge.id,
      });

      const transaction = await Transaction.create({
        user: userId,
        tokenType: 'credits',
        context: 'purchase',
        rawAmount: tokenAmount,
        paymentId: charge.id,
        priceId: priceId,
        paymentProvider: 'opennode',
        btcAmount: charge.btc_amount,
        checkoutUrl: charge.hosted_checkout_url,
      });

      console.log('Created transaction record:', {
        transactionId: transaction._id,
      });

      // Update user's token balance
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $inc: { tokenBalance: tokenAmount } },
        { new: true },
      );

      console.log('Updated user token balance:', {
        userId,
        oldBalance: user.tokenBalance,
        newBalance: updatedUser.tokenBalance,
        addedTokens: tokenAmount,
      });

      return transaction;
    } catch (error) {
      console.log('Failed to process successful payment:', {
        error: error.message,
        stack: error.stack,
        chargeId: charge.id,
        userId,
        priceId,
      });
      throw error;
    }
  }

  static async handleSuccessfulPayment(charge) {
    const { userId, priceId } = charge.metadata || {};

    if (!priceId || !PRICE_TOKEN_MAPPING[priceId]) {
      console.error('Missing or invalid priceId in payment metadata:', charge);
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
        paymentId: charge.id,
        paymentProvider: 'opennode',
      });

      if (existingTransaction) {
        console.log('Payment already processed', { id: charge.id });
        return;
      }

      const tokenAmount = PRICE_TOKEN_MAPPING[priceId];

      // Create transaction record
      const transaction = await Transaction.create({
        user: userId,
        tokenType: 'credits',
        context: 'purchase',
        rawAmount: tokenAmount,
        paymentId: charge.id,
        priceId: priceId,
        paymentProvider: 'opennode',
        btcAmount: charge.btc_amount,
        checkoutUrl: charge.hosted_checkout_url,
      });

      // Add tokens to user's balance
      await User.findByIdAndUpdate(userId, {
        $inc: { tokenBalance: tokenAmount },
      });

      console.log('Successful payment processed via webhook', {
        id: charge.id,
        userId,
        tokenAmount,
        transactionId: transaction._id,
        newBalance: user.tokenBalance + tokenAmount,
      });

      return transaction;
    } catch (error) {
      console.log('Failed to process successful payment', {
        error: error.message,
        stack: error.stack,
        chargeId: charge.id,
        userId,
        priceId,
      });
      throw error;
    }
  }

  static async handleFailedPayment(charge) {
    const { userId } = charge.metadata;

    try {
      const transaction = await Transaction.create({
        user: userId,
        tokenType: 'credits',
        context: 'purchase',
        rawAmount: 0,
        paymentId: charge.id,
        priceId: charge.metadata.priceId,
        paymentProvider: 'opennode',
        error: charge.status,
        btcAmount: charge.btc_amount,
        checkoutUrl: charge.hosted_checkout_url,
      });

      console.log('Payment failed', {
        id: charge.id,
        userId,
        status: charge.status,
        transactionId: transaction._id,
      });

      return transaction;
    } catch (error) {
      console.log('Failed to process failed payment', { error, charge });
      throw error;
    }
  }
}

module.exports = OpenNodeService;
