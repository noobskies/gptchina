/**
 * CUSTOM: gptchina fork
 *
 * Feature: Buy Tokens (Stripe Integration)
 * Created: 2025-11-09
 * Upstream Impact: None (standalone module)
 *
 * Stripe payment form component with CardElement integration.
 */

import React, { useState } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';

interface PaymentFormProps {
  clientSecret: string;
  amount: number;
  onSuccess: () => void;
  onError: (error: string) => void;
  onCancel: () => void;
}

export const PaymentForm: React.FC<PaymentFormProps> = ({
  clientSecret,
  amount,
  onSuccess,
  onError,
  onCancel,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardComplete, setCardComplete] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    try {
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        throw new Error('Card element not found');
      }

      const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
        },
      });

      if (confirmError) {
        throw new Error(confirmError.message);
      }

      if (paymentIntent?.status === 'succeeded') {
        onSuccess();
      } else {
        throw new Error('Payment was not successful');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Payment failed';
      onError(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="rounded-lg border border-border-medium p-4">
        <label className="mb-2 block text-sm font-medium text-text-primary">Card Information</label>
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: 'var(--text-primary)',
                '::placeholder': {
                  color: 'var(--text-secondary)',
                },
              },
              invalid: {
                color: '#ef4444',
              },
            },
            hidePostalCode: false,
          }}
          onChange={(e) => setCardComplete(e.complete)}
        />
      </div>

      <div className="rounded-lg bg-surface-secondary p-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-text-secondary">Amount to pay:</span>
          <span className="text-lg font-bold text-text-primary">¥{(amount / 100).toFixed(2)}</span>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onCancel}
          disabled={isProcessing}
          className="flex-1 rounded-lg border border-border-medium px-4 py-2 text-sm font-medium text-text-primary hover:bg-surface-hover disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!stripe || !cardComplete || isProcessing}
          className="flex-1 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
        >
          {isProcessing ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Processing...
            </span>
          ) : (
            `Pay ¥${(amount / 100).toFixed(2)}`
          )}
        </button>
      </div>

      <div className="text-xs text-text-secondary">
        <p>Secured by Stripe. Your payment information is encrypted and secure.</p>
      </div>
    </form>
  );
};
