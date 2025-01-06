import { useState, useEffect } from 'react';
import { useAuthContext } from '~/hooks';
import { Spinner } from '~/components/svg';
import { OpenNodeClient } from './utils/openNodeClient';
import type { OpenNodeCharge } from './types';

// Initialize OpenNode client
const openNodeClient = new OpenNodeClient({
  apiKey: process.env.NEXT_PUBLIC_OPENNODE_API_KEY || '',
  apiUrl: process.env.NEXT_PUBLIC_OPENNODE_API_URL || 'https://api.opennode.com',
  callbackUrl: `${window.location.origin}/api/payment/opennode/webhook`,
  successUrl: `${window.location.origin}/payment/success`,
});

interface OpenNodePaymentProviderProps {
  children: React.ReactNode;
  amount: number;
  user: any;
  priceId: string;
}

export function OpenNodePaymentProvider({
  children,
  amount,
  user,
  priceId,
}: OpenNodePaymentProviderProps) {
  const [charge, setCharge] = useState<OpenNodeCharge | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { token, isAuthenticated } = useAuthContext();

  useEffect(() => {
    console.log('OpenNodePaymentProvider mounted', {
      amount,
      user,
      isAuthenticated,
      hasToken: !!token,
      priceId,
    });

    const createCharge = async () => {
      console.log('Creating OpenNode charge...', { amount, priceId });
      try {
        if (!token) {
          throw new Error('No authentication token available');
        }

        const response = await fetch('/api/payment/opennode/create-charge', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          credentials: 'include',
          body: JSON.stringify({
            amount,
            userId: user._id,
            priceId,
            currency: 'USD', // Or get from your configuration
            description: `Purchase ${amount} tokens`, // Can be customized
          }),
        });

        console.log('API Response status:', response.status);

        if (!response.ok) {
          const errorData = await response.json();
          console.error('API Error:', errorData);
          throw new Error(JSON.stringify(errorData));
        }

        const data = await response.json();
        console.log('API Response data:', data);

        setCharge(data);
      } catch (err) {
        console.error('Error creating charge:', err);
        setError(err instanceof Error ? err.message : 'Failed to initialize payment');
      }
    };

    if (isAuthenticated && token && user?._id) {
      createCharge();
    } else {
      console.error('Authentication required', {
        isAuthenticated,
        hasToken: !!token,
        hasUser: !!user?._id,
      });
      setError('Authentication required to process payment');
    }
  }, [amount, user, token, isAuthenticated, priceId]);

  if (!isAuthenticated || !token) {
    return <div className="text-red-500">Please log in to make a payment</div>;
  }

  if (error) {
    console.error('Rendering error state:', error);
    try {
      const parsedError = JSON.parse(error);
      return <div className="text-red-500">{parsedError.error || error}</div>;
    } catch {
      return <div className="text-red-500">{error}</div>;
    }
  }

  if (!charge) {
    console.log('Rendering loading state');
    return (
      <div className="flex flex-col items-center p-6">
        <Spinner className="mb-4 h-8 w-8 text-blue-600 dark:text-blue-400" />
        <p className="text-sm text-gray-600 dark:text-gray-400">Initializing payment...</p>
      </div>
    );
  }

  console.log('Rendering OpenNode payment form with charge:', charge);
  return (
    <div className="opennode-payment-container">
      {React.Children.map(children, (child) =>
        React.isValidElement(child) ? React.cloneElement(child, { charge } as any) : child,
      )}
    </div>
  );
}
