// controllers/payment/OpenNodeController.js
const OpenNodeService = require('../../services/payment/OpenNodeService');
const User = require('~/models/User');
const { logger } = require('~/config');

class OpenNodeController {
  static async createCharge(req, res) {
    try {
      console.log('Received charge request with body:', req.body);
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

      console.log('Creating Bitcoin charge', {
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
        chargeId: charge.id,
        lightning_invoice: charge.lightning_invoice,
        chain_invoice: charge.chain_invoice,
        address: charge.chain_invoice,
        amount: charge.amount,
        fiat_value: charge.fiat_value,
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
    const signature = req.headers['x-opennode-signature'];
    if (!signature) {
      throw new Error('No OpenNode signature found in headers');
    }

    logger.info('Processing webhook', {
      signatureExists: !!signature,
      bodyLength: JSON.stringify(req.body).length,
    });

    try {
      await OpenNodeService.handleWebhook(req.body, signature);
      logger.info('Webhook processed', {
        id: req.body.id,
        status: req.body.status,
      });
      res.sendStatus(200);
    } catch (error) {
      logger.error('Webhook processing error:', error);
      res.status(400).json({ error: error.message });
    }
  }

  static async getCharge(req, res) {
    try {
      const { chargeId } = req.params;
      if (!chargeId) {
        return res.status(400).json({ error: 'Charge ID is required' });
      }

      const user = await User.findById(req.user?._id);
      if (!user) {
        return res.status(401).json({ error: 'User not found' });
      }

      const charge = await OpenNodeService.getCharge(chargeId);
      res.json(charge);
    } catch (error) {
      logger.error('Charge fetch error:', {
        error: error.message,
        userId: req.user?._id,
      });
      res.status(500).json({
        error: 'Failed to fetch charge',
        details: error.message,
      });
    }
  }

  static validateWebhookPayload(payload) {
    if (!payload?.id) {
      throw new Error('Invalid webhook payload: missing charge id');
    }

    if (!payload?.status) {
      throw new Error('Invalid webhook payload: missing status');
    }

    return true;
  }
}

module.exports = OpenNodeController;
