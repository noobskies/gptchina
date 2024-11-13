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
  static async createPurchase({ amount, userId, priceId }) {
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
        platform: 'android',
        status: 'pending',
      });

      return transaction;
    } catch (error) {
      logger.error('Failed to create purchase:', error);
      throw error;
    }
  }

  static async confirmPurchase({ userId, transactionId, productId }) {
    try {
      const normalizedProductId = productId.split('.').pop();
      const tokenAmount = PRODUCT_TOKEN_MAPPING[normalizedProductId];

      if (!tokenAmount) {
        throw new Error(`Invalid product ID: ${normalizedProductId}`);
      }

      // Update user's balance
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $inc: { credits: tokenAmount } },
        { new: true },
      );

      // Update or create transaction
      await Transaction.findOneAndUpdate(
        { user: userId, status: 'pending' },
        {
          status: 'completed',
          paymentId: transactionId,
          rawAmount: tokenAmount,
        },
        { upsert: true },
      );

      console.log('Purchase completed', {
        userId,
        productId: normalizedProductId,
        tokenAmount,
        newBalance: updatedUser.credits,
      });

      return updatedUser;
    } catch (error) {
      logger.error('Failed to confirm purchase:', error);
      throw error;
    }
  }
}

module.exports = InAppPurchaseService;
