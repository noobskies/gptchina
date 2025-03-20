const express = require('express');
const router = express.Router();
const requireJwtAuth = require('../middleware/requireJwtAuth');
const { Transaction } = require('../../models/Transaction');
const Balance = require('../../models/Balance');
const opennode = require('opennode');

// Initialize OpenNode with API key - always use live mode
opennode.setCredentials(process.env.OPENNODE_API_KEY, 'live');

/**
 * @route POST /api/opennode/create-charge
 * @description Create a charge for OpenNode Bitcoin payment
 * @access Private
 */
router.post('/create-charge', requireJwtAuth, async (req, res) => {
  try {
    const { packageId, amount } = req.body;
    const userId = req.user.id;

    if (!packageId || !amount) {
      return res.status(400).json({ error: 'Package ID and amount are required' });
    }

    // Map token packages to token amounts
    const tokenAmounts = {
      '100k': 100000,
      '500k': 500000,
      '1m': 1000000,
      '10m': 10000000,
    };

    const tokenAmount = tokenAmounts[packageId];
    if (!tokenAmount) {
      return res.status(400).json({ error: 'Invalid package ID' });
    }

    console.log(
      'Creating OpenNode charge with API key:',
      process.env.OPENNODE_API_KEY ? 'API key exists' : 'API key missing',
    );

    // Log the request parameters for debugging
    console.log('OpenNode charge request parameters:', {
      amount,
      currency: 'USD',
      description: `Purchase of ${packageId} tokens`,
      // Omitting sensitive data
    });

    try {
      // Create a charge with OpenNode
      const charge = await opennode.createCharge({
        amount: amount,
        currency: 'USD',
        description: `Purchase of ${packageId} tokens`,
        callback_url: `${process.env.HOST_URL || 'http://localhost:3080'}/api/opennode/webhook`,
        success_url: `${process.env.HOST_URL || 'http://localhost:3080'}`,
        auto_settle: true,
        ttl: 60 * 60, // 1 hour expiry
        metadata: {
          userId: userId,
          packageId: packageId,
          tokenAmount: tokenAmount,
        },
      });

      res.json({
        id: charge.id,
        hosted_checkout_url: charge.hosted_checkout_url,
        lightning_invoice: charge.lightning_invoice,
      });
    } catch (error) {
      // Log detailed error information
      console.error('Error creating OpenNode charge:', error);
      console.error('Error details:', {
        status: error.status,
        message: error.message,
        response: error.response?.data || 'No response data',
      });

      // Return appropriate status code based on the error
      const statusCode = error.status || 500;
      res.status(statusCode).json({
        error: 'Failed to create charge',
        details: error.message,
        status: statusCode,
      });
    }
  } catch (error) {
    console.error('Unexpected error in OpenNode charge creation:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Handle webhook events from OpenNode
 * This is called from server/index.js which handles the signature verification
 * @param {Object} req - Express request object with openNodeEvent attached
 * @param {Object} res - Express response object
 */
const handleWebhook = async (req, res) => {
  try {
    const event = req.body;

    // No need to verify webhook signature separately as OpenNode handles this internally

    // Check if this is a payment confirmation
    if (event.status === 'paid') {
      await handleSuccessfulPayment(event);
    }

    // Return a 200 response to acknowledge receipt of the event
    res.status(200).send('OK');
  } catch (error) {
    console.error('Error handling OpenNode webhook:', error);
    res.status(500).send('Error processing webhook');
  }
};

/**
 * Handle successful payment by creating a transaction and updating the user's balance
 * @param {Object} event - The OpenNode payment event
 */
async function handleSuccessfulPayment(event) {
  try {
    const { userId, packageId, tokenAmount } = event.metadata;

    if (!userId || !tokenAmount) {
      console.error('Missing metadata in payment event:', event.id);
      return;
    }

    // Parse tokenAmount to ensure it's a number
    const tokenAmountNum = parseInt(tokenAmount, 10);

    // Create a transaction
    const transaction = new Transaction({
      user: userId,
      type: 'purchase',
      source: 'opennode',
      sourceId: event.id,
      rawAmount: tokenAmountNum,
      tokenValue: tokenAmountNum,
      tokenType: 'credits',
      valueKey: 'tokenCredits',
      rate: 1,
      context: `Bitcoin purchase of ${packageId} tokens`,
    });

    // Save the transaction
    await transaction.save();

    // Update the user's balance
    await Balance.findOneAndUpdate(
      { user: userId },
      { $inc: { tokenCredits: tokenAmountNum } },
      { upsert: true, new: true },
    );

    console.log(
      `Successfully processed Bitcoin payment for user ${userId}, added ${tokenAmountNum} tokens`,
    );
  } catch (error) {
    console.error('Error handling successful Bitcoin payment:', error);
  }
}

// Export the router and the handleWebhook function
router.handleWebhook = handleWebhook;
module.exports = router;
