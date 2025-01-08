const OpenNodeService = require('../../services/payment/OpenNodeService');
const User = require('~/models/User');
const { logger } = require('~/config');

class OpenNodeController {
  static async createCharge(req, res) {
    try {
      const { amount, priceId, tokens } = req.body;
      const user = await User.findById(req.user?._id);

      if (!user) {
        return res.status(401).json({ error: 'User not found' });
      }

      if (!amount || !priceId || !tokens) {
        return res.status(400).json({ error: 'Amount, priceId, and tokens are required' });
      }

      logger.info('Creating OpenNode charge', {
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
        tokens,
        successUrl: req.body.success_url,
        callbackUrl: req.body.callback_url,
      });

      res.json({
        id: charge.id,
        hosted_checkout_url: charge.hosted_checkout_url,
        status: charge.status,
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
      const signature = req.headers['x-opennode-signature'];

      if (!signature) {
        return res.status(400).json({ error: 'No signature found in headers' });
      }

      logger.info('Processing OpenNode webhook', {
        signatureExists: !!signature,
        bodyLength: req.rawBody?.length,
      });

      const event = await OpenNodeService.handleWebhook(req.rawBody, signature);

      // Store chargeId in session for frontend verification
      if (event.status === 'paid') {
        req.session.openNodeChargeId = event.id;
      }

      logger.info('Webhook processed successfully', {
        status: event.status,
        chargeId: event.id,
        metadata: event.metadata,
      });

      res.json({ received: true });
    } catch (err) {
      logger.error('Webhook processing error:', err);
      res.status(400).json({ error: err.message });
    }
  }

  static async verifyPayment(req, res) {
    try {
      const { chargeId } = req.params;
      const user = await User.findById(req.user?._id);

      if (!user) {
        return res.status(401).json({ error: 'User not found' });
      }

      const charge = await OpenNodeService.getCharge(chargeId);

      if (!charge) {
        return res.status(404).json({ error: 'Charge not found' });
      }

      if (charge.status !== 'paid') {
        return res.status(400).json({ error: 'Payment not completed' });
      }

      // Verify the charge belongs to the user
      if (charge.metadata.userId !== user._id.toString()) {
        return res.status(403).json({ error: 'Unauthorized access to payment' });
      }

      const transaction = await OpenNodeService.handleSuccessfulPayment(charge);

      res.json({
        success: true,
        tokens: charge.metadata.tokens,
        transactionId: transaction.id,
      });
    } catch (err) {
      logger.error('Payment verification error:', err);
      res.status(500).json({ error: err.message });
    }
  }

  static async listTransactions(req, res) {
    try {
      const user = await User.findById(req.user?._id);

      if (!user) {
        return res.status(401).json({ error: 'User not found' });
      }

      const transactions = await OpenNodeService.listTransactions(user._id);
      res.json(transactions);
    } catch (err) {
      logger.error('List transactions error:', err);
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = OpenNodeController;
