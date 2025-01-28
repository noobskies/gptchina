// src/components/payment/opennode/hooks/useOpenNodePayment.ts
import { useState } from 'react';
import { useAuthContext } from '~/hooks';

interface UseOpenNodePaymentProps {
  amount: number;
  priceId: string;
  onSuccess: () => void;
  onError: (error: string) => void;
}

interface OpenNodeCharge {
  id: string;
  amount: number;
  lightning_invoice: string;
  chain_invoice: string;
  status: string;
  success_url: string;
  order_id: string;
  callback_url: string;
}

export const useOpenNodePayment = ({
  amount,
  priceId,
  onSuccess,
  onError,
}: UseOpenNodePaymentProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [charge, setCharge] = useState<OpenNodeCharge | null>(null);
  const { token } = useAuthContext();

  const createCharge = async () => {
    if (!token) return;

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
          success_url: `${window.location.origin}/payment/success`,
          callback_url: `${window.location.origin}/api/payment/opennode/webhook`,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create charge');
      }

      const chargeData = await response.json();
      setCharge(chargeData);
      return chargeData;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create charge';
      setError(errorMessage);
      onError(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const checkChargeStatus = async (chargeId: string) => {
    if (!token) return;

    try {
      const response = await fetch(`/api/payment/opennode/check-status/${chargeId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to check charge status');
      }

      const { status } = await response.json();

      if (status === 'paid') {
        onSuccess();
      }

      return status;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to check status';
      setError(errorMessage);
      onError(errorMessage);
    }
  };

  const startPaymentPolling = (chargeId: string) => {
    const pollInterval = setInterval(async () => {
      const status = await checkChargeStatus(chargeId);
      if (status === 'paid' || status === 'expired') {
        clearInterval(pollInterval);
      }
    }, 3000);

    // Clean up interval after 1 hour (maximum payment window)
    setTimeout(() => clearInterval(pollInterval), 60 * 60 * 1000);

    return () => clearInterval(pollInterval);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const chargeData = await createCharge();
    if (chargeData) {
      startPaymentPolling(chargeData.id);
    }
  };

  return {
    handleSubmit,
    isProcessing,
    error,
    charge,
    createCharge,
    checkChargeStatus,
  };
};
