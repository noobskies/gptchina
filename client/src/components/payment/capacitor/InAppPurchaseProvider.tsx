import React, { createContext, useContext, ReactNode } from 'react';
import { useInAppPurchase } from './hooks/useInAppPurchase';

interface InAppPurchaseContextType {
  loading: boolean;
  error: string | null;
  purchasing: boolean;
  purchaseProduct: (productId: string, onSuccess?: () => void) => Promise<void>;
  restorePurchases: () => Promise<void>;
}

const InAppPurchaseContext = createContext<InAppPurchaseContextType | null>(null);

export const useInAppPurchaseContext = () => {
  const context = useContext(InAppPurchaseContext);
  if (!context) {
    throw new Error('useInAppPurchaseContext must be used within InAppPurchaseProvider');
  }
  return context;
};

interface InAppPurchaseProviderProps {
  children: ReactNode;
  onSuccess?: (paymentIntentId?: string) => void;
  onError?: (error: string) => void;
}

export const InAppPurchaseProvider: React.FC<InAppPurchaseProviderProps> = ({
  children,
  onSuccess,
  onError,
}) => {
  const inAppPurchase = useInAppPurchase();

  const handlePurchase = async (productId: string, successCallback?: () => void) => {
    try {
      await inAppPurchase.purchaseProduct(productId);
      onSuccess?.(); // Global success handler
      successCallback?.(); // Individual success handler
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Purchase failed';
      onError?.(errorMessage);
      throw err; // Re-throw to be handled by the form
    }
  };

  const value = {
    loading: inAppPurchase.loading,
    error: inAppPurchase.error,
    purchasing: inAppPurchase.purchasing,
    purchaseProduct: handlePurchase,
    restorePurchases: inAppPurchase.restorePurchases,
  };

  return <InAppPurchaseContext.Provider value={value}>{children}</InAppPurchaseContext.Provider>;
};
