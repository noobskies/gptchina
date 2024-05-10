import React, { useState, useEffect, useCallback } from 'react';
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

export default function ErrorDialog({ open, onOpenChange }) {
  const { user } = useAuthContext();
  const userId = user?.id;
  const email = user?.email;
  const [processingTokenAmount, setProcessingTokenAmount] = useState(null);
  const [tokenBalance, setTokenBalance] = useState(null);
  const [selectedTokens, setSelectedTokens] = useState(null);
  const [selectedPaymentOption, setSelectedPaymentOption] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const localize = useLocalize();

  // Determine the user's domain (China or global)
  const isChina = window.location.hostname.includes('gptchina.io');

  // Select the appropriate token options array based on the user's domain
  const tokenOptionsToUse = isChina ? tokenOptionsChina : tokenOptions;

  const fetchTokenBalance = useCallback(async () => {
    try {
      const response = await fetch('/api/balance');
      const balance = await response.text();
      setTokenBalance(balance);
    } catch (error) {
      console.error('Error fetching token balance:', error);
    }
  }, []);

  const handleSelect = useCallback((tokens) => {
    setSelectedTokens(tokens);
  }, []);

  const handlePurchase = useCallback(async () => {
    if (!selectedTokens || !selectedPaymentOption) {
      setErrorMessage('Please select a token package and a payment option.');
      return;
    }

    setErrorMessage('');

    const selectedOption = tokenOptionsToUse.find((option) => option.tokens === selectedTokens);
    console.log('selectedOption', selectedOption);
    if (!selectedOption) {
      console.error('Invalid token selection');
      return;
    }

    setProcessingTokenAmount(selectedTokens);

    try {
      if (selectedPaymentOption === 'bitcoin') {
        await processBitcoinPayment(selectedTokens, selectedOption, userId, email, isChina);
      } else {
        console.log('Selected payment option:', selectedPaymentOption);
        await processStripePayment(selectedOption, selectedPaymentOption, userId, email);
      }
    } catch (error) {
      console.error('Payment error:', error);
    } finally {
      setProcessingTokenAmount(null);
    }
  }, [selectedTokens, selectedPaymentOption, userId, email, isChina]);

  useEffect(() => {
    if (open) {
      fetchTokenBalance();
    }
  }, [open, fetchTokenBalance]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTemplate
        title={localize('com_ui_payment_title')}
        className="max-w-[450px]"
        main={
          <div className="flex w-full flex-col items-center gap-2">
            {errorMessage && (
              <div className="mb-4 rounded bg-red-100 p-4 text-red-700">
                <span>{errorMessage}</span>
              </div>
            )}
            <div className="text-center text-sm dark:text-white">
              {localize('com_ui_payment_please_note')}
            </div>
            <div className="grid w-full grid-cols-2 gap-5 p-3">
              {tokenOptionsToUse.map((option, index) => (
                <TokenOptionButton
                  key={option.tokens}
                  {...option}
                  isSelected={selectedTokens === option.tokens}
                  onClick={() => handleSelect(option.tokens)}
                />
              ))}
            </div>

            <div className="my-2 flex w-full items-center">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="text-md mx-4 flex-shrink bg-transparent px-2 text-gray-700 dark:text-gray-300">
                {localize('com_ui_payment_options')}
              </span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>

            <div className="my-4 flex flex-wrap justify-center space-x-2 sm:space-x-4">
              <PaymentOptionButton
                option="wechat_pay"
                isSelected={selectedPaymentOption === 'wechat_pay'}
                onClick={() => {
                  console.log('WeChat Pay selected');
                  setSelectedPaymentOption('wechat_pay');
                }}
              />
              <PaymentOptionButton
                option="alipay"
                isSelected={selectedPaymentOption === 'alipay'}
                onClick={() => {
                  console.log('Alipay selected');
                  setSelectedPaymentOption('alipay');
                }}
              />
              <PaymentOptionButton
                option="card"
                isSelected={selectedPaymentOption === 'card'}
                onClick={() => {
                  console.log('Card selected');
                  setSelectedPaymentOption('card');
                }}
              />
              <PaymentOptionButton
                option="bitcoin"
                isSelected={selectedPaymentOption === 'bitcoin'}
                onClick={() => {
                  console.log('Bitcoin selected');
                  setSelectedPaymentOption('bitcoin');
                }}
              />
              <PaymentOptionButton
                option="google_pay"
                isSelected={selectedPaymentOption === 'google_pay'}
                onClick={() => {
                  console.log('Google Pay selected');
                  setSelectedPaymentOption('google_pay');
                }}
              />
            </div>

            <button
              onClick={handlePurchase}
              disabled={processingTokenAmount !== null}
              className="w-full rounded-md bg-blue-600 px-4 py-2 text-white transition duration-200 ease-in-out hover:bg-blue-700 focus:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 active:bg-blue-800 disabled:cursor-not-allowed disabled:bg-blue-400 disabled:hover:bg-blue-400"
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
