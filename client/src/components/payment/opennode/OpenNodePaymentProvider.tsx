// OpenNodePaymentProvider.tsx
import { useState, useEffect } from 'react';
import { useAuthContext } from '~/hooks';
import { Spinner } from '~/components/svg';

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

    // Validate authentication state
    if (!isAuthenticated || !token || !user?._id) {
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

  return children;
}
