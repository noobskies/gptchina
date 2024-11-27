// capacitor/hooks/useInAppPurchase.ts
import { useState, useContext, useCallback } from 'react';
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
  const { user, token, isAuthenticated } = useAuthContext();
  const context = useContext(InAppPurchaseContext);

  if (!context) {
    throw new Error('useInAppPurchase must be used within an InAppPurchaseProvider');
  }

  const getUserData = useCallback(() => {
    if (!user?._id || !isAuthenticated) {
      throw new Error('No authenticated user found');
    }

    return {
      userId: user._id,
      tokenBalance: user.tokenBalance || 0,
      email: user.email,
    };
  }, [user, isAuthenticated]);

  const findPackageInOfferings = async () => {
    const result = await Purchases.getOfferings();
    console.log('Raw RevenueCat response:', result);

    if (!result?.current?.availablePackages) {
      throw new Error('No available packages found');
    }

    const packageId = PRICE_TO_PACKAGE_MAP[priceId];
    if (!packageId) {
      throw new Error(`No package mapping found for price ID: ${priceId}`);
    }

    console.log('Looking for package:', {
      packageId,
      availablePackages: result.current.availablePackages,
    });

    const pkg = result.current.availablePackages.find((p) => p.identifier === packageId);
    if (!pkg) {
      throw new Error(`Package ${packageId} not found in available packages`);
    }

    console.log('Found package:', pkg);
    return pkg;
  };

  const extractTransactionId = (purchaseResult: any): string => {
    console.log('Extracting transaction ID from:', purchaseResult?.transaction);

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
      const userData = getUserData();
      console.log('Confirming purchase with backend:', {
        userData,
        packageId,
        productIdentifier,
        transactionId,
        currentBalance: userData.tokenBalance,
      });

      if (!token) {
        throw new Error('No auth token available');
      }

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
          userId: userData.userId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Backend error response:', errorData);
        throw new Error(errorData.error || 'Failed to confirm purchase with backend');
      }

      const data = await response.json();
      console.log('Backend confirmation successful:', {
        response: data,
        previousBalance: userData.tokenBalance,
      });
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

    try {
      const userData = getUserData();
      console.log('Starting payment process for user:', {
        userId: userData.userId,
        currentBalance: userData.tokenBalance,
      });

      if (!isAuthenticated) {
        throw new Error('User authentication required');
      }

      setIsProcessing(true);
      setError(null);

      const platform = Capacitor.getPlatform();
      console.log('Current platform:', platform);

      if (platform !== 'ios' && platform !== 'android') {
        throw new Error('In-app purchases are only available on iOS and Android');
      }

      console.log('Finding package for purchase...');
      const packageToPurchase = await findPackageInOfferings();

      console.log('Initiating purchase with package:', packageToPurchase);

      const purchaseResult = await Purchases.purchasePackage({
        aPackage: packageToPurchase,
      });

      console.log('Purchase result:', purchaseResult);

      const { customerInfo, productIdentifier, transaction } = purchaseResult;
      const transactionId = extractTransactionId(purchaseResult);

      console.log('Purchase verification details:', {
        user: userData,
        transactionId,
        packageId: packageToPurchase.identifier,
        entitlements: customerInfo.entitlements,
        transaction,
      });

      if (
        customerInfo.entitlements.active[packageToPurchase.identifier] ||
        customerInfo.allPurchasedProductIdentifiers.includes(packageToPurchase.product.identifier)
      ) {
        const confirmationResult = await confirmPurchaseWithBackend(
          packageToPurchase.identifier,
          productIdentifier,
          transactionId,
        );

        if (!confirmationResult.success) {
          throw new Error('Backend purchase confirmation failed');
        }

        console.log(
          'Purchase verified and confirmed with backend. New balance:',
          confirmationResult.balance,
        );
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
    isReady: context.isInitialized && isAuthenticated && !!user?._id,
  };
};
