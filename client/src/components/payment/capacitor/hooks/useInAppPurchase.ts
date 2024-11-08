// components/payment/capacitor/hooks/useInAppPurchase.ts
import { useState, useCallback, useEffect } from 'react';

interface IAPTransaction {
  id: string;
  appStoreReceipt: string;
}

interface IAPProduct {
  id: string;
  transaction?: IAPTransaction;
  finish: () => Promise<void>;
}

interface Store {
  CONSUMABLE: string;
  register: (product: { id: string; type: string }) => void;
  when: (target: string) => {
    approved: (callback: (product: IAPProduct) => void) => void;
    error: (callback: (error: Error) => void) => void;
    updated: (callback: (product: IAPProduct) => void) => void;
  };
  refresh: () => Promise<void>;
  get: (productId: string) => IAPProduct | null;
  order: (productId: string) => Promise<void>;
}

declare global {
  interface Window {
    store?: Store;
  }
}

interface UseInAppPurchaseConfig {
  onSuccess: (paymentId?: string) => void;
  onError: (error: string) => void;
}

interface PurchaseRequest {
  priceId: string;
  tokens: number;
  amount: number;
}

const getAppleProductId = (priceId: string): string => {
  // Map your Stripe price IDs to Apple product IDs
  const productMapping: Record<string, string> = {
    price_1P6dqBHKD0byXXClWuA2RGY2: 'io.novlisky.twa.100k.tokens',
    price_1P6dqdHKD0byXXClcboa06Tu: 'io.novlisky.twa.500k.tokens',
    price_1P6drEHKD0byXXClOjmSkPKm: 'io.novlisky.twa.1m.tokens',
    price_1P6drxHKD0byXXClVVLokkLh: 'io.novlisky.twa.10m.tokens',
  };

  return productMapping[priceId] || '';
};

export const useInAppPurchase = ({ onSuccess, onError }: UseInAppPurchaseConfig) => {
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [store, setStore] = useState<Store | undefined>(undefined);
  const [availableProducts, setAvailableProducts] = useState<IAPProduct[]>([]);

  useEffect(() => {
    if (!window.store) {
      console.warn('Cordova Purchase Plugin not available');
      return;
    }
    setStore(window.store);
  }, []);

  const initialize = useCallback(async () => {
    if (!store || initialized) return;

    try {
      setLoading(true);

      // Register all products
      Object.values(getAppleProductId).forEach((productId) => {
        store.register({
          id: productId,
          type: store.CONSUMABLE,
        });
      });

      // Setup purchase handling
      store.when('product').approved(async (product: IAPProduct) => {
        try {
          if (!product.transaction) {
            throw new Error('No transaction data available');
          }

          // Verify the purchase with your backend
          const response = await fetch('/api/payment/inapp/confirm', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              transactionId: product.transaction.id,
              receipt: product.transaction.appStoreReceipt,
              productId: product.id,
            }),
            credentials: 'include',
          });

          if (!response.ok) {
            throw new Error('Failed to verify purchase');
          }

          // Finish the transaction
          await product.finish();

          onSuccess(product.transaction.id);
        } catch (error) {
          onError(error instanceof Error ? error.message : 'Purchase verification failed');
        }
      });

      store.when('product').updated((product: IAPProduct) => {
        setAvailableProducts((prev) => {
          const exists = prev.find((p) => p.id === product.id);
          if (exists) {
            return prev.map((p) => (p.id === product.id ? product : p));
          }
          return [...prev, product];
        });
      });

      store.when('product').error((error: Error) => {
        onError(error.message);
      });

      // Initialize the store
      await store.refresh();

      setInitialized(true);
    } catch (error) {
      onError(error instanceof Error ? error.message : 'Failed to initialize store');
    } finally {
      setLoading(false);
    }
  }, [store, initialized, onSuccess, onError]);

  const purchase = useCallback(
    async ({ priceId, tokens, amount }: PurchaseRequest) => {
      if (!store) {
        onError('In-app purchases not available');
        return;
      }

      try {
        setLoading(true);

        if (!initialized) {
          await initialize();
        }

        // Create purchase record on backend
        const createResponse = await fetch('/api/payment/inapp/create-purchase', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            priceId,
            tokens,
            amount,
          }),
          credentials: 'include',
        });

        if (!createResponse.ok) {
          throw new Error('Failed to create purchase');
        }

        const appleProductId = getAppleProductId(priceId);
        if (!appleProductId) {
          throw new Error('Invalid product configuration');
        }

        // Get the product
        const product = store.get(appleProductId);
        if (!product) {
          throw new Error('Product not available');
        }

        // Order the product
        await store.order(appleProductId);
      } catch (error) {
        onError(error instanceof Error ? error.message : 'Purchase failed');
      } finally {
        setLoading(false);
      }
    },
    [store, initialized, initialize, onError],
  );

  return {
    loading,
    initialized,
    purchase,
    initialize,
    availableProducts,
  };
};
