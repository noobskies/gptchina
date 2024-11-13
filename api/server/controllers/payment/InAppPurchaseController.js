const InAppPurchaseService = require('../../services/payment/InAppPurchaseService');
const User = require('~/models/User');
const { logger } = require('~/config');

class InAppPurchaseController {
  static async createPurchase(req, res) {
    try {
      const { amount, priceId } = req.body;
      const userId = req.user._id;

      if (!amount || !priceId) {
        return res.status(400).json({ error: 'Amount and priceId are required' });
      }

      const transaction = await InAppPurchaseService.createPurchase({
        amount,
        userId,
        priceId,
      });

      res.json({ success: true, transaction });
    } catch (error) {
      console.log('Create purchase failed:', error);
      res.status(400).json({ error: error.message });
    }
  }

  static async confirmPurchase(req, res) {
    try {
      const { productId, transactionId, receipt } = req.body;
      const userId = req.user._id;

      console.log('Confirming in-app purchase', { userId, productId, transactionId });

      const updatedUser = await InAppPurchaseService.confirmPurchase({
        userId,
        transactionId,
        productId,
      });

      res.json({
        success: true,
        balance: updatedUser.credits,
      });
    } catch (error) {
      console.log('Confirm purchase failed:', error);
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = InAppPurchaseController;
