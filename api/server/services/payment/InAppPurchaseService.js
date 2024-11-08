// services/payment/InAppPurchaseService.js

const { Transaction } = require('~/models/Transaction');
const User = require('~/models/User');
const { logger } = require('~/config');
const axios = require('axios');

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

class InAppPurchaseService {
  static async createPurchase({ amount, userId, priceId }) {
    try {
      // Validate price ID
      if (!PRICE_TOKEN_MAPPING[priceId]) {
        throw new Error(`Invalid priceId: ${priceId}`);
      }

      logger.info('Creating in-app purchase record', {
        amount,
        userId,
        priceId,
      });

      // Create a pending transaction
      const transaction = await Transaction.create({
        user: userId,
        tokenType: 'credits',
        context: 'purchase',
        rawAmount: PRICE_TOKEN_MAPPING[priceId],
        priceId: priceId,
        status: 'pending',
      });

      return transaction;
    } catch (error) {
      logger.error('Failed to create purchase', { error, amount, userId, priceId });
      throw error;
    }
  }

  static async confirmPurchase({ user, transactionId, receipt, productId }) {
    try {
      // Verify receipt with Apple
      const verificationResult = await this.verifyReceipt(receipt);

      if (!verificationResult.isValid) {
        throw new Error('Invalid receipt');
      }

      // Find pending transaction
      const transaction = await Transaction.findOne({
        user: user._id,
        status: 'pending',
      });

      if (!transaction) {
        throw new Error('No pending transaction found');
      }

      // Update transaction
      transaction.status = 'completed';
      transaction.paymentId = transactionId;
      await transaction.save();

      logger.info('Purchase confirmed and processed', {
        userId: user._id,
        transactionId,
        tokenAmount: transaction.rawAmount,
      });

      return transaction;
    } catch (error) {
      logger.error('Failed to confirm purchase', { error, userId: user._id, transactionId });
      throw error;
    }
  }

  static async verifyReceipt(receipt) {
    try {
      const verifyUrl =
        process.env.NODE_ENV === 'production'
          ? 'https://buy.itunes.apple.com/verifyReceipt'
          : 'https://sandbox.itunes.apple.com/verifyReceipt';

      const response = await axios.post(verifyUrl, {
        'receipt-data': receipt,
        password: process.env.APPLE_SHARED_SECRET,
      });

      return {
        isValid: response.data.status === 0,
        data: response.data,
      };
    } catch (error) {
      logger.error('Receipt verification failed', error);
      return { isValid: false, error: error.message };
    }
  }

  static async handleWebhook(notification) {
    try {
      const { notification_type, unified_receipt } = notification;

      switch (notification_type) {
        case 'INITIAL_BUY':
        case 'DID_RECOVER':
          await this.handleSuccessfulPurchase(unified_receipt);
          break;

        case 'REFUND':
          await this.handleRefund(unified_receipt);
          break;

        default:
          logger.info(`Unhandled notification type: ${notification_type}`);
      }
    } catch (error) {
      logger.error('Failed to process webhook', error);
      throw error;
    }
  }

  static async handleSuccessfulPurchase(receipt) {
    // This is called from Apple's server notifications
    // Most processing will be done in confirmPurchase
    logger.info('Successful purchase notification received', receipt);
  }

  static async handleRefund(receipt) {
    try {
      const { original_transaction_id } = receipt;

      // Find the transaction
      const transaction = await Transaction.findOne({
        paymentId: original_transaction_id,
        status: 'completed',
      });

      if (transaction) {
        // Mark as refunded
        transaction.status = 'refunded';
        await transaction.save();

        logger.info('Purchase refunded', {
          transactionId: transaction._id,
          userId: transaction.user,
        });
      }
    } catch (error) {
      logger.error('Failed to process refund', error);
      throw error;
    }
  }
}

module.exports = InAppPurchaseService;
