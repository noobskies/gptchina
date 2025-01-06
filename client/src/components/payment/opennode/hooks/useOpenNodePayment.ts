import { useState, useCallback } from 'react';
import { useAuthContext } from '~/hooks';
import type { OpenNodeCharge, CreateChargeParams, OpenNodeChargeStatus } from '../types';

interface UseOpenNodePaymentResult {
  charge: OpenNodeCharge | null;
  isLoading: boolean;
  error: string | null;
  createCharge: (params: CreateChargeParams) => Promise<void>;
  checkChargeStatus: (chargeId: string) => Promise<OpenNodeChargeStatus>;
}

export const useOpenNodePayment = (): UseOpenNodePaymentResult => {
  const [charge, setCharge] = useState<OpenNodeCharge | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuthContext();

  const createCharge = useCallback(
    async (params: CreateChargeParams) => {
      if (!token) {
        setError('Authentication required');
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/payment/opennode/create-charge', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(params),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to create charge');
        }

        const chargeData = await response.json();
        setCharge(chargeData);
      } catch (err) {
        console.error('Error creating OpenNode charge:', err);
        setError(err instanceof Error ? err.message : 'Failed to create charge');
      } finally {
        setIsLoading(false);
      }
    },
    [token],
  );

  const checkChargeStatus = useCallback(
    async (chargeId: string): Promise<OpenNodeChargeStatus> => {
      if (!token) {
        throw new Error('Authentication required');
      }

      try {
        const response = await fetch(`/api/payment/opennode/charge-info/${chargeId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to check charge status');
        }

        const chargeData: OpenNodeCharge = await response.json();

        // Update local charge state if it matches our current charge
        if (charge?.id === chargeId) {
          setCharge(chargeData);
        }

        return chargeData.status;
      } catch (err) {
        console.error('Error checking charge status:', err);
        throw err;
      }
    },
    [token, charge],
  );

  // Helper function to handle webhook updates
  const handleWebhookUpdate = useCallback(
    (webhookData: any) => {
      if (webhookData.id === charge?.id) {
        setCharge((prev) => {
          if (!prev || prev.id !== webhookData.id) return prev;
          return {
            ...prev,
            status: webhookData.status,
          };
        });
      }
    },
    [charge],
  );

  // Subscribe to WebSocket updates when available
  useEffect(() => {
    if (!charge) return;

    const ws = new WebSocket(process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3000');

    ws.onopen = () => {
      ws.send(
        JSON.stringify({
          type: 'subscribe',
          chargeId: charge.id,
        }),
      );
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'payment_update') {
          handleWebhookUpdate(data.payload);
        }
      } catch (err) {
        console.error('Error processing WebSocket message:', err);
      }
    };

    return () => {
      ws.close();
    };
  }, [charge, handleWebhookUpdate]);

  return {
    charge,
    isLoading,
    error,
    createCharge,
    checkChargeStatus,
  };
};

// Optional: Export types for convenience
export type { OpenNodeCharge, CreateChargeParams, OpenNodeChargeStatus } from '../types';
