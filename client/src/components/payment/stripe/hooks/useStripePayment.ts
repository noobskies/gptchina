// src/components/payment/stripe/hooks/useStripePayment.ts
import { useState } from 'react';
import type { Stripe, StripeElements } from '@stripe/stripe-js';

interface UseStripePaymentProps {
  stripe: Stripe | null;
  elements: StripeElements | null;
  amount: number;
  onSuccess: () => void;
  onError: (error: string) => void;
}

export const useStripePayment = ({
  stripe,
  elements,
  amount,
  onSuccess,
  onError,
}: UseStripePaymentProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const { error: stripeError, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment/confirm`,
        },
        redirect: 'if_required',
      });

      if (stripeError) {
        throw new Error(stripeError.message);
      }

      if (paymentIntent.status === 'succeeded') {
        // Send confirmation to your backend
        await fetch('/api/payment/stripe/confirm', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            paymentIntentId: paymentIntent.id,
            amount,
          }),
        });

        onSuccess();
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Payment failed. Please try again.';
      setError(message);
      onError(message);
    } finally {
      setIsProcessing(false);
    }
  };

  return { handleSubmit, isProcessing, error };
};
