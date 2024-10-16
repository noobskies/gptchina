import React, { useState, useCallback } from 'react';
import { Dialog } from '~/components/ui/';
import DialogTemplate from '~/components/ui/DialogTemplate';
import { useAuthContext } from '../../../hooks/AuthContext';
import { Spinner } from '~/components';
import { useLocalize } from '~/hooks';
import TokenOptionButton from '~/components/payment/TokenOptionButton';
import PaymentOptionButton from '~/components/payment/PaymentOptionButton';
import { tokenOptions, tokenOptionsChina } from '~/components/payment/paymentConstants';
import { processBitcoinPayment } from '~/components/payment/BitcoinPayment';
import { processStripePayment } from '~/components/payment/StripePayment';

const mainPaymentOptions = ['wechat_pay', 'alipay', 'card', 'bitcoin'];
const mobilePaymentOptions = ['google_pay', 'apple_pay'];

export default function PaymentDialog({ open, onOpenChange }) {
  const { user } = useAuthContext();
  const { id: userId, email } = user || {};
  const [processingTokenAmount, setProcessingTokenAmount] = useState(null);
  const [selectedTokens, setSelectedTokens] = useState(null);
  const [selectedPaymentOption, setSelectedPaymentOption] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const localize = useLocalize();

  const isChina = window.location.hostname.includes('gptchina.io');
  const tokenOptionsToUse = isChina ? tokenOptionsChina : tokenOptions;

  const handleSelect = useCallback((tokens) => setSelectedTokens(tokens), []);

  const handlePurchase = useCallback(async () => {
    if (!selectedTokens || !selectedPaymentOption) {
      setErrorMessage('Please select a token package and a payment option.');
      return;
    }

    setErrorMessage('');
    const selectedOption = tokenOptionsToUse.find((option) => option.tokens === selectedTokens);
    if (!selectedOption) {
      console.error('Invalid token selection');
      return;
    }

    setProcessingTokenAmount(selectedTokens);

    try {
      if (selectedPaymentOption === 'bitcoin') {
        await processBitcoinPayment(selectedTokens, selectedOption, userId, email, isChina);
      } else {
        await processStripePayment(selectedOption, selectedPaymentOption, userId, email);
      }
      onOpenChange(false);
    } catch (error) {
      console.error('Payment error:', error);
      setErrorMessage('An error occurred while initiating the payment. Please try again.');
    } finally {
      setProcessingTokenAmount(null);
    }
  }, [selectedTokens, selectedPaymentOption, userId, email, isChina, tokenOptionsToUse, onOpenChange]);

  const renderTokenOptions = () => (
    <div className="grid w-full grid-cols-2 gap-5 p-3">
      {tokenOptionsToUse.map((option) => (
        <TokenOptionButton
          key={option.tokens}
          {...option}
          isSelected={selectedTokens === option.tokens}
          onClick={() => handleSelect(option.tokens)}
        />
      ))}
    </div>
  );

  const renderPaymentOptions = (options) => (
    <div className="flex flex-wrap justify-center space-x-2">
      {options.map((option) => (
        <PaymentOptionButton
          key={option}
          option={option}
          isSelected={selectedPaymentOption === option}
          onClick={() => setSelectedPaymentOption(option)}
        />
      ))}
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTemplate
        title={localize('com_ui_payment_title')}
        className="max-w-[450px]"
        showFooter={false}
        main={
          <div className="flex w-full flex-col items-center gap-2">
            {errorMessage && (
              <div className="mb-4 rounded bg-red-100 p-4 text-red-700">
                <span>{errorMessage}</span>
              </div>
            )}
            {renderTokenOptions()}
            <div className="my-2 flex w-full items-center">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="text-md mx-4 flex-shrink bg-transparent px-2 text-gray-700 dark:text-gray-300">
                {localize('com_ui_payment_options')}
              </span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>
            {renderPaymentOptions(mainPaymentOptions)}
            <div className="mt-2">
              {renderPaymentOptions(mobilePaymentOptions)}
            </div>
            <button
              onClick={handlePurchase}
              disabled={processingTokenAmount !== null}
              className="mt-4 w-full rounded-md bg-blue-600 px-4 py-2 text-white transition duration-200 ease-in-out hover:bg-blue-700 focus:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 active:bg-blue-800 disabled:cursor-not-allowed disabled:bg-blue-400 disabled:hover:bg-blue-400"
            >
              <span className="inline-flex items-center justify-center">
                {processingTokenAmount !== null ? (
                  <Spinner />
                ) : (
                  localize('com_ui_payment_purchase_button')
                )}
              </span>
            </button>
          </div>
        }
      />
    </Dialog>
  );
}