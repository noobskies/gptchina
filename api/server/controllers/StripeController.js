const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { Transaction } = require('~/models/Transaction');
const Balance = require('~/models/Balance');
const { logger } = require('~/config');

/**
 * Create a payment intent for token purchase
 */
async function createPaymentIntent(req, res) {
  try {
    const { amount, packageId } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Invalid amount' });
    }

    // Amount in cents for Stripe
    const amountInCents = Math.round(amount * 100);

    // Create a payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: 'usd',
      metadata: {
        userId: req.user.id,
        packageId,
        tokenAmount: packageId ? getTokenAmountForPackage(packageId) : 0,
      },
    });

    logger.debug('[StripeController] Payment intent created', {
      userId: req.user.id,
      paymentIntentId: paymentIntent.id,
      amount: amountInCents,
      clientSecret: paymentIntent.client_secret,
    });

    return res.status(200).json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    logger.error('[StripeController] Error creating payment intent', error);
    return res.status(500).json({ message: 'Error creating payment intent' });
  }
}

/**
 * Handle successful payment and add tokens to user balance
 */
async function handleSuccessfulPayment(paymentIntent) {
  try {
    const { userId, packageId, tokenAmount } = paymentIntent.metadata;

    // Create a transaction to add tokens to user's balance
    const result = await Transaction.create({
      user: userId,
      tokenType: 'credits',
      context: 'purchase',
      rawAmount: parseInt(tokenAmount, 10),
      metadata: {
        paymentId: paymentIntent.id,
        paymentMethod: 'stripe',
        packageId,
      },
    });

    logger.debug('[StripeController] Tokens added to balance', {
      userId,
      tokenAmount,
      newBalance: result.balance,
    });

    return result;
  } catch (error) {
    logger.error('[StripeController] Error adding tokens to balance', error);
    throw error;
  }
}

/**
 * Handle Stripe webhook events
 */
async function handleWebhook(req, res) {
  logger.debug('[StripeController] Received webhook event');

  const sig = req.headers['stripe-signature'];
  if (!sig) {
    logger.error('[StripeController] No Stripe signature found in headers');
    return res.status(400).send('No Stripe signature found in headers');
  }

  if (!req.rawBody) {
    logger.error('[StripeController] No raw body found in request');
    return res.status(400).send('No raw body found in request');
  }

  logger.debug('[StripeController] Webhook headers:', req.headers);

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET);
    logger.debug('[StripeController] Webhook event constructed successfully:', {
      type: event.type,
    });
  } catch (err) {
    logger.error('[StripeController] Webhook signature verification failed', err);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded': {
      const paymentIntent = event.data.object;
      logger.debug('[StripeController] Payment intent succeeded, processing payment', {
        paymentIntentId: paymentIntent.id,
        metadata: paymentIntent.metadata,
      });

      try {
        const result = await handleSuccessfulPayment(paymentIntent);
        logger.debug('[StripeController] Payment processed successfully', {
          paymentIntentId: paymentIntent.id,
          result,
        });
      } catch (error) {
        logger.error('[StripeController] Error processing successful payment', {
          paymentIntentId: paymentIntent.id,
          error,
        });
      }
      break;
    }
    case 'payment_intent.payment_failed': {
      const failedPaymentIntent = event.data.object;
      logger.error('[StripeController] Payment failed', {
        paymentIntentId: failedPaymentIntent.id,
        error: failedPaymentIntent.last_payment_error,
      });
      break;
    }
    default:
      // Unexpected event type
      logger.debug(`[StripeController] Unhandled event type ${event.type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  logger.debug('[StripeController] Webhook processed successfully');
  res.status(200).send('Webhook received successfully');
}

/**
 * Helper function to get token amount for a package
 */
function getTokenAmountForPackage(packageId) {
  const packages = {
    basic: 100000,
    standard: 500000,
    premium: 1000000,
    ultimate: 10000000,
  };
  return packages[packageId] || 0;
}

module.exports = {
  createPaymentIntent,
  handleWebhook,
};
