const User = require('~/models/User');
const { Transaction } = require('~/models/Transaction');
const { logger } = require('~/config');

const PACKAGE_TOKEN_MAP = {
  tokens_100k: 100000,
  tokens_500k: 500000,
  tokens_1m: 1000000,
  tokens_10m: 10000000,
};

class InAppService {
  static async createPurchase({ priceId, packageId, userId, email }) {
    logger.info('Creating purchase record', {
      priceId,
      packageId,
      userId,
      email,
    });

    // You could store pending purchases in a separate collection if needed
    return {
      id: `purchase_${Date.now()}`,
      priceId,
      packageId,
      userId,
      status: 'pending',
    };
  }

  static async confirmPurchase({
    packageId,
    productIdentifier,
    transactionId,
    user,
    platform = 'google_play',
  }) {
    try {
      logger.info('Confirming purchase', {
        packageId,
        productIdentifier,
        transactionId,
        userId: user._id,
        platform,
      });

      const tokenAmount = PACKAGE_TOKEN_MAP[packageId];
      if (!tokenAmount) {
        throw new Error(`Invalid package ID: ${packageId}`);
      }

      // Check for existing transaction first
      const existingTransaction = await Transaction.findOne({
        user: user._id,
        tokenType: 'credits',
        context: 'purchase',
        paymentId: transactionId,
      });

      if (existingTransaction) {
        logger.info('Payment already processed', { id: transactionId });
        return user;
      }

      // Create transaction record first
      const transaction = await Transaction.create({
        user: user._id,
        tokenType: 'credits',
        context: 'purchase',
        rawAmount: tokenAmount,
        paymentId: transactionId,
        priceId: packageId,
      });

      logger.info('Transaction created', {
        transactionId: transaction._id,
        userId: user._id,
        tokenAmount,
      });

      // Add tokens to user's balance
      user.tokenBalance = (user.tokenBalance || 0) + tokenAmount;

      // Record the purchase history
      const purchaseRecord = {
        packageId,
        productIdentifier,
        transactionId,
        tokenAmount,
        timestamp: new Date(),
        platform: platform === 'ios' ? 'app_store' : 'google_play',
      };

      if (!user.purchases) {
        user.purchases = [];
      }
      user.purchases.push(purchaseRecord);

      if (!user.transactions) {
        user.transactions = [];
      }
      user.transactions.push({
        ...purchaseRecord,
        type: 'purchase',
        source: platform === 'ios' ? 'app_store' : 'google_play',
        amount: tokenAmount,
      });

      logger.info('Updating user balance', {
        userId: user._id,
        oldBalance: user.tokenBalance - tokenAmount,
        newBalance: user.tokenBalance,
        tokenAmount,
      });

      await user.save();

      return user;
    } catch (error) {
      logger.error('Failed to process purchase', {
        error: error.message,
        packageId,
        transactionId,
        userId: user._id,
      });
      throw error;
    }
  }

  // Helper method to validate package
  static validatePackage(packageId) {
    return !!PACKAGE_TOKEN_MAP[packageId];
  }
}

module.exports = InAppService;
