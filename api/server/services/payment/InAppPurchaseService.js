const { Transaction } = require('~/models/Transaction');
const User = require('~/models/User');
const { logger } = require('~/config');

const PRODUCT_TOKEN_MAPPING = {
  tokens_100k: 100000,
  tokens_500k: 500000,
  tokens_1m: 1000000,
  tokens_10m: 10000000,
};

class InAppPurchaseService {
  static async createPurchase({ amount, userId, priceId, platform }) {
    try {
      const normalizedPriceId = priceId.split('.').pop();

      if (!PRODUCT_TOKEN_MAPPING[normalizedPriceId]) {
        throw new Error(`Invalid product ID: ${normalizedPriceId}`);
      }

      const transaction = await Transaction.create({
        user: userId,
        tokenType: 'credits',
        context: 'purchase',
        rawAmount: PRODUCT_TOKEN_MAPPING[normalizedPriceId],
        priceId: normalizedPriceId,
        platform,
        status: 'pending',
      });

      logger.info('Created in-app purchase transaction:', {
        transactionId: transaction._id,
        userId,
        amount,
        priceId,
      });

      return transaction;
    } catch (error) {
      logger.error('Failed to create purchase:', error);
      throw error;
    }
  }

  static async confirmPurchase({ user, transactionId, receipt, productId, platform }) {
    try {
      const normalizedProductId = productId.split('.').pop();

      // Start session for transaction
      const session = await Transaction.startSession();
      let updatedUser;

      await session.withTransaction(async () => {
        // Find pending transaction
        const transaction = await Transaction.findOne({
          user: user._id,
          status: 'pending',
        }).sort({ createdAt: -1 });

        if (!transaction) {
          throw new Error('No pending transaction found');
        }

        // Verify amount matches
        if (transaction.rawAmount !== PRODUCT_TOKEN_MAPPING[normalizedProductId]) {
          throw new Error('Transaction amount mismatch');
        }

        // Update user's token balance
        updatedUser = await User.findByIdAndUpdate(
          user._id,
          {
            $inc: { credits: transaction.rawAmount },
          },
          { new: true, session },
        );

        // Complete the transaction
        transaction.status = 'completed';
        transaction.paymentId = transactionId;
        transaction.receiptData = receipt;
        await transaction.save({ session });

        logger.info('Purchase completed:', {
          userId: user._id,
          transactionId,
          amount: transaction.rawAmount,
        });
      });

      return updatedUser;
    } catch (error) {
      logger.error('Failed to confirm purchase:', error);
      throw error;
    }
  }

  static async handleWebhook(payload) {
    try {
      // Handle any Google Play notifications if needed
      logger.info('Processing webhook payload:', payload);
      return true;
    } catch (error) {
      logger.error('Failed to process webhook:', error);
      throw error;
    }
  }
}

module.exports = InAppPurchaseService;
