// components/payment/stripe/StripePaymentForm.tsx
import React from 'react';
import { useLocalize } from '~/hooks';
import { useStripePayment } from './hooks/useStripePayment';
import { ArrowLeft, CreditCard, Lock } from 'lucide-react';
import { Spinner } from '~/components/svg';
import { useElements, useStripe, CardElement } from '@stripe/react-stripe-js';

interface StripePaymentFormProps {
  amount: number;
  onSuccess: () => void;
  onError: (error: string) => void;
  onBack: () => void;
}

export const StripePaymentForm: React.FC<StripePaymentFormProps> = ({
  amount,
  onSuccess,
  onError,
  onBack,
}) => {
  const localize = useLocalize();
  const [isMounted, setIsMounted] = React.useState(false);

  // Get Stripe elements from context
  const elements = useElements();
  const stripe = useStripe();

  const {
    handleSubmit,
    isProcessing,
    error: paymentError,
  } = useStripePayment({
    stripe,
    elements,
    amount,
    onSuccess,
    onError,
  });

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null; // Prevent hydration issues with Stripe Elements
  }

  if (!stripe || !elements) {
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
      {/* Header */}
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

      {/* Payment Form */}
      <form onSubmit={handleSubmit} className="space-y-6 px-4">
        {/* Amount Display */}
        <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {localize('com_ui_payment_amount')}
            </span>
            <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              ${amount.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Card Element */}
        <div className="space-y-4">
          <div className="flex items-center">
            <CreditCard className="mr-2 h-5 w-5 text-gray-400" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {localize('com_ui_payment_card_details')}
            </span>
          </div>
          <div className="rounded-md border border-gray-200 p-4 dark:border-gray-700">
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: '16px',
                    color: '#6B7280',
                    '::placeholder': {
                      color: '#9CA3AF',
                    },
                  },
                },
              }}
            />
          </div>
        </div>

        {/* Error Message */}
        {paymentError && (
          <div className="rounded-md bg-red-50 p-4 text-sm text-red-600 dark:bg-red-900/30 dark:text-red-400">
            {paymentError}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isProcessing || !stripe || !elements}
          className="w-full rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-blue-300 dark:disabled:bg-blue-800"
        >
          {isProcessing ? (
            <span className="flex items-center justify-center">
              <Spinner className="mr-2 h-4 w-4" />
              {localize('com_ui_payment_processing')}
            </span>
          ) : (
            localize('com_ui_payment_pay_now')
          )}
        </button>
      </form>

      {/* Footer */}
      <div className="mt-6 px-4 text-center">
        <div className="flex items-center justify-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
          <Lock className="h-4 w-4" />
          <span>{localize('com_ui_payment_secure_notice')}</span>
        </div>
      </div>
    </div>
  );
};

export default StripePaymentForm;
