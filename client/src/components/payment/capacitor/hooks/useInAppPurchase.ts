// capacitor/hooks/useInAppPurchase.ts
import { useState, useContext } from 'react';
import { useAuthContext } from '~/hooks';
import { Purchases } from '@revenuecat/purchases-capacitor';
import { Capacitor } from '@capacitor/core';
import { InAppPurchaseContext } from '../InAppPurchaseProvider';

const PRICE_TO_PACKAGE_MAP: Record<string, string> = {
  price_1P6dqBHKD0byXXClWuA2RGY2: 'tokens_100k',
  price_1P6dqdHKD0byXXClcboa06Tu: 'tokens_500k',
  price_1P6drEHKD0byXXClOjmSkPKm: 'tokens_1m',
  price_1P6drxHKD0byXXClVVLokkLh: 'tokens_10m',
};

interface UseInAppPurchaseProps {
  amount: number;
  priceId: string;
  onSuccess: (paymentIntentId?: string) => void;
  onError: (error: string) => void;
}

export const useInAppPurchase = ({ priceId, onSuccess, onError }: UseInAppPurchaseProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, token } = useAuthContext();
  const context = useContext(InAppPurchaseContext);

  if (!context) {
    throw new Error('useInAppPurchase must be used within an InAppPurchaseProvider');
  }

  const findPackageInOfferings = async () => {
    // Get offerings
    const result = await Purchases.getOfferings();
    console.log('Raw RevenueCat response:', result);

    if (!result?.current?.availablePackages) {
      throw new Error('No available packages found');
    }

    // Get the desired package identifier
    const packageId = PRICE_TO_PACKAGE_MAP[priceId];
    if (!packageId) {
      throw new Error(`No package mapping found for price ID: ${priceId}`);
    }

    console.log('Looking for package:', {
      packageId,
      availablePackages: result.current.availablePackages,
    });

    // Find the package in available packages
    const pkg = result.current.availablePackages.find((p) => p.identifier === packageId);
    if (!pkg) {
      throw new Error(`Package ${packageId} not found in available packages`);
    }

    console.log('Found package:', pkg);
    return pkg;
  };

  const extractTransactionId = (purchaseResult: any): string => {
    console.log('Extracting transaction ID from:', purchaseResult?.transaction);

    // Get the transaction ID specifically from the transaction object
    const transactionId = purchaseResult?.transaction?.transactionIdentifier;

    if (!transactionId) {
      console.error('Purchase result missing transaction ID:', purchaseResult);
      throw new Error('Purchase completed but transaction ID is missing');
    }

    return transactionId;
  };

  const confirmPurchaseWithBackend = async (
    packageId: string,
    productIdentifier: string,
    transactionId: string,
  ) => {
    try {
      console.log('Confirming purchase with backend:', {
        priceId,
        packageId,
        productIdentifier,
        transactionId,
      });

      const response = await fetch('/api/payment/inapp/confirm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          priceId,
          packageId,
          productIdentifier,
          transactionId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Backend error response:', errorData);
        throw new Error(errorData.error || 'Failed to confirm purchase with backend');
      }

      const data = await response.json();
      console.log('Backend confirmation successful:', data);
      return data;
    } catch (err) {
      console.error('Backend confirmation error:', err);
      throw err;
    }
  };

  const handlePayment = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }

    if (!user) {
      const errorMsg = 'User authentication required';
      setError(errorMsg);
      onError(errorMsg);
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const platform = Capacitor.getPlatform();
      console.log('Current platform:', platform);

      if (platform !== 'android') {
        throw new Error('In-app purchases are only available on Android');
      }

      // Find the package to purchase
      console.log('Finding package for purchase...');
      const packageToPurchase = await findPackageInOfferings();

      console.log('Initiating purchase with package:', packageToPurchase);

      // Make the purchase
      const purchaseResult = await Purchases.purchasePackage({
        aPackage: packageToPurchase,
      });

      console.log('Purchase result:', purchaseResult);

      const { customerInfo, productIdentifier, transaction } = purchaseResult;

      // Extract transaction ID from the specific location
      const transactionId = extractTransactionId(purchaseResult);
      console.log('Extracted transaction ID:', transactionId);

      // Check entitlements and purchases
      const entitlements = customerInfo.entitlements.active;
      const allPurchases = customerInfo.allPurchasedProductIdentifiers;

      console.log('Purchase verification details:', {
        entitlements,
        allPurchases,
        targetPackage: packageToPurchase.identifier,
        transactionId,
        transaction,
      });

      // Verify the purchase
      if (
        entitlements[packageToPurchase.identifier] ||
        allPurchases.includes(packageToPurchase.product.identifier)
      ) {
        // Confirm with backend
        const confirmationResult = await confirmPurchaseWithBackend(
          packageToPurchase.identifier,
          productIdentifier,
          transactionId,
        );

        if (!confirmationResult.success) {
          throw new Error('Backend purchase confirmation failed');
        }

        console.log('Purchase verified and confirmed with backend');
        onSuccess(productIdentifier);
      } else {
        console.log('Purchase verification failed:', customerInfo);
        throw new Error('Purchase verification failed');
      }
    } catch (err: any) {
      console.error('Purchase error:', err);

      let errorMessage = 'Purchase failed';

      if (err.code === '11' || err.code === 11) {
        console.error('Google Play credentials error:', err);
        errorMessage = 'Google Play setup required. Please try again later.';

        console.error('Detailed error:', {
          code: err.code,
          message: err.message,
          data: err.data,
          underlyingError: err.data?.underlyingErrorMessage,
        });
      } else if (err instanceof Error) {
        errorMessage = err.message;
      } else if (err.code === Purchases.ErrorCode.PURCHASE_CANCELLED_ERROR) {
        errorMessage = 'Purchase cancelled by user';
      } else if (err.underlyingErrorMessage) {
        errorMessage = err.underlyingErrorMessage;
      }

      setError(errorMessage);
      onError(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    handlePayment,
    isProcessing,
    error,
    isReady: context.isInitialized,
  };
};
