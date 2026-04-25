/**
 * CUSTOM: gptchina fork
 *
 * Feature: Buy Tokens (Stripe Integration)
 * Created: 2025-11-09
 * Upstream Impact: None (standalone module)
 *
 * Stripe service wrapper for payment processing.
 */

const Stripe = require('stripe');
const { TOKEN_PACKAGES, STRIPE_CONFIG } = require('../shared/constants');
const { logger } = require('@librechat/data-schemas');

// Initialize Stripe with secret key
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

/**
 * Get token package by ID
 * @param {string} packageId - Package identifier
 * @returns {Object|null} Token package or null if not found
 */
const getPackageById = (packageId) => {
  return TOKEN_PACKAGES.find((pkg) => pkg.id === packageId) || null;
};

/**
 * Create a payment intent for token purchase
 * @param {string} userId - User ID
 * @param {string} packageId - Token package ID
 * @param {string} paymentMethod - Payment method type
 * @returns {Promise<Object>} Payment intent object
 */
const createPaymentIntent = async (userId, packageId, paymentMethod = 'card') => {
  try {
    const tokenPackage = getPackageById(packageId);

    if (!tokenPackage) {
      throw new Error(`Invalid package ID: ${packageId}`);
    }

    // Payment intent configuration
    const paymentIntentConfig = {
      amount: tokenPackage.price,
      currency: STRIPE_CONFIG.CURRENCY,
      metadata: {
        userId,
        packageId,
        tokens: tokenPackage.tokens.toString(),
      },
      description: `Purchase ${tokenPackage.label} for ${userId}`,
    };

    // Configure payment method types based on selection
    switch (paymentMethod) {
      case 'card':
        paymentIntentConfig.payment_method_types = ['card'];
        break;

      case 'wechat':
        paymentIntentConfig.payment_method_types = ['wechat_pay'];
        paymentIntentConfig.payment_method_options = {
          wechat_pay: {
            client: 'web',
          },
        };
        break;

      case 'alipay':
        paymentIntentConfig.payment_method_types = ['alipay'];
        // Alipay uses redirect flow (handled by Stripe)
        break;

      case 'bitcoin':
        // For cryptocurrency payments via Stripe
        paymentIntentConfig.payment_method_types = ['customer_balance'];
        paymentIntentConfig.payment_method_options = {
          customer_balance: {
            funding_type: 'bank_transfer',
            bank_transfer: {
              type: 'eu_bank_transfer',
            },
          },
        };
        break;

      case 'google':
      case 'apple':
        // Google Pay and Apple Pay use the card payment method type
        // They're handled via Payment Request Button API in the frontend
        paymentIntentConfig.payment_method_types = ['card'];
        break;

      default:
        // Default to card if unknown payment method
        paymentIntentConfig.payment_method_types = ['card'];
        logger.warn('[BuyTokens] Unknown payment method, defaulting to card', {
          paymentMethod,
        });
    }

    // Create payment intent with idempotency key
    const idempotencyKey = `${userId}-${packageId}-${Date.now()}`;
    const paymentIntent = await stripe.paymentIntents.create(paymentIntentConfig, {
      idempotencyKey,
    });

    logger.info('[BuyTokens] Payment intent created', {
      userId,
      packageId,
      paymentIntentId: paymentIntent.id,
      amount: tokenPackage.price,
      paymentMethod,
    });

    return paymentIntent;
  } catch (error) {
    logger.error('[BuyTokens] Failed to create payment intent', error);
    throw error;
  }
};

/**
 * Verify webhook signature
 * @param {string} payload - Raw request body
 * @param {string} signature - Stripe signature header
 * @returns {Object} Verified event object
 */
const verifyWebhookSignature = (payload, signature) => {
  try {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret) {
      throw new Error('STRIPE_WEBHOOK_SECRET not configured');
    }

    const event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);

    logger.debug('[BuyTokens] Webhook signature verified', {
      eventType: event.type,
      eventId: event.id,
    });

    return event;
  } catch (error) {
    logger.error('[BuyTokens] Webhook signature verification failed', error);
    throw error;
  }
};

/**
 * Retrieve payment intent by ID
 * @param {string} paymentIntentId - Payment intent ID
 * @returns {Promise<Object>} Payment intent object
 */
const getPaymentIntent = async (paymentIntentId) => {
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    return paymentIntent;
  } catch (error) {
    logger.error('[BuyTokens] Failed to retrieve payment intent', error);
    throw error;
  }
};

/**
 * Get available payment methods for user's region
 * Note: In production, this should check user's country/region
 * @returns {Promise<Array>} Available payment method types
 */
const getAvailablePaymentMethods = async () => {
  // For now, return all configured payment methods
  // In production, this would check user's location and Stripe capabilities
  return STRIPE_CONFIG.PAYMENT_METHODS;
};

module.exports = {
  stripe,
  createPaymentIntent,
  verifyWebhookSignature,
  getPaymentIntent,
  getAvailablePaymentMethods,
  getPackageById,
};
