// services/payment/InAppService.js
const User = require('~/models/User');
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

  static async confirmPurchase({ packageId, productIdentifier, transactionId, user }) {
    logger.info('Confirming purchase', {
      packageId,
      productIdentifier,
      transactionId,
      userId: user._id,
    });

    const tokenAmount = PACKAGE_TOKEN_MAP[packageId];
    if (!tokenAmount) {
      throw new Error(`Invalid package ID: ${packageId}`);
    }

    // Add tokens to user's balance
    user.tokenBalance = (user.tokenBalance || 0) + tokenAmount;

    // Record the transaction
    const transaction = {
      packageId,
      productIdentifier,
      transactionId,
      tokenAmount,
      timestamp: new Date(),
      platform: 'google_play',
    };

    // Add to purchases history if you have that field
    if (!user.purchases) {
      user.purchases = [];
    }
    user.purchases.push(transaction);

    // Add to transactions if you have that field
    if (!user.transactions) {
      user.transactions = [];
    }
    user.transactions.push({
      ...transaction,
      type: 'purchase',
      source: 'google_play',
      amount: tokenAmount,
    });

    console.log('Updating user balance', {
      userId: user._id,
      oldBalance: user.tokenBalance - tokenAmount,
      newBalance: user.tokenBalance,
      tokenAmount,
    });

    await user.save();

    return user;
  }

  // Helper method to validate package
  static validatePackage(packageId) {
    return !!PACKAGE_TOKEN_MAP[packageId];
  }
}

module.exports = InAppService;
