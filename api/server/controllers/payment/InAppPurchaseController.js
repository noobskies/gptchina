// controllers/payment/InAppPurchaseController.js
const InAppPurchaseService = require('../../services/payment/InAppPurchaseService');
const User = require('~/models/User');
const { logger } = require('~/config');

class InAppPurchaseController {
  static async createPurchase(req, res) {
    try {
      console.log('Received in-app purchase request with body:', req.body);
      const { priceId, amount } = req.body;

      const user = await User.findById(req.user?._id);

      if (!user) {
        return res.status(401).json({ error: 'User not found' });
      }

      if (!amount) {
        return res.status(400).json({ error: 'Amount is required' });
      }

      if (!priceId) {
        return res.status(400).json({ error: 'Price ID is required' });
      }

      logger.info('Creating in-app purchase', {
        amount,
        userId: user._id,
        priceId,
      });

      const purchase = await InAppPurchaseService.createPurchase({
        amount,
        userId: user._id.toString(),
        priceId,
      });

      res.json({ success: true });
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
      const { transactionId, receipt, productId } = req.body;

      if (!receipt) {
        return res.status(400).json({ error: 'Receipt is required' });
      }

      const user = await User.findById(req.user?._id);

      if (!user) {
        return res.status(401).json({ error: 'User not found' });
      }

      const result = await InAppPurchaseService.confirmPurchase({
        user,
        transactionId,
        receipt,
        productId,
      });

      res.json({
        success: true,
        balance: result.balance,
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

  static async handleWebhook(req, res) {
    try {
      const notification = req.body;
      logger.info('Processing Apple webhook', {
        notificationType: notification?.notificationType,
      });

      await InAppPurchaseService.handleWebhook(notification);

      res.json({ received: true });
    } catch (error) {
      logger.error('Webhook processing error:', error);
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = InAppPurchaseController;
