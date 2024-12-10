import React from 'react';
import { useLocalize } from '~/hooks';
import { useStripePayment } from './hooks/useStripePayment';
import { ArrowLeft, Lock } from 'lucide-react';
import { Spinner } from '~/components/svg';
import { useElements, useStripe, PaymentElement } from '@stripe/react-stripe-js';
import { PaymentMethod } from '../constants/paymentMethods';
import { tokenOptions } from '../constants/tokenOptions';

interface StripePaymentFormProps {
  amount: number;
  tokens: number;
  priceId: string;
  onSuccess: () => void;
  onError: (error: string) => void;
  onBack: () => void;
  selectedPaymentMethod: PaymentMethod;
}

export const StripePaymentForm: React.FC<StripePaymentFormProps> = ({
  amount,
  tokens,
  priceId,
  onSuccess,
  onError,
  onBack,
  selectedPaymentMethod,
}) => {
  const localize = useLocalize();
  const [isMounted, setIsMounted] = React.useState(false);
  const elements = useElements();
  const stripe = useStripe();

  const formatTokens = (tokens: number) =>
    tokens >= 1_000_000 ? `${tokens / 1_000_000}M` : `${(tokens / 1000).toFixed(1)}K`;

  const displayPrice = React.useMemo(() => {
    const tokenPackage = tokenOptions.find((option) => option.tokens === tokens);
    return tokenPackage?.discountedPrice || `$${(amount / 100).toFixed(2)}`;
  }, [tokens, amount]);

  const getStripePaymentMethod = (method: PaymentMethod) => {
    const methodMap: Record<PaymentMethod, string[]> = {
      [PaymentMethod.Card]: ['card'],
      [PaymentMethod.GooglePay]: ['google_pay', 'card'],
      [PaymentMethod.ApplePay]: ['apple_pay', 'card'],
      [PaymentMethod.WeChatPay]: ['wechat_pay', 'card'],
      [PaymentMethod.AliPay]: ['alipay', 'card'],
      [PaymentMethod.Bitcoin]: ['crypto'],
      [PaymentMethod.InAppPurchase]: ['card'],
    };
    return methodMap[method];
  };

  const {
    handleSubmit,
    isProcessing,
    error: paymentError,
  } = useStripePayment({
    stripe,
    elements,
    amount,
    priceId,
    onSuccess,
    onError,
  });

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

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

      <form onSubmit={handleSubmit} className="space-y-6 px-4">
        {/* Amount and Tokens Display */}
        <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Cost</span>
              <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {displayPrice} USD
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

        <div className="space-y-4">
          <PaymentElement
            options={{
              defaultValues: {
                billingDetails: {
                  name: '',
                  email: '',
                  phone: '',
                },
              },
              paymentMethodOrder: getStripePaymentMethod(selectedPaymentMethod),
              wallets: {
                applePay: selectedPaymentMethod === PaymentMethod.ApplePay ? 'auto' : 'never',
                googlePay: selectedPaymentMethod === PaymentMethod.GooglePay ? 'auto' : 'never',
              },
            }}
          />
        </div>

        {paymentError && (
          <div className="rounded-md bg-red-50 p-4 text-sm text-red-600 dark:bg-red-900/30 dark:text-red-400">
            {paymentError}
          </div>
        )}

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
            localize('com_ui_payment_purchase_button')
          )}
        </button>
      </form>

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
