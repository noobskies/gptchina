// components/payment/capacitor/InAppPurchaseForm.tsx

import React from 'react';
import { useInAppPurchaseContext } from './InAppPurchaseProvider';
import { useLocalize } from '~/hooks';
import { Loader2 } from 'lucide-react';

interface InAppPurchaseFormProps {
  amount: number;
  tokens: number;
  priceId: string;
  onBack: () => void;
}

export const InAppPurchaseForm: React.FC<InAppPurchaseFormProps> = ({
  amount,
  tokens,
  priceId,
  onBack,
}) => {
  const localize = useLocalize();
  const { loading, initialized, purchase, error } = useInAppPurchaseContext();

  const handlePurchase = async () => {
    await purchase({
      priceId,
      tokens,
      amount,
    });
  };

  if (!initialized) {
    return (
      <div className="flex min-h-[200px] w-full flex-col items-center justify-center space-y-4 p-4">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {localize('com_ui_payment_initializing')}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-4 p-4">
      {error && <div className="rounded bg-red-100 p-2 text-sm text-red-700">{error}</div>}

      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
        <h3 className="mb-2 text-sm font-medium text-gray-900 dark:text-gray-100">
          {localize('com_ui_payment_summary')}
        </h3>

        <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex justify-between">
            <span>{localize('com_ui_payment_tokens')}</span>
            <span className="font-medium">{tokens.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span>{localize('com_ui_payment_amount')}</span>
            <span className="font-medium">${(amount / 100).toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col space-y-3">
        <button
          onClick={handlePurchase}
          disabled={loading}
          className="focus:bg-blue-650 w-full rounded bg-blue-600 p-2 text-sm
            text-white transition-colors hover:bg-blue-700 active:bg-blue-800 
            disabled:cursor-not-allowed disabled:bg-blue-500"
        >
          {loading ? (
            <div className="flex items-center justify-center space-x-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>{localize('com_ui_processing')}</span>
            </div>
          ) : (
            localize('com_ui_payment_purchase')
          )}
        </button>

        <button
          onClick={onBack}
          disabled={loading}
          className="w-full rounded border border-gray-300 p-2 text-sm text-gray-700 
            transition-colors hover:bg-gray-50 active:bg-gray-100 
            disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 
            dark:text-gray-300 dark:hover:bg-gray-800 dark:active:bg-gray-700"
        >
          {localize('com_ui_back')}
        </button>
      </div>

      <p className="text-center text-xs text-gray-500 dark:text-gray-400">
        {localize('com_ui_payment_in_app_purchase_note')}
      </p>
    </div>
  );
};

export default InAppPurchaseForm;
