const express = require('express');
const router = express.Router();
const requireJwtAuth = require('../middleware/requireJwtAuth');
const { Transaction } = require('../../models/Transaction');
const { Balance } = require('../../models/Balance');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

/**
 * @route POST /api/stripe/create-payment-intent
 * @description Create a payment intent for Stripe
 * @access Private
 */
router.post('/create-payment-intent', requireJwtAuth, async (req, res) => {
  try {
    const { packageId, amount, paymentMethod } = req.body;
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

    // Map our payment method IDs to Stripe payment method types
    const paymentMethodMap = {
      card: 'card',
      google: 'google_pay',
      apple: 'apple_pay',
      wechat: 'wechat_pay',
      alipay: 'alipay',
      bitcoin: 'bitcoin',
    };

    // Get the payment method type from our internal ID
    const paymentMethodType = paymentMethodMap[paymentMethod] || 'card';

    // Create a payment intent with the specified payment method
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: 'usd',
      metadata: {
        userId,
        packageId,
        tokenAmount,
      },
      payment_method_types: [paymentMethodType],
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({ error: 'Failed to create payment intent' });
  }
});

/**
 * Handle webhook events from Stripe
 * This is called from server/index.js which handles the raw body parsing and signature verification
 * @param {Object} req - Express request object with stripeEvent attached
 * @param {Object} res - Express response object
 */
const handleWebhook = async (req, res) => {
  const event = req.stripeEvent;

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded': {
      const paymentIntent = event.data.object;
      await handleSuccessfulPayment(paymentIntent);
      break;
    }
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  res.send();
};

/**
 * Handle successful payment by creating a transaction and updating the user's balance
 * @param {Object} paymentIntent - The Stripe payment intent object
 */
async function handleSuccessfulPayment(paymentIntent) {
  try {
    const { userId, packageId, tokenAmount } = paymentIntent.metadata;

    if (!userId || !tokenAmount) {
      console.error('Missing metadata in payment intent:', paymentIntent.id);
      return;
    }

    // Create a transaction
    const transaction = new Transaction({
      user: userId,
      type: 'purchase',
      source: 'stripe',
      sourceId: paymentIntent.id,
      rawAmount: tokenAmount,
      tokenType: 'token',
      valueKey: 'tokenCredits',
      rate: 1,
      model: 'token-purchase',
      context: `Purchase of ${packageId} tokens`,
    });

    // Calculate token value and save the transaction
    transaction.calculateTokenValue();
    await transaction.save();

    // Update the user's balance
    let balance = await Balance.findOne({ user: userId }).lean();
    if (!balance) {
      balance = new Balance({ user: userId, tokenCredits: 0 });
    }

    await Balance.findOneAndUpdate(
      { user: userId },
      { $inc: { tokenCredits: transaction.tokenValue } },
      { new: true, upsert: true },
    );

    console.log(`Successfully processed payment for user ${userId}, added ${tokenAmount} tokens`);
  } catch (error) {
    console.error('Error handling successful payment:', error);
  }
}

// Export the router and the handleWebhook function
router.handleWebhook = handleWebhook;
module.exports = router;
