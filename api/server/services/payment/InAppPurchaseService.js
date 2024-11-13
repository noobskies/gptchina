const { Transaction } = require('~/models/Transaction');
const User = require('~/models/User');
const { logger } = require('~/config');

// Token mappings for both platforms
const PRODUCT_TOKEN_MAPPING = {
  // Google Play product IDs (without package name prefix as it's handled by the plugin)
  tokens_100k: 100000, // 100k tokens
  tokens_500k: 500000, // 500k tokens
  tokens_1m: 1000000, // 1M tokens
  tokens_10m: 10000000, // 10M tokens

  // Stripe price IDs (for web)
  price_1P6dqBHKD0byXXClWuA2RGY2: 100000,
  price_1P6dqdHKD0byXXClcboa06Tu: 500000,
  price_1P6drEHKD0byXXClOjmSkPKm: 1000000,
  price_1P6drxHKD0byXXClVVLokkLh: 10000000,
};

class InAppPurchaseService {
  static async createPurchase({ amount, userId, priceId, platform }) {
    try {
      // For Google Play, strip the package name if present
      const normalizedPriceId = platform === 'android' ? priceId.split('.').pop() : priceId;

      // Validate price ID
      if (!PRODUCT_TOKEN_MAPPING[normalizedPriceId]) {
        throw new Error(`Invalid priceId: ${normalizedPriceId}`);
      }

      logger.info('Creating in-app purchase record', {
        amount,
        userId,
        priceId: normalizedPriceId,
        platform,
      });

      const transaction = await Transaction.create({
        user: userId,
        tokenType: 'credits',
        context: 'purchase',
        rawAmount: PRODUCT_TOKEN_MAPPING[normalizedPriceId],
        priceId: normalizedPriceId,
        platform: platform,
        status: 'pending',
      });

      return transaction;
    } catch (error) {
      logger.error('Failed to create purchase', { error, amount, userId, priceId });
      throw error;
    }
  }

  static async confirmPurchase({ user, transactionId, receipt, productId, platform }) {
    try {
      // Find pending transaction
      const transaction = await Transaction.findOne({
        user: user._id,
        status: 'pending',
      });

      if (!transaction) {
        throw new Error('No pending transaction found');
      }

      // The plugin has already verified the receipt, so we just need to complete the transaction
      transaction.status = 'completed';
      transaction.paymentId = transactionId;
      transaction.receiptData = receipt;
      await transaction.save();

      logger.info('Purchase confirmed and processed', {
        userId: user._id,
        transactionId,
        tokenAmount: transaction.rawAmount,
        platform,
      });

      return transaction;
    } catch (error) {
      logger.error('Failed to confirm purchase', { error, userId: user._id, transactionId });
      throw error;
    }
  }
}

module.exports = InAppPurchaseService;
