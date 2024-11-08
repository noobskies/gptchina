import React, { createContext, useContext, ReactNode } from 'react';
import { useInAppPurchase } from './hooks/useInAppPurchase';
import { TokenPackage } from '../constants/tokenOptions';

interface InAppPurchaseContextType {
  products: TokenPackage[];
  loading: boolean;
  error: string | null;
  purchasing: boolean;
  purchaseProduct: (productId: string) => Promise<void>;
  restorePurchases: () => Promise<void>;
  refreshProducts: () => Promise<void>;
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

  const handlePurchase = async (productId: string) => {
    try {
      await inAppPurchase.purchaseProduct(productId);
      onSuccess?.();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Purchase failed';
      onError?.(errorMessage);
    }
  };

  const value = {
    ...inAppPurchase,
    purchaseProduct: handlePurchase,
  };

  return <InAppPurchaseContext.Provider value={value}>{children}</InAppPurchaseContext.Provider>;
};
