const OpenNodeService = require('../../services/payment/OpenNodeService');
const User = require('~/models/User');

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
        status: charge.status,
      });
    } catch (error) {
      console.log('Charge creation error:', {
        error: error.message,
        stack: error.stack,
        userId: req.user?._id,
      });
      res.status(500).json({
        error: 'Failed to create charge',
        details: error.message,
      });
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

      // Only return charge if it belongs to the requesting user
      if (charge.metadata?.userId !== user._id.toString()) {
        return res.status(403).json({ error: 'Unauthorized access to charge' });
      }

      res.json({
        id: charge.id,
        status: charge.status,
        amount: charge.amount,
        fiat_value: charge.fiat_value,
        lightning_invoice: charge.lightning_invoice,
        chain_invoice: charge.chain_invoice,
        created_at: charge.created_at,
        metadata: charge.metadata,
        transactions: charge.transactions,
      });
    } catch (error) {
      console.log('Charge fetch error:', {
        error: error.message,
        userId: req.user?._id,
        chargeId: req.params.chargeId,
      });
      res.status(500).json({
        error: 'Failed to fetch charge',
        details: error.message,
      });
    }
  }

  static async handleWebhook(req, res) {
    try {
      const payload = req.body;
      const signature = req.headers['x-webhook-signature']; // Add this line

      console.log('Received OpenNode webhook:', {
        id: payload.id,
        status: payload.status,
        order_id: payload.order_id,
        signature: signature, // Log this for debugging
      });

      if (!payload.id) {
        throw new Error('Missing charge ID in webhook');
      }

      await OpenNodeService.handleWebhook(payload, signature); // Pass the signature

      console.log('Webhook processed successfully:', {
        id: payload.id,
        status: payload.status,
      });

      res.sendStatus(200);
    } catch (error) {
      console.log('Webhook processing error:', {
        error: error.message,
        stack: error.stack,
        payload: req.body,
      });
      // Always return 200 to OpenNode even if we had an error
      // This prevents them from retrying webhooks that we can't process
      res.sendStatus(200);
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
    } catch (error) {
      console.log('Transaction list error:', {
        error: error.message,
        userId: req.user?._id,
      });
      res.status(500).json({
        error: 'Failed to list transactions',
        details: error.message,
      });
    }
  }
}

module.exports = OpenNodeController;
