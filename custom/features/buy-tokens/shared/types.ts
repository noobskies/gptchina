/**
 * CUSTOM: gptchina fork
 *
 * Feature: Buy Tokens (Stripe Integration)
 * Created: 2025-11-09
 * Updated: 2025-11-09 - Added payment method types, single source of truth for TOKEN_PACKAGES
 * Upstream Impact: None (standalone module)
 *
 * Shared TypeScript types and data for the Buy Tokens feature.
 * This is the SINGLE SOURCE OF TRUTH for TOKEN_PACKAGES.
 * Backend imports this file using require('../shared/types').
 */

export interface TokenPackage {
  id: string;
  tokens: number;
  price: number;
  originalPrice: number | null;
  discount: number | null;
  popular: boolean;
  label: string;
}

/**
 * Payment method types supported by Stripe
 */
export type PaymentMethodType = 'card' | 'wechat' | 'alipay' | 'bitcoin' | 'google' | 'apple';

export const PAYMENT_METHODS = {
  CARD: 'card' as const,
  WECHAT: 'wechat' as const,
  ALIPAY: 'alipay' as const,
  BITCOIN: 'bitcoin' as const,
  GOOGLE_PAY: 'google' as const,
  APPLE_PAY: 'apple' as const,
};

/**
 * Token package definitions
 * All prices in cents (CNY)
 */
export const TOKEN_PACKAGES: TokenPackage[] = [
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

export interface CreatePaymentIntentResponse {
  success: boolean;
  clientSecret?: string;
  amount?: number;
  currency?: string;
  paymentIntentId?: string;
  error?: string;
}

export interface PaymentIntentMetadata {
  userId: string;
  packageId: string;
  tokens: string;
}

export interface WebhookEvent {
  id: string;
  type: string;
  data: {
    object: {
      id: string;
      amount: number;
      currency: string;
      metadata: PaymentIntentMetadata;
      status: string;
    };
  };
}
