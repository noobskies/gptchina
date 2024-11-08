import { useState, useEffect, useCallback } from 'react';
import { Store } from 'cordova-plugin-purchase';
import { Capacitor } from '@capacitor/core';
import { TokenPackage } from '../../constants/tokenOptions';

export const useInAppPurchase = () => {
  const [store] = useState(() => new Store());
  const [products, setProducts] = useState<TokenPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [purchasing, setPurchasing] = useState(false);
  const [initialized, setInitialized] = useState(false);

  const initialize = useCallback(async () => {
    if (initialized) return;

    try {
      const platform = Capacitor.getPlatform();
      const productIds = ['tokens_100k', 'tokens_500k', 'tokens_1m', 'tokens_10m'];

      productIds.forEach((id) => {
        store.register({
          id,
          type: store.CONSUMABLE,
          platform: platform === 'android' ? 'android' : 'ios',
        });
      });

      // Setup listeners
      store.when('product').approved(async (product) => {
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

      store.when('product').owned((product) => {
        product.finish();
      });

      store.error((err) => {
        console.error('Store error:', err);
        setError(err.message || 'Purchase failed');
      });

      await store.ready();
      setInitialized(true);
      await store.update();
    } catch (error) {
      console.error('Failed to initialize store:', error);
      setError(error instanceof Error ? error.message : 'Failed to initialize store');
    }
  }, [store, initialized]);

  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      if (!initialized) {
        await initialize();
      }
      const storeProducts = store.products.filter((p) => p.valid);

      // Map store products to your TokenPackage format
      const mappedProducts = storeProducts.map((product) => ({
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
  }, [store, initialized, initialize]);

  const purchaseProduct = useCallback(
    async (productId: string) => {
      try {
        setPurchasing(true);
        setError(null);
        if (!initialized) {
          await initialize();
        }

        const product = store.get(productId);
        if (!product) {
          throw new Error(`Product ${productId} not found`);
        }
        return await product.order();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Purchase failed');
        throw err;
      } finally {
        setPurchasing(false);
      }
    },
    [store, initialized, initialize],
  );

  const restorePurchases = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      if (!initialized) {
        await initialize();
      }
      return store.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to restore purchases');
    } finally {
      setLoading(false);
    }
  }, [store, initialized, initialize]);

  useEffect(() => {
    const platform = Capacitor.getPlatform();
    if (platform === 'android' || platform === 'ios') {
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
