const InAppPurchaseService = require('../../services/payment/InAppPurchaseService');
const User = require('~/models/User');
const { logger } = require('~/config');

class InAppPurchaseController {
  static async createPurchase(req, res) {
    try {
      console.log('Received purchase request with body:', req.body);
      const { amount, priceId, platform = 'android' } = req.body;

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
        platform,
        email: user.email,
      });

      const transaction = await InAppPurchaseService.createPurchase({
        amount,
        userId: user._id.toString(),
        priceId,
        platform,
      });

      res.json({
        success: true,
        transaction,
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
      const { productId, transactionId, receipt } = req.body;

      if (!productId || !transactionId || !receipt) {
        return res.status(400).json({
          error: 'Product ID, Transaction ID, and receipt are required',
        });
      }

      const user = await User.findById(req.user?._id);

      if (!user) {
        return res.status(401).json({ error: 'User not found' });
      }

      logger.info('Confirming in-app purchase', {
        userId: user._id,
        productId,
        transactionId,
      });

      const updatedUser = await InAppPurchaseService.confirmPurchase({
        user,
        transactionId,
        receipt,
        productId,
        platform: 'android',
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

  static async handleWebhook(req, res) {
    try {
      const payload = req.body;

      logger.info('Processing in-app purchase webhook', {
        bodyExists: !!payload,
        bodyLength: payload?.length,
      });

      this.validateWebhookEvent(payload);

      await InAppPurchaseService.handleWebhook(payload);

      logger.info('Webhook processed', {
        type: payload.notificationType,
        purchaseToken: payload.purchaseToken,
      });

      res.json({ success: true });
    } catch (error) {
      logger.error('Webhook processing error:', error);
      res.status(400).json({
        error: 'Webhook processing failed',
        details: error.message,
      });
    }
  }

  static validateWebhookEvent(event) {
    if (!event?.notificationType) {
      throw new Error('Invalid webhook event: missing notificationType');
    }

    if (!event?.purchaseToken) {
      throw new Error('Invalid webhook event: missing purchaseToken');
    }

    return true;
  }
}

module.exports = InAppPurchaseController;
