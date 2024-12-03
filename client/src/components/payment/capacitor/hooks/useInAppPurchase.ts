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
    const platform = Capacitor.getPlatform();
    alert(`Starting package search for platform: ${platform}`);

    try {
      // Step 1: Get Offerings
      alert('About to call Purchases.getOfferings()');
      let result;
      try {
        result = await Purchases.getOfferings();
      } catch (offeringsError) {
        alert(`Failed to get offerings:
Platform: ${platform}
Error Message: ${offeringsError.message || 'No message'}
Error Code: ${offeringsError.code || 'No code'}
Details: ${JSON.stringify(offeringsError)}`);
        throw offeringsError;
      }

      // Step 2: Validate Result
      if (!result) {
        alert('Result is null or undefined');
        throw new Error('Offerings result is null');
      }

      alert(`Raw offerings result:
Has Current: ${!!result.current}
All Offerings: ${Object.keys(result.all || {}).join(', ')}
Available Packages: ${result.current?.availablePackages?.length || 0}`);

      // Step 3: Check Current Offering
      if (!result?.current) {
        alert('No current offering found');
        throw new Error('No available offerings found');
      }

      // Step 4: Check Available Packages
      if (!result.current.availablePackages?.length) {
        alert(`No packages in current offering:
Offering ID: ${result.current.identifier || 'unknown'}`);
        throw new Error('No available packages found');
      }

      // Step 5: Get Package ID
      const packageId = PRICE_TO_PACKAGE_MAP[priceId];
      if (!packageId) {
        alert(`No package mapping for price ID: ${priceId}
Available mappings: ${Object.keys(PRICE_TO_PACKAGE_MAP).join(', ')}`);
        throw new Error(`No package mapping found for price ID: ${priceId}`);
      }

      // Step 6: Find Package
      alert(`Searching for package:
Package ID: ${packageId}
Available packages: ${result.current.availablePackages.map((p) => p.identifier).join(', ')}`);

      const pkg = result.current.availablePackages.find((p) => p.identifier === packageId);

      if (!pkg) {
        alert(`Package not found:
Searched for: ${packageId}
Available: ${result.current.availablePackages.map((p) => p.identifier).join(', ')}`);
        throw new Error(`Package ${packageId} not found in available packages`);
      }

      // Step 7: Success
      alert(`Found package:
Identifier: ${pkg.identifier}
Product ID: ${pkg.product.identifier}
Title: ${pkg.product.title || 'No title'}
Price: ${pkg.product.priceString || 'No price'}
Platform: ${platform}`);

      return pkg;
    } catch (error) {
      alert(`Final error in findPackageInOfferings:
Platform: ${platform}
Error Type: ${typeof error}
Message: ${error.message || 'No message'}
Code: ${error?.code || 'No code'}
Details: ${JSON.stringify(error)}`);
      throw error;
    }
  };

  const extractTransactionId = (purchaseResult: any): string => {
    console.log('Extracting transaction ID from:', purchaseResult?.transaction);

    // Handle both iOS and Android transaction IDs
    const platform = Capacitor.getPlatform();
    let transactionId;

    if (platform === 'ios') {
      transactionId =
        purchaseResult?.transaction?.transactionIdentifier || purchaseResult?.transaction?.id;
    } else {
      transactionId =
        purchaseResult?.transaction?.transactionIdentifier || purchaseResult?.purchaseToken;
    }

    if (!transactionId) {
      console.error('Purchase result missing transaction ID:', purchaseResult);
      throw new Error('Purchase completed but transaction ID is missing');
    }

    return transactionId;
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

      // Find and purchase package
      console.log('Finding package for purchase...');
      const packageToPurchase = await findPackageInOfferings();

      console.log('Initiating purchase with package:', packageToPurchase);

      const purchaseResult = await Purchases.purchasePackage({
        aPackage: packageToPurchase,
      });

      console.log('Purchase result:', purchaseResult);

      const { customerInfo, productIdentifier } = purchaseResult;
      const transactionId = extractTransactionId(purchaseResult);

      console.log('Purchase verification details:', {
        user: userData,
        transactionId,
        packageId: packageToPurchase.identifier,
        entitlements: customerInfo.entitlements,
        platform,
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
        const platform = Capacitor.getPlatform();
        errorMessage =
          platform === 'ios'
            ? 'App Store setup required. Please try again later.'
            : 'Google Play setup required. Please try again later.';

        console.error(`${platform} credentials error:`, err);
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
