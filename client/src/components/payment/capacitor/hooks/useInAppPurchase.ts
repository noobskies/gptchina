import { useState, useEffect, useCallback } from 'react';
import { Capacitor } from '@capacitor/core';
import 'cordova-plugin-purchase/www/store';

// Get access to the global CdvPurchase object
declare const CdvPurchase: any;

// Map of our product IDs
const PRODUCT_IDS = {
  tokens_100k: {
    tokens: 100000,
    amount: 1.5,
  },
  tokens_500k: {
    tokens: 500000,
    amount: 5.0,
  },
  tokens_1m: {
    tokens: 1000000,
    amount: 7.5,
  },
  tokens_10m: {
    tokens: 10000000,
    amount: 40.0,
  },
} as const;

export const useInAppPurchase = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [purchasing, setPurchasing] = useState(false);
  const [initialized, setInitialized] = useState(false);

  const initialize = useCallback(async () => {
    if (initialized || !Capacitor.isNativePlatform()) return;

    try {
      const store = CdvPurchase.store;
      store.verbosity = CdvPurchase.LogLevel.DEBUG;

      // Register products with Google Play IDs
      Object.keys(PRODUCT_IDS).forEach((id) => {
        store.register({
          id,
          type: CdvPurchase.ProductType.CONSUMABLE,
          platform: CdvPurchase.Platform.GOOGLE_PLAY,
        });
      });

      // Setup success handler
      store.when('product').approved(async (product: any) => {
        try {
          const validationResult = await product.verify();
          if (validationResult.verified) {
            await product.finish();
          }
        } catch (err) {
          console.error('Purchase verification failed:', err);
          throw err;
        }
      });

      store.error((err: any) => {
        console.error('Store Error', JSON.stringify(err));
        setError(err.message || 'Purchase failed');
      });

      await store.initialize();
      await store.update();

      setInitialized(true);
    } catch (error) {
      console.error('Failed to initialize store:', error);
      setError(error instanceof Error ? error.message : 'Failed to initialize store');
    } finally {
      setLoading(false);
    }
  }, [initialized]);

  const purchaseProduct = useCallback(
    async (productId: string) => {
      if (!Capacitor.isNativePlatform()) return;

      try {
        setPurchasing(true);
        setError(null);

        if (!initialized) {
          await initialize();
        }

        const store = CdvPurchase.store;
        const offer = store.get(productId)?.getOffer();

        if (!offer) {
          throw new Error(`Product ${productId} not found`);
        }

        await store.order(offer);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Purchase failed');
        throw err;
      } finally {
        setPurchasing(false);
      }
    },
    [initialized, initialize],
  );

  const restorePurchases = useCallback(async () => {
    if (!Capacitor.isNativePlatform()) return;

    try {
      setLoading(true);
      setError(null);

      const store = CdvPurchase.store;
      await store.restorePurchases();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to restore purchases');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      initialize();
    }
  }, [initialize]);

  return {
    loading,
    error,
    purchasing,
    purchaseProduct,
    restorePurchases,
  };
};
