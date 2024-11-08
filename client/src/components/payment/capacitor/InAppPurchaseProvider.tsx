// components/payment/capacitor/InAppPurchaseProvider.tsx

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useInAppPurchase } from './hooks/useInAppPurchase';

interface InAppPurchaseContextType {
  loading: boolean;
  initialized: boolean;
  purchase: (params: { priceId: string; tokens: number; amount: number }) => Promise<void>;
  error: string | null;
}

const InAppPurchaseContext = createContext<InAppPurchaseContextType | undefined>(undefined);

export const useInAppPurchaseContext = () => {
  const context = useContext(InAppPurchaseContext);
  if (!context) {
    throw new Error('useInAppPurchaseContext must be used within InAppPurchaseProvider');
  }
  return context;
};

interface InAppPurchaseProviderProps {
  children: React.ReactNode;
  onSuccess?: (paymentId?: string) => void;
  onError?: (error: string) => void;
}

export function InAppPurchaseProvider({
  children,
  onSuccess = () => {},
  onError = () => {},
}: InAppPurchaseProviderProps) {
  const [error, setError] = useState<string | null>(null);

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
    onError(errorMessage);
  };

  const { loading, initialized, purchase, initialize } = useInAppPurchase({
    onSuccess,
    onError: handleError,
  });

  useEffect(() => {
    initialize().catch(handleError);
  }, [initialize]);

  const value = {
    loading,
    initialized,
    purchase,
    error,
  };

  return <InAppPurchaseContext.Provider value={value}>{children}</InAppPurchaseContext.Provider>;
}
