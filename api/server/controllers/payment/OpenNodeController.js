// controllers/payment/OpenNodeController.js
const OpenNodeService = require('../../services/payment/OpenNodeService');
const User = require('~/models/User');
const { logger } = require('~/config');

class OpenNodeController {
  static async createCharge(req, res) {
    try {
      console.log('Received charge creation request with body:', req.body);
      const { amount, priceId } = req.body;

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

      console.log('Creating OpenNode charge', {
        amount,
        userId: user._id,
        priceId,
        email: user.email,
      });

      const charge = await OpenNodeService.createCharge({
        amount,
        userId: user._id.toString(),
        email: user.email,
        priceId,
      });

      res.json({
        hosted_checkout_url: charge.hosted_checkout_url,
        charge_id: charge.id,
      });
    } catch (error) {
      logger.error('Charge creation error:', error);
      res.status(500).json({
        error: 'Failed to create charge',
        details: error.message,
      });
    }
  }

  static async handleWebhook(req, res) {
    try {
      logger.info('Processing webhook', {
        bodyLength: req.body?.length,
      });

      const event = await OpenNodeService.handleWebhook(req.body);

      logger.info('Webhook processed', {
        status: event.status,
        id: event.id,
      });

      // OpenNode expects a 200 response
      res.sendStatus(200);
    } catch (error) {
      logger.error('Webhook processing error:', error);
      // Even in case of an error, OpenNode expects a 200 response
      res.sendStatus(200);
    }
  }

  // Helper method to validate webhook event
  static validateWebhookEvent(event) {
    if (!event?.type) {
      throw new Error('Invalid webhook event: missing type');
    }

    if (!event?.data) {
      throw new Error('Invalid webhook event: missing data');
    }

    return true;
  }
}

module.exports = OpenNodeController;
