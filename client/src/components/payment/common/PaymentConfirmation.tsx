import React from 'react';
import { useLocalize } from '~/hooks';
import { Check, Copy } from 'lucide-react';
import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';

interface PaymentConfirmationProps {
  tokens: number;
  transactionId?: string;
  onClose: () => void;
}

const PaymentConfirmation: React.FC<PaymentConfirmationProps> = ({
  tokens,
  transactionId,
  onClose,
}) => {
  const localize = useLocalize();
  const [copied, setCopied] = useState(false);
  const queryClient = useQueryClient();

  // Invalidate the balance query when component mounts
  React.useEffect(() => {
    queryClient.invalidateQueries(['balance']); // This will trigger a refresh of the balance query
  }, [queryClient]);

  const handleClose = () => {
    // Ensure balance is refreshed before closing
    queryClient.invalidateQueries(['balance']).then(() => {
      onClose();
    });
  };

  const handleCopyTransactionId = async () => {
    if (transactionId) {
      try {
        await navigator.clipboard.writeText(transactionId);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy transaction ID:', err);
      }
    }
  };

  return (
    <div className="flex flex-col items-center px-4 py-6">
      {/* Success Icon */}
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
        <Check className="h-8 w-8 text-green-600 dark:text-green-400" />
      </div>

      {/* Success Message */}
      <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-gray-100">
        {localize('com_ui_payment_success_title')}
      </h3>

      {/* Token Amount on Its Own Line */}
      <div className="mb-6 text-center">
        <p className="text-gray-600 dark:text-gray-400">
          {localize('com_ui_payment_success_description')}
        </p>
        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{tokens} tokens</div>
        <p className="text-gray-600 dark:text-gray-400">
          have been successfully added to your account.
        </p>
      </div>

      {/* Transaction Details */}
      {transactionId && (
        <div className="mb-6 w-full rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
          <p className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            {localize('com_ui_payment_transaction_id')}
          </p>
          <div className="flex items-center gap-2">
            <code className="flex-1 rounded bg-gray-100 px-2 py-1 font-mono text-sm text-gray-800 dark:bg-gray-700 dark:text-gray-200">
              {transactionId}
            </code>
            <button
              onClick={handleCopyTransactionId}
              className={`
                inline-flex items-center rounded-md border px-3 py-2 text-sm transition-colors
                ${
                  copied
                    ? 'border-green-200 bg-green-50 text-green-600 dark:border-green-900/50 dark:bg-green-900/20 dark:text-green-400'
                    : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'
                }
              `}
            >
              {copied ? (
                <>
                  <Check className="mr-1 h-4 w-4" />
                  {localize('com_ui_copied')}
                </>
              ) : (
                <>
                  <Copy className="mr-1 h-4 w-4" />
                  {localize('com_ui_copy')}
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex w-full flex-col gap-3">
        <button
          onClick={handleClose}
          className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:hover:bg-blue-600"
        >
          Continue
        </button>

        <a
          href="/support"
          className="text-center text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
        >
          {localize('com_ui_payment_need_help')}
        </a>
      </div>
    </div>
  );
};

export default PaymentConfirmation;
