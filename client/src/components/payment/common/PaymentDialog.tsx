// components/payment/common/PaymentDialog.tsx
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
import OpenNodePaymentForm from '../opennode/OpenNodePaymentForm';
import InAppPurchaseForm from '../capacitor/InAppPurchaseForm';
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
    const commonProps = {
      amount: selectedTokens!,
      onSuccess: handlePaymentComplete,
      onError: handlePaymentError,
      onBack: () => setStep('select'),
    };

    console.log('Selected payment method:', selectedPaymentMethod);
    console.log('Selected tokens:', selectedTokens);
    console.log('User:', user);

    switch (selectedPaymentMethod) {
      case PaymentMethod.Card:
      case PaymentMethod.GooglePay:
      case PaymentMethod.ApplePay:
        return (
          <StripePaymentProvider amount={selectedTokens!} user={user}>
            <StripePaymentForm {...commonProps} />
          </StripePaymentProvider>
        );
      case PaymentMethod.WeChatPay:
      case PaymentMethod.AliPay:
      case PaymentMethod.Bitcoin:
        return <OpenNodePaymentForm {...commonProps} />;
      case PaymentMethod.InAppPurchase:
        return <InAppPurchaseForm {...commonProps} />;
      default:
        return null;
    }
  };

  const renderContent = () => {
    switch (step) {
      case 'select':
        return (
          <div className="flex w-full flex-col items-center gap-4">
            {error && <div className="w-full rounded-md bg-red-100 p-4 text-red-700">{error}</div>}

            <div className="grid w-full grid-cols-2 gap-4">
              {tokenOptions.map((option) => (
                <TokenOptionButton
                  key={option.tokens}
                  {...option}
                  isSelected={selectedTokens === option.tokens}
                  onClick={() => handleTokenSelect(option.tokens)}
                />
              ))}
            </div>

            <div className="my-4 flex w-full items-center">
              <div className="flex-grow border-t border-gray-300 dark:border-gray-700" />
              <span className="mx-4 text-sm text-gray-600 dark:text-gray-400">
                {localize('com_ui_payment_options')}
              </span>
              <div className="flex-grow border-t border-gray-300 dark:border-gray-700" />
            </div>

            <div className="grid w-full grid-cols-2 gap-4">
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
              className="focus:bg-blue-650 mt-6 w-full rounded bg-blue-600 p-2 text-white transition-colors duration-200 hover:bg-blue-700 focus:outline-none active:bg-blue-800 disabled:cursor-not-allowed disabled:bg-blue-500 disabled:hover:bg-blue-500 dark:hover:bg-blue-700"
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
      <OGDialogContent
        title={localize('com_ui_payment_title')}
        className="w-11/12 max-w-2xl overflow-x-auto bg-background text-text-primary shadow-2xl hover:bg-background"
      >
        <OGDialogHeader>
          <OGDialogTitle>{localize('com_ui_payment_title')}</OGDialogTitle>
        </OGDialogHeader>
        {renderContent()}
      </OGDialogContent>
    </OGDialog>
  );
}
