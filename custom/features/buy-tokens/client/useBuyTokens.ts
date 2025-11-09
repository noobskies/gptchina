/**
 * CUSTOM: gptchina fork
 *
 * Feature: Buy Tokens (Stripe Integration)
 * Created: 2025-11-09
 * Upstream Impact: None (standalone module)
 *
 * React hook for managing token purchase API calls.
 */

import { useState, useCallback } from 'react';

interface CreatePaymentIntentResponse {
  success: boolean;
  clientSecret?: string;
  amount?: number;
  currency?: string;
  paymentIntentId?: string;
  error?: string;
}

export const useBuyTokens = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null);

  const createPaymentIntent = useCallback(
    async (packageId: string, paymentMethod: string = 'card') => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/custom/stripe/create-payment-intent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ packageId, paymentMethod }),
        });

        const data: CreatePaymentIntentResponse = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.error || 'Failed to create payment intent');
        }

        setClientSecret(data.clientSecret || null);
        setPaymentIntentId(data.paymentIntentId || null);
        return data;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  return {
    isLoading,
    error,
    clientSecret,
    paymentIntentId,
    createPaymentIntent,
    setError,
  };
};
