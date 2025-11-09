/**
 * CUSTOM: gptchina fork
 *
 * Feature: Buy Tokens (Stripe Integration)
 * Created: 2025-11-09
 * Updated: 2025-11-09 - Refactored, following claim-tokens pattern
 * Upstream Impact: None (standalone module)
 *
 * Constants for configuration and errors (CommonJS for backend).
 *
 * NOTE: TOKEN_PACKAGES must be kept in sync with types.ts.
 * types.ts is the source of truth (used by frontend).
 * This file exports for backend use (CommonJS compatibility).
 * TODO: Add validation test to ensure both files match.
 */

/**
 * Token package definitions (must match types.ts)
 * All prices in cents (CNY)
 */
const TOKEN_PACKAGES = [
  {
    id: 'package_100k',
    tokens: 100000,
    price: 1000, // ¥10.00
    originalPrice: null,
    discount: null,
    popular: false,
    label: '100K Tokens',
  },
  {
    id: 'package_500k',
    tokens: 500000,
    price: 3500, // ¥35.00
    originalPrice: 5000, // ¥50.00
    discount: 30,
    popular: true,
    label: '500K Tokens',
  },
  {
    id: 'package_1m',
    tokens: 1000000,
    price: 5500, // ¥55.00
    originalPrice: 10000, // ¥100.00
    discount: 45,
    popular: false,
    label: '1M Tokens',
  },
  {
    id: 'package_10m',
    tokens: 10000000,
    price: 28000, // ¥280.00
    originalPrice: 100000, // ¥1000.00
    discount: 72,
    popular: false,
    label: '10M Tokens',
  },
];

/**
 * Payment method configuration
 */
const PAYMENT_METHODS = {
  CARD: 'card',
  WECHAT: 'wechat',
  ALIPAY: 'alipay',
  BITCOIN: 'bitcoin',
  GOOGLE_PAY: 'google',
  APPLE_PAY: 'apple',
};

/**
 * Stripe configuration
 */
const STRIPE_CONFIG = {
  CURRENCY: 'cny',
  PAYMENT_METHODS: Object.values(PAYMENT_METHODS),
  WEBHOOK_EVENTS: [
    'payment_intent.succeeded',
    'payment_intent.payment_failed',
    'charge.succeeded',
    'charge.failed',
  ],
};

/**
 * Error messages
 */
const BUY_TOKENS_ERRORS = {
  INVALID_PACKAGE: 'Invalid token package selected',
  INVALID_PAYMENT_METHOD: 'Invalid payment method',
  PAYMENT_FAILED: 'Payment processing failed',
  ALREADY_PROCESSED: 'Payment already processed',
  UNAUTHORIZED: 'Authentication required',
  SERVER_ERROR: 'Internal server error',
  WEBHOOK_VERIFICATION_FAILED: 'Webhook signature verification failed',
};

module.exports = {
  TOKEN_PACKAGES,
  PAYMENT_METHODS,
  STRIPE_CONFIG,
  BUY_TOKENS_ERRORS,
};
