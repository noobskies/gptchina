// capacitor/InAppPurchaseForm.tsx
import React from 'react';
import { ArrowLeft, Lock } from 'lucide-react';
import { Spinner } from '~/components/svg';
import { useLocalize } from '~/hooks';
import { useInAppPurchase } from './hooks/useInAppPurchase';
import { Capacitor } from '@capacitor/core';

interface InAppPurchaseFormProps {
  amount: number;
  tokens: number;
  priceId: string;
  onSuccess: (paymentIntentId?: string) => void;
  onError: (message: string) => void;
  onBack: () => void;
}

export function InAppPurchaseForm({
  amount,
  tokens,
  priceId,
  onSuccess,
  onError,
  onBack,
}: InAppPurchaseFormProps) {
  const localize = useLocalize();
  const [isMounted, setIsMounted] = React.useState(false);

  const {
    handlePayment,
    isProcessing,
    error: paymentError,
    isReady,
  } = useInAppPurchase({
    amount,
    priceId,
    onSuccess,
    onError,
  });

  const formatTokens = (tokens: number) =>
    tokens >= 1_000_000 ? `${tokens / 1_000_000}M` : `${(tokens / 1000).toFixed(1)}K`;

  React.useEffect(() => {
    setIsMounted(true);

    console.log('InAppPurchaseForm mounted', {
      platform: Capacitor.getPlatform(),
      priceId,
      amount,
      tokens,
      isReady,
    });

    return () => {
      console.log('InAppPurchaseForm unmounting');
      setIsMounted(false);
    };
  }, [priceId, amount, tokens, isReady]);

  if (!isMounted) {
    console.log('Component not mounted yet');
    return null;
  }

  const handlePaymentClick = async () => {
    try {
      console.log('Payment button clicked', {
        isProcessing,
        isReady,
        priceId,
        amount,
      });
      await handlePayment();
    } catch (err) {
      console.error('Payment click error:', err);
    }
  };

  // Render loading state if payment system isn't ready
  if (!isReady) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 p-8">
        <Spinner className="h-8 w-8 text-blue-600 dark:text-blue-400" />
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {localize('com_ui_payment_initializing')}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {/* Header with Back Button and Security Notice */}
      <div className="mb-6 flex items-center justify-between px-4">
        <button
          onClick={onBack}
          className="flex items-center text-sm text-gray-600 hover:text-gray-900 
            dark:text-gray-400 dark:hover:text-gray-200"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          {localize('com_ui_back')}
        </button>
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
          <Lock className="mr-1 h-4 w-4" />
          {localize('com_ui_payment_secure')}
        </div>
      </div>

      <div className="space-y-6 px-4">
        {/* Purchase Details Card */}
        <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {localize('com_ui_payment_cost')}
              </span>
              <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                ${(amount / 100).toFixed(2)} USD
              </span>
            </div>
            <div className="border-t border-gray-200 pt-2 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {localize('com_ui_payment_tokens')}
                </span>
                <span className="text-lg font-medium text-gray-900 dark:text-gray-100">
                  {formatTokens(tokens)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {paymentError && (
          <div
            className="rounded-md bg-red-50 p-4 text-sm text-red-600 
            dark:bg-red-900/30 dark:text-red-400"
          >
            {paymentError}
          </div>
        )}

        {/* Purchase Button */}
        <button
          onClick={handlePaymentClick}
          disabled={isProcessing || !isReady}
          className="w-full rounded-lg bg-blue-600 px-4 py-3 text-white 
            transition-colors hover:bg-blue-700 focus:outline-none 
            focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 
            disabled:cursor-not-allowed disabled:bg-blue-300 
            dark:disabled:bg-blue-800"
        >
          {!isReady ? (
            <span className="flex items-center justify-center">
              <Spinner className="mr-2 h-4 w-4" />
              {localize('com_ui_loading')}
            </span>
          ) : isProcessing ? (
            <span className="flex items-center justify-center">
              <Spinner className="mr-2 h-4 w-4" />
              {localize('com_ui_payment_processing')}
            </span>
          ) : (
            localize('com_ui_payment_purchase_button')
          )}
        </button>

        {/* Security Notice Footer */}
        <div className="mt-6 text-center">
          <div
            className="flex items-center justify-center space-x-2 
            text-sm text-gray-500 dark:text-gray-400"
          >
            <Lock className="h-4 w-4" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default InAppPurchaseForm;
