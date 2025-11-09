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
 * Handle Stripe webhook events
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const handleWebhook = async (req, res) => {
  // DEBUG: Log webhook entry
  logger.info('[BuyTokens Webhook] ===== WEBHOOK RECEIVED =====');
  logger.info('[BuyTokens Webhook] Headers:', {
    signature: req.headers['stripe-signature'] ? 'present' : 'missing',
    contentType: req.headers['content-type'],
    contentLength: req.headers['content-length'],
  });
  logger.info(
    '[BuyTokens Webhook] Body type:',
    typeof req.body,
    '| Is Buffer:',
    Buffer.isBuffer(req.body),
  );

  try {
    const signature = req.headers['stripe-signature'];

    if (!signature) {
      logger.error('[BuyTokens Webhook] ❌ Missing Stripe signature');
      return res.status(400).json({
        success: false,
        error: 'Missing signature',
      });
    }

    // Verify webhook signature
    logger.info('[BuyTokens Webhook] Attempting signature verification...');
    let event;
    try {
      event = verifyWebhookSignature(req.body, signature);
      logger.info('[BuyTokens Webhook] ✅ Signature verified successfully');
    } catch (err) {
      logger.error('[BuyTokens Webhook] ❌ Signature verification FAILED:', err.message);
      return res.status(400).json({
        success: false,
        error: BUY_TOKENS_ERRORS.WEBHOOK_VERIFICATION_FAILED,
      });
    }

    logger.info('[BuyTokens Webhook] Event details:', {
      eventType: event.type,
      eventId: event.id,
      livemode: event.livemode,
    });

    // Handle payment intent succeeded event
    if (event.type === 'payment_intent.succeeded') {
      logger.info('[BuyTokens Webhook] Processing payment_intent.succeeded event');
      const paymentIntent = event.data.object;
      const { userId, packageId, tokens } = paymentIntent.metadata;

      logger.info('[BuyTokens Webhook] Payment metadata:', {
        userId,
        packageId,
        tokens,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
        paymentIntentId: paymentIntent.id,
      });

      if (!userId || !packageId || !tokens) {
        logger.error('[BuyTokens Webhook] ❌ Missing metadata', {
          paymentIntentId: paymentIntent.id,
          metadata: paymentIntent.metadata,
        });
        return res.status(400).json({
          success: false,
          error: 'Invalid payment intent metadata',
        });
      }

      const tokensToAdd = parseInt(tokens, 10);
      logger.info('[BuyTokens Webhook] Starting MongoDB transaction...', { userId, tokensToAdd });

      // Use MongoDB transaction for atomic operation
      const mongoose = require('mongoose');
      const session = await mongoose.startSession();
      session.startTransaction();

      try {
        // Add tokens to user balance (with session)
        const updatedBalance = await Balance.findOneAndUpdate(
          {
            user: userId,
            processedPayments: { $ne: paymentIntent.id },
          },
          {
            $inc: { tokenCredits: tokensToAdd },
            $push: { processedPayments: paymentIntent.id },
          },
          {
            new: true,
            upsert: true,
            setDefaultsOnInsert: true,
            session,
          },
        );

        if (!updatedBalance) {
          // Payment already processed, abort transaction
          await session.abortTransaction();
          logger.warn('[BuyTokens Webhook] ⚠️  Duplicate webhook - payment already processed', {
            userId,
            paymentIntentId: paymentIntent.id,
          });
          return res.json({ received: true });
        }

        logger.info('[BuyTokens Webhook] ✅ Balance updated in MongoDB');

        // Create transaction record (with session)
        await createTransaction(
          {
            user: userId,
            conversationId: null,
            model: 'token-purchase',
            context: 'stripe',
            rawAmount: tokensToAdd,
            tokenType: 'credits',
            rate: paymentIntent.amount / tokensToAdd,
            expiresAt: null,
          },
          { session },
        );

        // Commit both operations atomically
        await session.commitTransaction();

        logger.info('[BuyTokens Webhook] ✅✅✅ PAYMENT PROCESSED SUCCESSFULLY ✅✅✅');
        logger.info('[BuyTokens Webhook] Details:', {
          userId,
          tokensAdded: tokensToAdd,
          newBalance: updatedBalance.tokenCredits,
          paymentIntentId: paymentIntent.id,
        });
      } catch (error) {
        // Rollback on any error
        await session.abortTransaction();
        logger.error(
          '[BuyTokens Webhook] ❌ MongoDB transaction FAILED - rolled back:',
          error.message,
        );
        throw error;
      } finally {
        session.endSession();
        logger.info('[BuyTokens Webhook] MongoDB session closed');
      }
    } else if (event.type === 'payment_intent.payment_failed') {
      const paymentIntent = event.data.object;
      logger.error('[BuyTokens Webhook] ❌ Payment FAILED:', {
        paymentIntentId: paymentIntent.id,
        userId: paymentIntent.metadata.userId,
        error: paymentIntent.last_payment_error?.message,
      });
    } else {
      logger.info('[BuyTokens Webhook] Ignoring event type:', event.type);
    }

    // Return success to Stripe
    logger.info('[BuyTokens Webhook] Returning 200 OK to Stripe');
    return res.json({ received: true });
  } catch (error) {
    logger.error('[BuyTokens Webhook] ❌❌❌ UNHANDLED ERROR ❌❌❌');
    logger.error('[BuyTokens Webhook] Error:', error.message);
    logger.error('[BuyTokens Webhook] Stack:', error.stack);
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
};
