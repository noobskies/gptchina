/**
 * CUSTOM: gptchina fork
 *
 * Feature: Buy Tokens (Stripe Integration)
 * Created: 2025-11-09
 * Updated: 2025-12-10 - New pricing tiers with clean, transparent pricing
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
 * Updated: 2025-12-10 - New pricing tiers with clean, transparent pricing
 */
export const TOKEN_PACKAGES: TokenPackage[] = [
  {
    id: 'package_250k',
    tokens: 250000,
    price: 1000, // ¥10.00
    originalPrice: null,
    discount: null,
    popular: false,
    label: '250K Tokens',
  },
  {
    id: 'package_2_5m',
    tokens: 2500000,
    price: 5000, // ¥50.00
    originalPrice: null,
    discount: null,
    popular: true,
    label: '2.5M Tokens',
  },
  {
    id: 'package_10m',
    tokens: 10000000,
    price: 15000, // ¥150.00
    originalPrice: null,
    discount: null,
    popular: false,
    label: '10M Tokens',
  },
  {
    id: 'package_20m',
    tokens: 20000000,
    price: 28000, // ¥280.00
    originalPrice: null,
    discount: null,
    popular: false,
    label: '20M Tokens',
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
