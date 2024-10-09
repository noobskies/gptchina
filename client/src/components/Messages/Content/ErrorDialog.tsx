import React, { useState, useEffect, useCallback } from 'react';
import { Dialog } from '~/components/ui/';
import DialogTemplate from '~/components/ui/DialogTemplate';
import { useAuthContext } from '../../../hooks/AuthContext';
import { Spinner } from '~/components';
import { useLocalize } from '~/hooks';
import TokenOptionButton from '~/components/payment/TokenOptionButton';
import PaymentOptionButton from '~/components/payment/PaymentOptionButton';
import { tokenOptions, tokenOptionsChina } from '~/components/payment/paymentConstants';
import { Capacitor } from '@capacitor/core';
import { Browser } from '@capacitor/browser';

export default function PaymentDialog({ open, onOpenChange }) {
  const { user } = useAuthContext();
  const userId = user?.id;
  const email = user?.email;
  const [processingTokenAmount, setProcessingTokenAmount] = useState(null);
  const [tokenBalance, setTokenBalance] = useState(null);
  const [selectedTokens, setSelectedTokens] = useState(null);
  const [selectedPaymentOption, setSelectedPaymentOption] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const localize = useLocalize();

  // Determine if the user is in China
  const isChina = window.location.hostname.includes('gptchina.io');

  // Select the appropriate token options array based on the user's location
  const tokenOptionsToUse = isChina ? tokenOptionsChina : tokenOptions;

  const fetchTokenBalance = useCallback(async () => {
    try {
      const response = await fetch('/api/balance');
      const balance = await response.text();
      setTokenBalance(balance);
    } catch (error) {
      console.error('Error fetching token balance:', error);
      setErrorMessage('Failed to fetch token balance. Please try again.');
    }
  }, []);

  const handleSelect = useCallback((tokens) => {
    setSelectedTokens(tokens);
  }, []);

  const processPayment = async (paymentUrl) => {
    if (Capacitor.isNativePlatform()) {
      await Browser.open({ url: paymentUrl });
      
      Browser.addListener('browserFinished', () => {
        fetchTokenBalance();
        setProcessingTokenAmount(null);
      });
    } else {
      // For web, open in a new tab
      window.open(paymentUrl, '_blank');
    }
  };

  const handlePurchase = useCallback(async () => {
    if (!selectedTokens || !selectedPaymentOption) {
      setErrorMessage('Please select a token package and a payment option.');
      return;
    }

    setErrorMessage('');

    const selectedOption = tokenOptionsToUse.find((option) => option.tokens === selectedTokens);
    if (!selectedOption) {
      console.error('Invalid token selection');
      setErrorMessage('Invalid token selection. Please try again.');
      return;
    }

    setProcessingTokenAmount(selectedTokens);

    try {
      let paymentUrl;

      switch (selectedPaymentOption) {
        case 'bitcoin':
          paymentUrl = await processBitcoinPayment(selectedTokens, selectedOption, userId, email);
          break;
        case 'wechat_pay':
        case 'alipay':
          paymentUrl = await processChinesePayment(selectedOption, selectedPaymentOption, userId, email);
          break;
        case 'google_pay':
        case 'apple_pay':
        case 'card':
          paymentUrl = await processStripePayment(selectedOption, selectedPaymentOption, userId, email);
          break;
        default:
          throw new Error('Unsupported payment option');
      }

      await processPayment(paymentUrl);
    } catch (error) {
      console.error('Payment error:', error);
      setErrorMessage('An error occurred during payment. Please try again.');
    } finally {
      setProcessingTokenAmount(null);
    }
  }, [selectedTokens, selectedPaymentOption, userId, email, fetchTokenBalance]);

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
        showFooter={false}
        main={
          <div className="flex w-full flex-col items-center gap-2">
            {errorMessage && (
              <div className="mb-4 rounded bg-red-100 p-4 text-red-700">
                <span>{errorMessage}</span>
              </div>
            )}
            <div className="mb-4 text-center">
              <p>{localize('com_ui_current_balance')}: {tokenBalance || '...'} tokens</p>
            </div>
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

            <div className="my-2 flex w-full items-center">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="text-md mx-4 flex-shrink bg-transparent px-2 text-gray-700 dark:text-gray-300">
                {localize('com_ui_payment_options')}
              </span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>

            <div className="flex flex-wrap justify-center space-x-2">
              {isChina ? (
                <>
                  <PaymentOptionButton
                    option="wechat_pay"
                    isSelected={selectedPaymentOption === 'wechat_pay'}
                    onClick={() => setSelectedPaymentOption('wechat_pay')}
                  />
                  <PaymentOptionButton
                    option="alipay"
                    isSelected={selectedPaymentOption === 'alipay'}
                    onClick={() => setSelectedPaymentOption('alipay')}
                  />
                </>
              ) : (
                <>
                  <PaymentOptionButton
                    option="card"
                    isSelected={selectedPaymentOption === 'card'}
                    onClick={() => setSelectedPaymentOption('card')}
                  />
                  <PaymentOptionButton
                    option="google_pay"
                    isSelected={selectedPaymentOption === 'google_pay'}
                    onClick={() => setSelectedPaymentOption('google_pay')}
                  />
                  <PaymentOptionButton
                    option="apple_pay"
                    isSelected={selectedPaymentOption === 'apple_pay'}
                    onClick={() => setSelectedPaymentOption('apple_pay')}
                  />
                </>
              )}
              <PaymentOptionButton
                option="bitcoin"
                isSelected={selectedPaymentOption === 'bitcoin'}
                onClick={() => setSelectedPaymentOption('bitcoin')}
              />
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