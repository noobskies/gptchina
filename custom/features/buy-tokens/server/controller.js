/**
 * CUSTOM: gptchina fork
 *
 * Feature: Buy Tokens (Stripe Integration)
 * Created: 2025-11-09
 * Upstream Impact: None (standalone module)
 *
 * Controller for handling token purchase requests.
 */

const { BUY_TOKENS_ERRORS } = require('../shared/constants');
const { Balance } = require('../../../../api/db/models');
const { createTransaction } = require('../../../../api/models/Transaction');
const { logger } = require('@librechat/data-schemas');
const {
  createPaymentIntent,
  verifyWebhookSignature,
  getAvailablePaymentMethods,
  getPackageById,
} = require('./stripe.service');

/**
 * Create payment intent for token purchase
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const createPaymentIntentHandler = async (req, res) => {
  try {
    const userId = req.user.id;
    const { packageId, paymentMethod = 'card' } = req.body;

    if (!userId) {
      logger.error('[BuyTokens] User ID not found in request');
      return res.status(401).json({
        success: false,
        error: BUY_TOKENS_ERRORS.UNAUTHORIZED,
      });
    }

    if (!packageId) {
      logger.error('[BuyTokens] Package ID missing', { userId });
      return res.status(400).json({
        success: false,
        error: BUY_TOKENS_ERRORS.INVALID_PACKAGE,
      });
    }

    // Verify package exists
    const tokenPackage = getPackageById(packageId);
    if (!tokenPackage) {
      logger.error('[BuyTokens] Invalid package ID', { userId, packageId });
      return res.status(400).json({
        success: false,
        error: BUY_TOKENS_ERRORS.INVALID_PACKAGE,
      });
    }

    // Create payment intent via Stripe
    const paymentIntent = await createPaymentIntent(userId, packageId, paymentMethod);

    logger.info('[BuyTokens] Payment intent created successfully', {
      userId,
      packageId,
      paymentIntentId: paymentIntent.id,
      amount: tokenPackage.price,
    });

    return res.status(200).json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      amount: tokenPackage.price,
      currency: paymentIntent.currency,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    logger.error('[BuyTokens] Error creating payment intent', error);
    return res.status(500).json({
      success: false,
      error: BUY_TOKENS_ERRORS.SERVER_ERROR,
    });
  }
};

/**
 * Add tokens to user balance atomically
 * @param {string} userId - User ID
 * @param {number} tokens - Number of tokens to add
 * @param {string} paymentIntentId - Stripe payment intent ID (for idempotency)
 * @returns {Promise<Object>} Updated balance record
 */
const addTokensToBalance = async (userId, tokens, paymentIntentId) => {
  try {
    // Atomic update: Use payment intent ID to prevent duplicate processing
    // If payment intent was already processed, this will return null
    const updatedBalance = await Balance.findOneAndUpdate(
      {
        user: userId,
        // Ensure this payment hasn't been processed before
        processedPayments: { $ne: paymentIntentId },
      },
      {
        $inc: { tokenCredits: tokens },
        $push: { processedPayments: paymentIntentId },
      },
      {
        new: true, // Return updated document
        upsert: true, // Create if doesn't exist
        setDefaultsOnInsert: true,
      },
    );

    if (!updatedBalance) {
      logger.warn('[BuyTokens] Payment already processed', {
        userId,
        paymentIntentId,
      });
      return null;
    }

    logger.info('[BuyTokens] Tokens added successfully', {
      userId,
      tokensAdded: tokens,
      newBalance: updatedBalance.tokenCredits,
      paymentIntentId,
    });

    return updatedBalance;
  } catch (error) {
    logger.error('[BuyTokens] Failed to add tokens to balance', error);
    throw error;
  }
};

/**
 * Handle Stripe webhook events
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const handleWebhook = async (req, res) => {
  try {
    const signature = req.headers['stripe-signature'];

    if (!signature) {
      logger.error('[BuyTokens] Missing Stripe signature');
      return res.status(400).json({
        success: false,
        error: 'Missing signature',
      });
    }

    // Verify webhook signature
    let event;
    try {
      event = verifyWebhookSignature(req.body, signature);
    } catch (err) {
      logger.error('[BuyTokens] Webhook signature verification failed', err);
      return res.status(400).json({
        success: false,
        error: BUY_TOKENS_ERRORS.WEBHOOK_VERIFICATION_FAILED,
      });
    }

    logger.info('[BuyTokens] Webhook received', {
      eventType: event.type,
      eventId: event.id,
    });

    // Handle payment intent succeeded event
    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object;
      const { userId, packageId, tokens } = paymentIntent.metadata;

      if (!userId || !packageId || !tokens) {
        logger.error('[BuyTokens] Missing metadata in payment intent', {
          paymentIntentId: paymentIntent.id,
        });
        return res.status(400).json({
          success: false,
          error: 'Invalid payment intent metadata',
        });
      }

      const tokensToAdd = parseInt(tokens, 10);

      // Add tokens to user balance atomically
      const updatedBalance = await addTokensToBalance(userId, tokensToAdd, paymentIntent.id);

      if (updatedBalance) {
        // Create transaction record for audit trail
        try {
          await createTransaction({
            user: userId,
            conversationId: null,
            model: 'token-purchase',
            context: 'stripe',
            rawAmount: tokensToAdd,
            tokenType: 'credits',
            rate: paymentIntent.amount / tokensToAdd, // Price per token
            expiresAt: null,
          });

          logger.info('[BuyTokens] Transaction record created', {
            userId,
            paymentIntentId: paymentIntent.id,
            tokensAdded: tokensToAdd,
          });
        } catch (txError) {
          logger.error('[BuyTokens] Failed to create transaction record', txError);
          // Don't fail the webhook if transaction logging fails
        }
      } else {
        logger.info('[BuyTokens] Payment already processed, skipping', {
          userId,
          paymentIntentId: paymentIntent.id,
        });
      }
    } else if (event.type === 'payment_intent.payment_failed') {
      const paymentIntent = event.data.object;
      logger.error('[BuyTokens] Payment failed', {
        paymentIntentId: paymentIntent.id,
        userId: paymentIntent.metadata.userId,
        error: paymentIntent.last_payment_error?.message,
      });
    }

    // Return success to Stripe
    return res.json({ received: true });
  } catch (error) {
    logger.error('[BuyTokens] Error processing webhook', error);
    return res.status(500).json({
      success: false,
      error: BUY_TOKENS_ERRORS.SERVER_ERROR,
    });
  }
};

/**
 * Get available payment methods
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getPaymentMethodsHandler = async (req, res) => {
  try {
    const paymentMethods = await getAvailablePaymentMethods();

    return res.status(200).json({
      success: true,
      paymentMethods,
    });
  } catch (error) {
    logger.error('[BuyTokens] Error getting payment methods', error);
    return res.status(500).json({
      success: false,
      error: BUY_TOKENS_ERRORS.SERVER_ERROR,
    });
  }
};

module.exports = {
  createPaymentIntentHandler,
  handleWebhook,
  getPaymentMethodsHandler,
  addTokensToBalance,
};
