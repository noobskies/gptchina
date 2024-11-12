// components/payment/stripe/StripePaymentProvider.tsx
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { useState, useEffect } from 'react';
import { useAuthContext } from '~/hooks';
import { Spinner } from '~/components/svg';

const stripePromise = loadStripe(
  'pk_live_51MwvEEHKD0byXXCl8IzAvUl0oZ7RE6vIz72lWUVYl5rW3zy0u3FiGtIAgsbmqSHbhkTJeZjs5VEbQMNStaaQL9xQ001pwxI3RP',
);

interface StripePaymentProviderProps {
  children: React.ReactNode;
  amount: number;
  user: any;
  priceId: string;
}

export function StripePaymentProvider({
  children,
  amount,
  user,
  priceId,
}: StripePaymentProviderProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { token, isAuthenticated } = useAuthContext();

  useEffect(() => {
    console.log('StripePaymentProvider mounted', {
      amount,
      user,
      isAuthenticated,
      hasToken: !!token,
      priceId,
    });

    const fetchPaymentIntent = async () => {
      console.log('Fetching payment intent...', { amount, priceId });
      try {
        if (!token) {
          throw new Error('No authentication token available');
        }

        const response = await fetch('/api/payment/stripe/create-intent', {
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

        setClientSecret(data.clientSecret);
      } catch (err) {
        console.error('Error creating payment intent:', err);
        setError(err instanceof Error ? err.message : 'Failed to initialize payment');
      }
    };

    if (isAuthenticated && token && user?._id) {
      fetchPaymentIntent();
    } else {
      console.error('Authentication required', {
        isAuthenticated,
        hasToken: !!token,
        hasUser: !!user?._id,
      });
      setError('Authentication required to process payment');
    }
  }, [amount, user, token, isAuthenticated, priceId]); // Add priceId to dependency array

  const options = {
    clientSecret,
    appearance: {
      theme: 'flat',
      variables: {
        colorPrimary: '#0066ff',
      },
    },
  };

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

  if (!clientSecret) {
    console.log('Rendering loading state');
    return (
      <div className="flex flex-col items-center p-6">
        <Spinner className="mb-4 h-8 w-8 text-blue-600 dark:text-blue-400" />
        <p className="text-sm text-gray-600 dark:text-gray-400">Initializing payment...</p>
      </div>
    );
  }

  console.log('Rendering Stripe Elements with options:', options);
  return (
    <Elements stripe={stripePromise} options={options}>
      {children}
    </Elements>
  );
}
