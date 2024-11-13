import { useState, useEffect, useCallback } from 'react';
import { Capacitor } from '@capacitor/core';
import { useQueryClient } from '@tanstack/react-query';
import 'cordova-plugin-purchase/www/store';

declare const CdvPurchase: any;

export const useInAppPurchase = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [purchasing, setPurchasing] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const queryClient = useQueryClient();

  const initialize = useCallback(async () => {
    if (initialized || !Capacitor.isNativePlatform()) return;

    try {
      const store = CdvPurchase.store;
      store.verbosity = CdvPurchase.LogLevel.DEBUG;

      const productIds = ['tokens_100k', 'tokens_500k', 'tokens_1m', 'tokens_10m'];

      productIds.forEach((id) => {
        store.register({
          id,
          type: CdvPurchase.ProductType.CONSUMABLE,
          platform: CdvPurchase.Platform.GOOGLE_PLAY,
        });
      });

      store.when('product').approved(async (product: any) => {
        try {
          console.log('Product approved:', product);
          const validationResult = await product.verify();

          if (validationResult.verified) {
            console.log('Purchase verified, calling backend...');

            const confirmResponse = await fetch('/api/inapp/confirm', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                productId: product.id,
                transactionId: product.transaction.id,
                receipt: product.transaction.receipt,
              }),
            });

            if (!confirmResponse.ok) {
              throw new Error('Failed to confirm purchase with server');
            }

            // Finish the purchase with store
            await product.finish();

            // Refresh balance
            await queryClient.invalidateQueries(['balance']);
          }
        } catch (err) {
          console.error('Purchase verification failed:', err);
          throw err;
        }
      });

      store.when('product').finished((product: any) => {
        console.log('Purchase finished:', product);
      });

      store.error((err: any) => {
        console.error('Store Error', JSON.stringify(err));
        setError(err.message || 'Purchase failed');
      });

      await store.initialize();
      await store.update();

      setInitialized(true);
      setLoading(false);
    } catch (error) {
      console.error('Failed to initialize store:', error);
      setError(error instanceof Error ? error.message : 'Failed to initialize store');
      setLoading(false);
    }
  }, [initialized, queryClient]);

  const purchaseProduct = useCallback(async (productId: string) => {
    if (!Capacitor.isNativePlatform()) return;

    try {
      setPurchasing(true);
      setError(null);

      const store = CdvPurchase.store;
      console.log('Getting product:', productId);

      const product = store.get(productId);
      console.log('Found product:', product);

      if (!product) {
        throw new Error(`Product ${productId} not found`);
      }

      console.log('Getting offer...');
      const offer = product.getOffer();
      console.log('Got offer:', offer);

      if (!offer) {
        throw new Error(`No offer found for ${productId}`);
      }

      console.log('Ordering product...');
      await store.order(offer);
    } catch (err) {
      console.error('Purchase error:', err);
      setError(err instanceof Error ? err.message : 'Purchase failed');
      throw err;
    } finally {
      setPurchasing(false);
    }
  }, []);

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
