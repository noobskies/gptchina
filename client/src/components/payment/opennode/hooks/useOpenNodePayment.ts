// hooks/useOpenNodePayment.ts
import { useState } from 'react';
import { useAuthContext } from '~/hooks';

interface UseOpenNodePaymentProps {
  amount: number;
  priceId: string;
  onSuccess: () => void;
  onError: (error: string) => void;
}

export const useOpenNodePayment = ({
  amount,
  priceId,
  onSuccess,
  onError,
}: UseOpenNodePaymentProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuthContext();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const response = await fetch('/api/payment/opennode/create-charge', {
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

      const { hosted_checkout_url } = await response.json();

      // Redirect to OpenNode's hosted checkout
      window.location.href = hosted_checkout_url;

      onSuccess();
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
