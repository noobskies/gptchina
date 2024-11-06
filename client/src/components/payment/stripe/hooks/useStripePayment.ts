// src/components/payment/stripe/hooks/useStripePayment.ts
import { useState } from 'react';
import type { Stripe, StripeElements } from '@stripe/stripe-js';
import { useAuthContext } from '~/hooks';
interface UseStripePaymentProps {
  stripe: Stripe | null;
  elements: StripeElements | null;
  amount: number;
  priceId: string;
  onSuccess: () => void;
  onError: (error: string) => void;
}

export const useStripePayment = ({
  stripe,
  elements,
  amount,
  priceId,
  onSuccess,
  onError,
}: UseStripePaymentProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuthContext();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements || !token) {
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      console.log('Creating payment intent with:', { amount, priceId });

      const response = await fetch('/api/payment/stripe/create-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount,
          priceId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Payment failed');
      }

      const { clientSecret } = await response.json();

      // Submit the elements form first
      const { error: submitError } = await elements.submit();
      if (submitError) {
        throw new Error(submitError.message || 'Failed to submit payment details');
      }

      // Confirm the payment without redirect
      const result = await stripe.confirmPayment({
        elements,
        clientSecret,
        redirect: 'if_required', // This prevents automatic redirect
        confirmParams: {
          return_url: window.location.href, // Just in case redirect is required
        },
      });

      if (result.error) {
        throw new Error(result.error.message || 'Payment confirmation failed');
      }

      if (result.paymentIntent?.status === 'succeeded') {
        onSuccess();
      } else {
        throw new Error('Payment was not completed successfully');
      }
    } catch (err) {
      console.error('Payment processing error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Payment failed';
      setError(errorMessage);
      onError(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  return { handleSubmit, isProcessing, error };
};
