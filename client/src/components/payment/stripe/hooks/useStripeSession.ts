// src/components/payment/stripe/hooks/useStripeSession.ts
import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { useAuthContext } from '~/hooks';

const stripePromise = loadStripe(
  'pk_live_51MwvEEHKD0byXXCl8IzAvUl0oZ7RE6vIz72lWUVYl5rW3zy0u3FiGtIAgsbmqSHbhkTJeZjs5VEbQMNStaaQL9xQ001pwxI3RP',
);

export const useStripeSession = (amount: number) => {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [stripe, setStripe] = useState<any>(null);
  const [elements, setElements] = useState<any>(null);
  const { token, user } = useAuthContext(); // Add auth context

  useEffect(() => {
    const initializeStripe = async () => {
      console.log('Initializing Stripe session:', { amount, hasToken: !!token });
      try {
        if (!token) {
          throw new Error('Authentication required');
        }

        // Create PaymentIntent on the server
        const response = await fetch('/api/payment/stripe/create-intent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          credentials: 'include',
          body: JSON.stringify({
            amount,
            userId: user?._id,
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Payment intent error:', errorText);
          throw new Error(errorText);
        }

        const data = await response.json();
        console.log('Payment intent created:', data);
        setClientSecret(data.clientSecret);

        // Initialize Stripe
        const stripeInstance = await stripePromise;
        if (stripeInstance) {
          setStripe(stripeInstance);
          const elementsInstance = stripeInstance.elements({ clientSecret: data.clientSecret });
          setElements(elementsInstance);
        }
      } catch (err) {
        console.error('Stripe initialization error:', err);
        setError(err instanceof Error ? err.message : 'Payment initialization failed');
      } finally {
        setIsLoading(false);
      }
    };

    if (token && user?._id) {
      initializeStripe();
    } else {
      setError('Authentication required');
      setIsLoading(false);
    }
  }, [amount, token, user]);

  return { clientSecret, stripe, elements, isLoading, error };
};
