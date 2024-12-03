import React, { createContext, useEffect, useState } from 'react';
import { Purchases, PurchasesConfiguration } from '@revenuecat/purchases-capacitor';
import { useAuthContext } from '~/hooks';
import { Spinner } from '~/components/svg';
import { Capacitor } from '@capacitor/core';

interface InAppPurchaseContextValue {
  isInitialized: boolean;
  error: string | null;
}

export const InAppPurchaseContext = createContext<InAppPurchaseContextValue | undefined>(undefined);

interface InAppPurchaseProviderProps {
  children: React.ReactNode;
  onError?: (message: string) => void;
}

export function InAppPurchaseProvider({ children, onError }: InAppPurchaseProviderProps) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, isAuthenticated } = useAuthContext();

  useEffect(() => {
    let mounted = true;

    const initializePurchases = async () => {
      console.log('Initializing RevenueCat...', {
        user,
        isAuthenticated,
        platform: Capacitor.getPlatform(),
      });

      try {
        const platform = Capacitor.getPlatform();
        const apiKey =
          platform === 'ios'
            ? 'appl_vuZAeLssHCVGtsEstmTrYnWKEey'
            : 'goog_PRNqHNeHMCYERXtfbPLhprIEoKd';

        const configuration: PurchasesConfiguration = {
          apiKey,
          observerMode: false,
        };

        await Purchases.configure(configuration);
        console.log('RevenueCat configured with platform:', platform);

        if (user?.id) {
          await Purchases.logIn({ appUserID: user.id });
          console.log('User logged in to RevenueCat');
        }

        if (mounted) {
          setIsInitialized(true);
        }
      } catch (err) {
        console.error('Failed to initialize RevenueCat:', err);
        if (mounted) {
          const errorMessage =
            err instanceof Error ? err.message : 'Failed to initialize payment system';
          setError(errorMessage);
          if (onError) onError(errorMessage);
        }
      }
    };

    if (isAuthenticated && user?.id) {
      initializePurchases();
    } else {
      setError('Authentication required to process payment');
    }

    return () => {
      mounted = false;
    };
  }, [user?.id, isAuthenticated, onError]);

  if (!isAuthenticated || !user?.id) {
    return <div className="text-red-500">Please log in to make a purchase</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!isInitialized) {
    return (
      <div className="flex flex-col items-center p-6">
        <Spinner className="mb-4 h-8 w-8 text-blue-600 dark:text-blue-400" />
        <p className="text-sm text-gray-600 dark:text-gray-400">Initializing payment system...</p>
      </div>
    );
  }

  return (
    <InAppPurchaseContext.Provider value={{ isInitialized, error }}>
      {children}
    </InAppPurchaseContext.Provider>
  );
}
