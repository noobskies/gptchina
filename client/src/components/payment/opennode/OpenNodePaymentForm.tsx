import React, { useState, useEffect } from 'react';
import { useLocalize } from '~/hooks';
import { useOpenNodePayment } from './hooks/useOpenNodePayment';
import { OpenNodeCharge } from './types';
import { formatBTCAmount, formatFiatAmount } from './utils/helpers';
import { ArrowLeft, Lock, QrCode, Zap, Copy, Check, ExternalLink } from 'lucide-react';
import { Spinner } from '~/components/svg';
import { QRCodeSVG } from 'qrcode.react';

interface OpenNodePaymentFormProps {
  amount: number;
  tokens: number;
  priceId: string;
  onSuccess: (chargeId: string) => void;
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
  const [activeTab, setActiveTab] = useState<'lightning' | 'onchain'>('lightning');
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [copiedAmount, setCopiedAmount] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number>(0);

  const {
    charge,
    isLoading,
    error: paymentError,
    createCharge,
    checkChargeStatus,
  } = useOpenNodePayment();

  useEffect(() => {
    createCharge({
      amount,
      currency: 'USD',
      tokens,
      description: `${tokens} tokens purchase`,
      customId: priceId,
    });
  }, [amount, tokens, priceId]);

  // Setup countdown timer
  useEffect(() => {
    if (!charge) return;

    const expiryTime =
      activeTab === 'lightning'
        ? charge.lightning_invoice?.expires_at
        : charge.chain_invoice?.expires_at;

    if (!expiryTime) return;

    const interval = setInterval(() => {
      const now = Math.floor(Date.now() / 1000);
      const timeRemaining = Math.max(0, expiryTime - now);
      setTimeLeft(timeRemaining);

      if (timeRemaining === 0) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [charge, activeTab]);

  // Check payment status periodically
  useEffect(() => {
    if (!charge || charge.status === 'paid') return;

    const interval = setInterval(async () => {
      const status = await checkChargeStatus(charge.id);
      if (status === 'paid') {
        onSuccess(charge.id);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [charge]);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleCopy = async (text: string, type: 'address' | 'amount') => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === 'address') {
        setCopiedAddress(true);
        setTimeout(() => setCopiedAddress(false), 2000);
      } else {
        setCopiedAmount(true);
        setTimeout(() => setCopiedAmount(false), 2000);
      }
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const getPaymentAddress = () => {
    if (!charge) return '';
    return activeTab === 'lightning'
      ? charge.lightning_invoice?.payreq
      : charge.chain_invoice?.address;
  };

  const getBitcoinAmount = () => {
    if (!charge) return '';
    return formatBTCAmount(charge.amount);
  };

  if (isLoading || !charge) {
    return (
      <div className="flex flex-col items-center p-6">
        <Spinner className="mb-4 h-8 w-8 text-blue-600 dark:text-blue-400" />
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {localize('com_ui_payment_initializing')}
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

      {/* Amount Display */}
      <div className="mb-6 rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">Amount Due</span>
            <div className="flex flex-col items-end">
              <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {formatFiatAmount(charge.fiat_value, charge.currency)}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">{getBitcoinAmount()}</span>
            </div>
          </div>
          <div className="flex items-center justify-between border-t border-gray-200 pt-2 dark:border-gray-700">
            <span className="text-sm text-gray-600 dark:text-gray-400">Tokens</span>
            <span className="text-lg font-medium text-gray-900 dark:text-gray-100">
              {tokens.toLocaleString()}
            </span>
          </div>
          {timeLeft > 0 && (
            <div className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
              Time remaining: {formatTime(timeLeft)}
            </div>
          )}
        </div>
      </div>

      {/* Payment Options Tabs */}
      <div className="mb-4 flex gap-2 px-4">
        <button
          onClick={() => setActiveTab('lightning')}
          className={`flex flex-1 items-center justify-center gap-2 rounded-lg p-3 text-sm font-medium transition-colors
            ${
              activeTab === 'lightning'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'
            }`}
        >
          <Zap className="h-4 w-4" />
          Lightning
        </button>
        <button
          onClick={() => setActiveTab('onchain')}
          className={`flex flex-1 items-center justify-center gap-2 rounded-lg p-3 text-sm font-medium transition-colors
            ${
              activeTab === 'onchain'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'
            }`}
        >
          <QrCode className="h-4 w-4" />
          Bitcoin
        </button>
      </div>

      {/* QR Code and Payment Details */}
      <div className="flex flex-col items-center gap-4 px-4">
        <div className="rounded-lg bg-white p-4">
          <QRCodeSVG value={getPaymentAddress()} size={200} />
        </div>

        <div className="w-full space-y-4">
          {/* Copy Address Button */}
          <button
            onClick={() => handleCopy(getPaymentAddress(), 'address')}
            className="flex w-full items-center justify-between rounded-lg border border-gray-200 bg-white p-3 text-sm transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
          >
            <span className="text-gray-600 dark:text-gray-400">
              {activeTab === 'lightning' ? 'Lightning Invoice' : 'Bitcoin Address'}
            </span>
            <div className="flex items-center gap-2">
              {copiedAddress ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </div>
          </button>

          {/* Copy Amount Button */}
          <button
            onClick={() => handleCopy(getBitcoinAmount(), 'amount')}
            className="flex w-full items-center justify-between rounded-lg border border-gray-200 bg-white p-3 text-sm transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
          >
            <span className="text-gray-600 dark:text-gray-400">Amount</span>
            <div className="flex items-center gap-2">
              <span>{getBitcoinAmount()}</span>
              {copiedAmount ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </div>
          </button>
        </div>

        {paymentError && (
          <div className="w-full rounded-lg bg-red-50 p-4 text-sm text-red-600 dark:bg-red-900/30 dark:text-red-400">
            {paymentError}
          </div>
        )}

        {/* Help Text */}
        <div className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
          {activeTab === 'lightning'
            ? 'Open your Lightning wallet and scan the QR code or copy the invoice'
            : 'Send the exact amount to the Bitcoin address above'}
        </div>

        {/* Footer */}
        <div className="mt-6 flex items-center justify-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
          <Lock className="h-4 w-4" />
          <span>Powered by OpenNode</span>
          <ExternalLink className="h-4 w-4" />
        </div>
      </div>
    </div>
  );
};

export default OpenNodePaymentForm;
