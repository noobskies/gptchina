import React, { useEffect, useRef, useState } from 'react';
import { useOpenNodeContext } from './OpenNodePaymentProvider';
import { ArrowLeft, Lock, Bitcoin } from 'lucide-react';
import { useLocalize } from '~/hooks';
import { Spinner } from '~/components/svg';
import { useAuthContext } from '~/hooks/AuthContext';

interface OpenNodePaymentFormProps {
  amount: number;
  tokens: number;
  priceId: string;
  onSuccess: (paymentId?: string) => void;
  onError: (message: string) => void;
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
  const { createCharge } = useOpenNodeContext();
  const { token } = useAuthContext();
  const localize = useLocalize();
  const [isVerifying, setIsVerifying] = useState(false);
  const [isPolling, setIsPolling] = useState(false);
  const pollInterval = useRef<NodeJS.Timeout>();

  const startPolling = (chargeId: string) => {
    setIsPolling(true);
    pollInterval.current = setInterval(async () => {
      try {
        const response = await fetch(`/api/payment/opennode/verify/${chargeId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();

        if (data.success) {
          clearInterval(pollInterval.current);
          setIsPolling(false);
          onSuccess(data.transactionId);
        }
      } catch (error) {
        console.error('Polling error:', error);
      }
    }, 5000);
  };

  useEffect(() => {
    return () => {
      if (pollInterval.current) {
        clearInterval(pollInterval.current);
      }
    };
  }, []);

  const handlePayment = async () => {
    try {
      const charge = await createCharge({
        amount,
        tokens,
        success_url: `${window.location.origin}/payment/success?chargeId={id}`,
        callback_url: `${window.location.origin}/api/payments/opennode/webhook`,
      });

      if (charge.hosted_checkout_url) {
        window.open(charge.hosted_checkout_url, '_blank');
        startPolling(charge.id);
      } else {
        onError('Invalid checkout URL received');
      }
    } catch (err) {
      onError(err instanceof Error ? err.message : 'Payment failed');
    }
  };

  if (isVerifying || isPolling) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <Spinner className="mb-4 h-8 w-8 text-blue-600 dark:text-blue-400" />
        <p className="text-center text-sm text-gray-600 dark:text-gray-400">
          {isPolling ? 'Waiting for payment confirmation...' : 'Verifying your payment...'}
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

      <div className="space-y-6 px-4">
        <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Cost</span>
              <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                ${amount / 100} USD
              </span>
            </div>
            <div className="flex items-center justify-between border-t border-gray-200 pt-2 dark:border-gray-700">
              <span className="text-sm text-gray-600 dark:text-gray-400">Tokens</span>
              <span className="text-lg font-medium text-gray-900 dark:text-gray-100">
                {tokens.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-orange-50 p-4 dark:bg-orange-900/30">
          <div className="flex items-start">
            <Bitcoin className="mr-3 h-6 w-6 text-orange-500" />
            <div>
              <h3 className="text-sm font-medium text-orange-800 dark:text-orange-200">
                Bitcoin Payment Information
              </h3>
              <ul className="mt-2 text-sm text-orange-700 dark:text-orange-300">
                <li>• Instant confirmation for faster processing</li>
                <li>• Zero-fee transactions</li>
                <li>• Secure Bitcoin Lightning Network support</li>
              </ul>
            </div>
          </div>
        </div>

        <button
          onClick={handlePayment}
          className="w-full rounded-lg bg-orange-500 px-4 py-2 text-white transition-colors 
            hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 
            focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-orange-300 
            dark:disabled:bg-orange-800"
        >
          <span className="flex items-center justify-center">
            <Bitcoin className="mr-2 h-4 w-4" />
            Pay with Bitcoin
          </span>
        </button>
      </div>

      <div className="mt-6 px-4 text-center">
        <div className="flex items-center justify-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
          <Lock className="h-4 w-4" />
          <span>{localize('com_ui_payment_secure_notice')}</span>
        </div>
      </div>
    </div>
  );
};
