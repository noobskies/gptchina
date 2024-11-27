import React from 'react';
import { useLocalize } from '~/hooks';
import { useOpenNodePayment } from './hooks/useOpenNodePayment';
import { ArrowLeft, Lock } from 'lucide-react';
import { Spinner } from '~/components/svg';
import { QRCodeSVG } from 'qrcode.react';

interface OpenNodePaymentFormProps {
  amount: number;
  tokens: number;
  priceId: string;
  onSuccess: () => void;
  onError: (error: string) => void;
  onBack: () => void;
}

export const OpenNodePaymentForm: React.FC<OpenNodePaymentFormProps> = ({
  amount,
  tokens,
  priceId,
  onSuccess,
  onError,
  onBack,
}) => {
  const localize = useLocalize();
  const [isMounted, setIsMounted] = React.useState(false);

  const formatTokens = (tokens: number) =>
    tokens >= 1_000_000 ? `${tokens / 1_000_000}M` : `${(tokens / 1000).toFixed(1)}K`;

  const {
    handleSubmit,
    isProcessing,
    error: paymentError,
    charge,
    createCharge,
  } = useOpenNodePayment({
    amount,
    priceId,
    onSuccess,
    onError,
  });

  React.useEffect(() => {
    setIsMounted(true);
    createCharge();
  }, []);

  if (!isMounted) return null;

  if (isProcessing && !charge) {
    return (
      <div className="flex flex-col items-center p-6">
        <Spinner className="mb-4 h-8 w-8 text-blue-600 dark:text-blue-400" />
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {localize('com_ui_payment_loading')}
        </p>
      </div>
    );
  }

  const bitcoinAddress = charge?.chain_invoice?.address || charge?.address?.address || '';
  const lightningInvoice = charge?.lightning_invoice?.payreq || '';

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

      <div className="space-y-6 px-4">
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
                {localize('com_ui_payment_amount')} Tokens
              </span>
              <span className="text-lg font-medium text-gray-900 dark:text-gray-100">
                {formatTokens(tokens)}
              </span>
            </div>
          </div>
        </div>

        {charge && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {bitcoinAddress && (
              <div className="flex flex-col items-center space-y-4">
                <h3 className="text-lg font-semibold">Bitcoin Address</h3>
                <div className="rounded-lg bg-white p-4 dark:bg-gray-700">
                  <QRCodeSVG value={bitcoinAddress} size={200} />
                </div>
                <div className="w-full text-center">
                  <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">
                    Send Bitcoin to this address
                  </p>
                  <div className="group relative">
                    <code className="block w-full break-all rounded bg-gray-100 p-2 text-xs dark:bg-gray-800">
                      {bitcoinAddress}
                    </code>
                    <button
                      onClick={() => navigator.clipboard.writeText(bitcoinAddress)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md bg-gray-200 px-2 py-1 text-xs 
                               text-gray-700 opacity-0 transition-opacity hover:bg-gray-300 group-hover:opacity-100 
                               dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                    >
                      Copy
                    </button>
                  </div>
                </div>
              </div>
            )}

            {lightningInvoice && (
              <div className="flex flex-col items-center space-y-4">
                <h3 className="text-lg font-semibold">Lightning Payment</h3>
                <div className="rounded-lg bg-white p-4 dark:bg-gray-700">
                  <QRCodeSVG value={lightningInvoice} size={200} />
                </div>
                <div className="w-full text-center">
                  <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">
                    Or pay with Lightning
                  </p>
                  <div className="group relative">
                    <code className="block w-full break-all rounded bg-gray-100 p-2 text-xs dark:bg-gray-800">
                      {lightningInvoice}
                    </code>
                    <button
                      onClick={() => navigator.clipboard.writeText(lightningInvoice)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md bg-gray-200 px-2 py-1 text-xs 
                               text-gray-700 opacity-0 transition-opacity hover:bg-gray-300 group-hover:opacity-100 
                               dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                    >
                      Copy
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {paymentError && (
          <div className="rounded-md bg-red-50 p-4 text-sm text-red-600 dark:bg-red-900/30 dark:text-red-400">
            {paymentError}
          </div>
        )}
      </div>
    </div>
  );
};

export default OpenNodePaymentForm;
