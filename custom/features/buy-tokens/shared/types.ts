/**
 * CUSTOM: gptchina fork
 *
 * Feature: Buy Tokens (Stripe Integration)
 * Created: 2025-11-09
 * Upstream Impact: None (standalone module)
 *
 * TypeScript type definitions.
 */

export interface TokenPackage {
  id: string;
  tokens: number;
  price: number; // Price in cents (CNY)
  originalPrice: number | null;
  discount: number | null;
  popular: boolean;
  label: string;
}

export type PaymentMethod = 'card' | 'bitcoin' | 'google_pay' | 'apple_pay';

export interface CreatePaymentIntentRequest {
  packageId: string;
  paymentMethod?: PaymentMethod;
}

export interface CreatePaymentIntentResponse {
  success: boolean;
  clientSecret?: string;
  amount?: number;
  currency?: string;
  error?: string;
}

export interface PurchaseTokensResponse {
  success: boolean;
  balance?: number;
  tokensAdded?: number;
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

export enum PaymentStatus {
  IDLE = 'idle',
  SELECTING_PACKAGE = 'selecting_package',
  SELECTING_PAYMENT = 'selecting_payment',
  PROCESSING = 'processing',
  SUCCESS = 'success',
  ERROR = 'error',
}
