const InAppService = require('../../services/payment/InAppService');
const User = require('~/models/User');
const { logger } = require('~/config');

class InAppPurchaseController {
  static async createPurchase(req, res) {
    try {
      console.log('Received in-app purchase request:', req.body);
      const { priceId, packageId } = req.body;

      const user = await User.findById(req.user?._id);

      if (!user) {
        return res.status(401).json({ error: 'User not found' });
      }

      if (!priceId || !packageId) {
        return res.status(400).json({ error: 'Price ID and Package ID are required' });
      }

      logger.info('Creating in-app purchase', {
        priceId,
        packageId,
        userId: user._id,
        email: user.email,
      });

      // Store pending purchase if needed
      const pendingPurchase = await InAppService.createPurchase({
        priceId,
        packageId,
        userId: user._id.toString(),
        email: user.email,
      });

      res.json({
        success: true,
        purchaseId: pendingPurchase.id,
      });
    } catch (error) {
      logger.error('Purchase creation error:', error);
      res.status(500).json({
        error: 'Failed to create purchase',
        details: error.message,
      });
    }
  }

  static async confirmPurchase(req, res) {
    try {
      const { priceId, packageId, productIdentifier, transactionId, platform } = req.body;

      if (!packageId || !productIdentifier || !transactionId) {
        return res.status(400).json({
          error: 'Package ID, Product Identifier, and Transaction ID are required',
        });
      }

      const user = await User.findById(req.user?._id);

      if (!user) {
        return res.status(401).json({ error: 'User not found' });
      }

      const updatedUser = await InAppService.confirmPurchase({
        packageId,
        productIdentifier,
        transactionId,
        user,
        platform: platform || 'google_play', // Default to google_play for backward compatibility
      });

      res.json({
        success: true,
        balance: updatedUser.tokenBalance,
      });
    } catch (error) {
      logger.error('Purchase confirmation error:', {
        error: error.message,
        userId: req.user?._id,
      });

      res.status(500).json({
        error: 'Failed to confirm purchase',
        details: error.message,
      });
    }
  }
}

module.exports = InAppPurchaseController;
