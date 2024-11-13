import React from 'react';
import { useLocalize } from '~/hooks';
import { useInAppPurchaseContext } from './InAppPurchaseProvider';
import { ArrowLeft, Lock } from 'lucide-react';
import { Spinner } from '~/components/svg';

interface InAppPurchaseFormProps {
  amount: number;
  tokens: number;
  priceId: string; // This is coming as Stripe priceId
  onSuccess: () => void;
  onError: (error: string) => void;
  onBack: () => void;
}

export const InAppPurchaseForm: React.FC<InAppPurchaseFormProps> = ({
  amount,
  tokens,
  priceId, // We'll convert this to the correct format
  onSuccess,
  onError,
  onBack,
}) => {
  const localize = useLocalize();
  const {
    loading,
    error: purchaseError,
    purchasing,
    purchaseProduct,
    restorePurchases,
  } = useInAppPurchaseContext();

  // Convert tokens amount to the correct product ID format
  const getGooglePlayProductId = (tokens: number) => {
    if (tokens === 100000) return 'tokens_100k';
    if (tokens === 500000) return 'tokens_500k';
    if (tokens === 1000000) return 'tokens_1m';
    if (tokens === 10000000) return 'tokens_10m';
    return null;
  };

  const handlePurchase = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const googlePlayProductId = getGooglePlayProductId(tokens);
      if (!googlePlayProductId) {
        throw new Error('Invalid product');
      }
      await purchaseProduct(googlePlayProductId);
      onSuccess();
    } catch (err) {
      onError(err instanceof Error ? err.message : 'Purchase failed');
    }
  };

  const formatTokens = (value: number) =>
    value >= 1_000_000 ? `${value / 1_000_000}M` : `${(value / 1000).toFixed(1)}K`;

  if (loading) {
    return (
      <div className="flex flex-col items-center p-6">
        <Spinner className="mb-4 h-8 w-8 text-blue-600 dark:text-blue-400" />
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {localize('com_ui_payment_loading')}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="mb-6 flex items-center justify-between px-4">
        <button
          onClick={onBack}
          className="flex items-center text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          {localize('com_ui_back')}
        </button>
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
          <Lock className="mr-1 h-4 w-4" />
          {localize('com_ui_payment_secure')}
        </div>
      </div>

      <form onSubmit={handlePurchase} className="space-y-6 px-4">
        <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Cost</span>
              <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                ${(amount / 100).toFixed(2)}
              </span>
            </div>
            <div className="flex items-center justify-between border-t border-gray-200 pt-2 dark:border-gray-700">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {localize('com_ui_payment_amount')}
              </span>
              <span className="text-lg font-medium text-gray-900 dark:text-gray-100">
                {formatTokens(tokens)} Tokens
              </span>
            </div>
          </div>
        </div>

        {purchaseError && (
          <div className="rounded-md bg-red-50 p-4 text-sm text-red-600 dark:bg-red-900/30 dark:text-red-400">
            {purchaseError}
          </div>
        )}

        <button
          type="submit"
          disabled={purchasing}
          className="w-full rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-blue-300 dark:disabled:bg-blue-800"
        >
          {purchasing ? (
            <span className="flex items-center justify-center">
              <Spinner className="mr-2 h-4 w-4" />
              {localize('com_ui_payment_processing')}
            </span>
          ) : (
            localize('com_ui_payment_purchase_button')
          )}
        </button>

        <button
          type="button"
          onClick={restorePurchases}
          disabled={purchasing}
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          {localize('com_ui_payment_restore_purchases')}
        </button>
      </form>
    </div>
  );
};
