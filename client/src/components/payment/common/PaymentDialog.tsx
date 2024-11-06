import React from 'react';
import { OGDialog, OGDialogContent, OGDialogHeader, OGDialogTitle } from '~/components';
import { useAuthContext } from '~/hooks/AuthContext';
import { useLocalize } from '~/hooks';
import TokenOptionButton from './TokenOptionButton';
import PaymentOptionButton from './PaymentOptionButton';
import PaymentConfirmation from './PaymentConfirmation';
import { paymentMethods, PaymentMethod } from '../constants/paymentMethods';
import { tokenOptions } from '../constants/tokenOptions';
import { StripePaymentForm } from '../stripe/StripePaymentForm';
import { StripePaymentProvider } from '../stripe/StripePaymentProvider';

interface PaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type PaymentStep = 'select' | 'payment' | 'confirmation';

export default function PaymentDialog({ open, onOpenChange }: PaymentDialogProps) {
  const { user } = useAuthContext();
  const localize = useLocalize();
  const [step, setStep] = React.useState<PaymentStep>('select');
  const [selectedTokens, setSelectedTokens] = React.useState<number | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = React.useState<PaymentMethod | null>(
    null,
  );
  const [error, setError] = React.useState<string | null>(null);

  // Get the selected token package
  const selectedPackage = React.useMemo(
    () => tokenOptions.find((option) => option.tokens === selectedTokens),
    [selectedTokens],
  );

  const handleTokenSelect = (tokens: number) => {
    setSelectedTokens(tokens);
    setError(null);
  };

  const handlePaymentMethodSelect = (method: PaymentMethod) => {
    setSelectedPaymentMethod(method);
    setError(null);
  };

  const handlePaymentComplete = () => {
    setStep('confirmation');
  };

  const handlePaymentError = (errorMessage: string) => {
    setError(errorMessage);
  };

  const resetDialog = () => {
    setStep('select');
    setSelectedTokens(null);
    setSelectedPaymentMethod(null);
    setError(null);
  };

  const handleClose = () => {
    onOpenChange(false);
    resetDialog();
  };

  const handleContinue = () => {
    if (!selectedTokens || !selectedPaymentMethod) {
      setError(localize('com_ui_payment_select_required'));
      return;
    }
    setStep('payment');
  };

  const renderPaymentForm = () => {
    if (!selectedPackage) return null;

    const commonProps = {
      amount: selectedPackage.amount,
      tokens: selectedPackage.tokens,
      onSuccess: handlePaymentComplete,
      onError: handlePaymentError,
      onBack: () => setStep('select'),
      selectedPaymentMethod: selectedPaymentMethod!,
    };

    switch (selectedPaymentMethod) {
      case PaymentMethod.Card:
      case PaymentMethod.GooglePay:
      case PaymentMethod.ApplePay:
      case PaymentMethod.WeChatPay:
      case PaymentMethod.AliPay:
      case PaymentMethod.Bitcoin:
        return (
          <StripePaymentProvider amount={selectedPackage.amount} user={user}>
            <StripePaymentForm {...commonProps} />
          </StripePaymentProvider>
        );
      default:
        return null;
    }
  };

  const renderContent = () => {
    switch (step) {
      case 'select':
        return (
          <div className="flex flex-col gap-3 p-2">
            {error && <div className="rounded bg-red-100 p-2 text-sm text-red-700">{error}</div>}

            <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
              {tokenOptions.map((option) => (
                <TokenOptionButton
                  key={option.tokens}
                  {...option}
                  isSelected={selectedTokens === option.tokens}
                  onClick={() => handleTokenSelect(option.tokens)}
                />
              ))}
            </div>

            <div className="my-2 flex items-center">
              <div className="flex-1 border-t border-gray-300 dark:border-gray-700" />
              <span className="mx-2 text-xs text-gray-600 dark:text-gray-400">
                {localize('com_ui_payment_options')}
              </span>
              <div className="flex-1 border-t border-gray-300 dark:border-gray-700" />
            </div>

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
              {paymentMethods.map((method) => (
                <PaymentOptionButton
                  key={method.id}
                  {...method}
                  isSelected={selectedPaymentMethod === method.id}
                  onClick={() => handlePaymentMethodSelect(method.id)}
                />
              ))}
            </div>

            <button
              onClick={handleContinue}
              disabled={!selectedTokens || !selectedPaymentMethod}
              className="focus:bg-blue-650 mt-3 w-full rounded bg-blue-600 p-2 text-sm
                text-white hover:bg-blue-700 active:bg-blue-800 
                disabled:cursor-not-allowed disabled:bg-blue-500"
            >
              {localize('com_ui_payment_title')}
            </button>
          </div>
        );

      case 'payment':
        return renderPaymentForm();

      case 'confirmation':
        return <PaymentConfirmation tokens={selectedTokens!} onClose={handleClose} />;
    }
  };

  return (
    <OGDialog open={open} onOpenChange={handleClose}>
      <OGDialogContent className="flex max-h-[90vh] w-11/12 max-w-xl flex-col bg-background">
        <OGDialogHeader className="border-b border-gray-200 p-2 dark:border-gray-700" />
        <div className="overflow-y-auto p-2">{renderContent()}</div>
      </OGDialogContent>
    </OGDialog>
  );
}
