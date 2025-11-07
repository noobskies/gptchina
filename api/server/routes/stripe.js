const express = require('express');
const router = express.Router();
const requireJwtAuth = require('../middleware/requireJwtAuth');
const { Transaction, Balance } = require('~/db/models');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

/**
 * @route POST /api/stripe/create-payment-intent
 * @description Create a payment intent for Stripe
 * @access Private
 */
router.post('/create-payment-intent', requireJwtAuth, async (req, res) => {
  try {
    const { packageId, amount, paymentMethod, currency = 'usd' } = req.body;
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
    // For Google Pay, Apple Pay, and Bitcoin, we use 'card' as the payment method type
    // This is because these are essentially just different ways to access a credit card
    const paymentMethodMap = {
      card: 'card',
      google: 'card', // Use 'card' for Google Pay
      apple: 'card', // Use 'card' for Apple Pay
      wechat: 'wechat_pay',
      alipay: 'alipay',
      bitcoin: 'card', // Use 'card' for Bitcoin
    };

    // Get the payment method type from our internal ID
    const paymentMethodType = paymentMethodMap[paymentMethod] || 'card';

    // Store the original payment method in metadata for the frontend to use
    const paymentIntentOptions = {
      amount: Math.round(amount * 100), // Convert to cents
      currency: currency.toLowerCase(), // Use the currency from the request
      metadata: {
        userId,
        packageId,
        tokenAmount,
        originalPaymentMethod: paymentMethod, // Store the original payment method
        currency: currency.toLowerCase(), // Store the currency in metadata
      },
      payment_method_types: [paymentMethodType],
    };

    // Add payment method options for specific payment methods
    if (paymentMethod === 'wechat') {
      paymentIntentOptions.payment_method_options = {
        wechat_pay: {
          client: 'web',
        },
      };
    }

    // Create a payment intent with the specified payment method
    const paymentIntent = await stripe.paymentIntents.create(paymentIntentOptions);

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
    case 'payment_intent.created': {
      console.log('Payment intent created:', event.data.object.id);
      break;
    }
    case 'charge.succeeded': {
      console.log('Charge succeeded:', event.data.object.id);
      break;
    }
    case 'charge.updated': {
      console.log('Charge updated:', event.data.object.id);
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
    const { userId, packageId, tokenAmount, currency = 'usd' } = paymentIntent.metadata;

    if (!userId || !tokenAmount) {
      console.error('Missing metadata in payment intent:', paymentIntent.id);
      return;
    }

    // Parse tokenAmount to ensure it's a number
    const tokenAmountNum = parseInt(tokenAmount, 10);

    // Create a transaction with tokenValue set directly
    const transaction = new Transaction({
      user: userId,
      type: 'purchase',
      source: 'stripe',
      sourceId: paymentIntent.id,
      rawAmount: tokenAmountNum,
      tokenValue: tokenAmountNum, // Set tokenValue directly instead of calculating
      tokenType: 'credits', // Use 'credits' like in ClaimTokens.js
      valueKey: 'tokenCredits', // Specify the field to update in the Balance model
      rate: 1,
      currency: currency, // Record the currency used for the transaction
      context: `Purchase of ${packageId} tokens (${currency.toUpperCase()})`,
    });

    // Save the transaction without calculating token value
    await transaction.save();

    // Update the user's balance
    await Balance.findOneAndUpdate(
      { user: userId },
      { $inc: { tokenCredits: tokenAmountNum } },
      { upsert: true, new: true },
    );

    console.log(
      `Successfully processed payment for user ${userId}, added ${tokenAmountNum} tokens`,
    );
  } catch (error) {
    console.error('Error handling successful payment:', error);
  }
}

// Export the router and the handleWebhook function
router.handleWebhook = handleWebhook;
module.exports = router;
