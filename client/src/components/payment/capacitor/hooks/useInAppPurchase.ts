import { useState, useEffect, useCallback } from 'react';
import { Capacitor } from '@capacitor/core';
import { TokenPackage } from '../../constants/tokenOptions';
import 'cordova-plugin-purchase/www/store';

// Get access to the global CdvPurchase object
declare const CdvPurchase: any;

export const useInAppPurchase = () => {
  const [products, setProducts] = useState<TokenPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [purchasing, setPurchasing] = useState(false);
  const [initialized, setInitialized] = useState(false);

  const initialize = useCallback(async () => {
    if (initialized || !Capacitor.isNativePlatform()) return;

    try {
      const store = CdvPurchase.store;
      // Set debug level
      store.verbosity = CdvPurchase.LogLevel.DEBUG;

      // Register your products
      const productIds = ['tokens_100k', 'tokens_500k', 'tokens_1m', 'tokens_10m'];

      productIds.forEach((id) => {
        store.register({
          id,
          type: CdvPurchase.ProductType.CONSUMABLE,
          platform: CdvPurchase.Platform.GOOGLE_PLAY,
        });
      });

      // Setup error handler
      store.error((err: any) => {
        console.error('Store Error', JSON.stringify(err));
        setError(err.message || 'Purchase failed');
      });

      // Initialize the store
      await store.initialize();
      await store.update();
      await store.restorePurchases();

      setInitialized(true);
    } catch (error) {
      console.error('Failed to initialize store:', error);
      setError(error instanceof Error ? error.message : 'Failed to initialize store');
    }
  }, [initialized]);

  const loadProducts = useCallback(async () => {
    if (!Capacitor.isNativePlatform()) return;

    try {
      setLoading(true);
      setError(null);
      if (!initialized) {
        await initialize();
      }

      const store = CdvPurchase.store;
      const storeProducts = store.products.filter((p: any) => p.valid);

      // Map store products to your TokenPackage format
      const mappedProducts = storeProducts.map((product: any) => ({
        tokens: parseInt(
          product.id.replace('tokens_', '').replace('k', '000').replace('m', '000000'),
        ),
        label: `com_token_package_label_${product.id.split('_')[1]}`,
        price: product.price || '',
        amount: product.price ? parseFloat(product.price.replace(/[^0-9\.]/g, '')) * 100 : 0,
        currency: 'USD',
        priceId: product.id,
        originalPrice: product.price || '',
        discountedPrice: product.price || '',
      }));

      setProducts(mappedProducts);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load products');
    } finally {
      setLoading(false);
    }
  }, [initialized, initialize]);

  const purchaseProduct = useCallback(async (productId: string) => {
    if (!Capacitor.isNativePlatform()) return;

    try {
      setPurchasing(true);
      setError(null);

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
      loadProducts();
    }
  }, [loadProducts]);

  return {
    products,
    loading,
    error,
    purchasing,
    purchaseProduct,
    restorePurchases,
    refreshProducts: loadProducts,
  };
};
