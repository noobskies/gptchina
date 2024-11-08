import React from 'react';
import { useLocalize } from '~/hooks';
import { useInAppPurchaseContext } from './InAppPurchaseProvider';
import { ArrowLeft, Lock } from 'lucide-react';
import { Spinner } from '~/components/svg';
import TokenOptionButton from '../common/TokenOptionButton';

interface InAppPurchaseFormProps {
  amount: number;
  tokens: number;
  priceId: string;
  onSuccess: () => void;
  onError: (error: string) => void;
  onBack: () => void;
}

export const InAppPurchaseForm: React.FC<InAppPurchaseFormProps> = ({
  amount,
  tokens,
  priceId,
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

  const handlePurchase = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await purchaseProduct(priceId);
      onSuccess();
    } catch (err) {
      onError(err instanceof Error ? err.message : 'Purchase failed');
    }
  };

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
        <TokenOptionButton
          tokens={tokens}
          price={`$${(amount / 100).toFixed(2)}`}
          priceId={priceId}
          isSelected={false} // Add this prop
          label={localize('com_ui_payment_token_option')} // Add this prop
          amount={amount} // Add this prop
          currency="USD" // Add this prop
          onClick={() => {}} // Handled by form submit
          disabled={purchasing}
        />

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

export default InAppPurchaseForm;
