import React, { createContext, useContext, useState } from 'react';
import { useAuthContext } from '~/hooks';
import { Spinner } from '~/components/svg';

interface OpenNodeContextType {
  createCharge: (params: CreateChargeParams) => Promise<any>;
  isLoading: boolean;
  error: string | null;
}

interface CreateChargeParams {
  amount: number;
  tokens: number;
  success_url: string;
  callback_url: string;
}

const OpenNodeContext = createContext<OpenNodeContextType | undefined>(undefined);

interface OpenNodeProviderProps {
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
}: OpenNodeProviderProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { token, isAuthenticated } = useAuthContext();

  const createCharge = async ({
    amount,
    tokens,
    success_url,
    callback_url,
  }: CreateChargeParams) => {
    setIsLoading(true);
    setError(null);

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
          success_url,
          callback_url,
          tokens,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(JSON.stringify(errorData));
      }

      const data = await response.json();
      setIsLoading(false);
      return data;
    } catch (err) {
      setIsLoading(false);
      const errorMsg = err instanceof Error ? err.message : 'Failed to create charge';
      setError(errorMsg);
      throw new Error(errorMsg);
    }
  };

  if (!isAuthenticated || !token) {
    return <div className="text-red-500">Please log in to make a payment</div>;
  }

  if (error) {
    try {
      const parsedError = JSON.parse(error);
      return <div className="text-red-500">{parsedError.error || error}</div>;
    } catch {
      return <div className="text-red-500">{error}</div>;
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center p-6">
        <Spinner className="mb-4 h-8 w-8 text-blue-600 dark:text-blue-400" />
        <p className="text-sm text-gray-600 dark:text-gray-400">Processing payment...</p>
      </div>
    );
  }

  return (
    <OpenNodeContext.Provider value={{ createCharge, isLoading, error }}>
      {children}
    </OpenNodeContext.Provider>
  );
}

export const useOpenNodeContext = () => {
  const context = useContext(OpenNodeContext);
  if (context === undefined) {
    throw new Error('useOpenNodeContext must be used within an OpenNodePaymentProvider');
  }
  return context;
};
