/**
 * CUSTOM: gptchina fork
 *
 * Feature: Buy Tokens (Stripe Integration)
 * Created: 2025-11-09
 * Upstream Impact: None (standalone module)
 *
 * Payment form component with Stripe Elements integration.
 */

import React, { useState } from 'react';
import { ArrowLeft, CreditCard, Loader2 } from 'lucide-react';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button } from '@librechat/client';
import { useLocalize } from '~/hooks';
import { getErrorMessage, mapStripeError, isRetryable } from '../utils/errors';

interface PaymentFormProps {
  selectedPackage: string;
  onSuccess: (paymentIntent: any) => void;
  onBack: () => void;
}

export const PaymentForm: React.FC<PaymentFormProps> = ({ onSuccess, onBack }) => {
  const stripe = useStripe();
  const elements = useElements();
  const localize = useLocalize();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isReady, setIsReady] = useState(false);
  const [showRetry, setShowRetry] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setLoading(true);
    setErrorMessage('');
    setShowRetry(false);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: window.location.href,
        },
        redirect: 'if_required',
      });

      if (error) {
        const errorType = mapStripeError(error);
        setErrorMessage(getErrorMessage(errorType, localize));
        setShowRetry(isRetryable(errorType));
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        onSuccess(paymentIntent);
      } else {
        setErrorMessage((localize as any)('com_custom_tokens_buy_error_generic'));
        setShowRetry(true);
      }
    } catch (err) {
      console.error('Payment error:', err);
      setErrorMessage((localize as any)('com_custom_tokens_buy_error_generic'));
      setShowRetry(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="p-3 sm:p-6">
        <div className="mb-4">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center text-sm text-text-secondary hover:text-text-primary"
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            {(localize as any)('com_custom_tokens_buy_button_back')}
          </button>
        </div>

        <div className="mb-6">
          {!isReady && (
            <div className="space-y-4">
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                <span className="ml-2 text-text-secondary">
                  {(localize as any)('com_custom_tokens_buy_loading_form')}
                </span>
              </div>
              <div className="h-12 animate-pulse rounded-md bg-surface-tertiary"></div>
              <div className="h-12 animate-pulse rounded-md bg-surface-tertiary"></div>
              <div className="h-12 animate-pulse rounded-md bg-surface-tertiary"></div>
            </div>
          )}
          <div className={isReady ? 'block' : 'hidden'}>
            <PaymentElement
              onReady={() => setIsReady(true)}
              onLoadError={(error) => {
                console.error('Payment Element load error:', error);
                setErrorMessage((localize as any)('com_custom_tokens_buy_error_load_form'));
              }}
            />
          </div>
        </div>

        {errorMessage && (
          <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-500 dark:bg-red-900/20 dark:text-red-400">
            {errorMessage}
            {showRetry && (
              <p className="mt-2 text-xs">
                {(localize as any)('com_custom_tokens_buy_error_retry_hint')}
              </p>
            )}
          </div>
        )}
      </div>

      <div className="flex justify-end gap-2 border-t border-border-light px-4 py-3 sm:px-6 sm:py-4">
        <Button
          type="submit"
          variant="submit"
          className="bg-blue-600 px-4 hover:bg-blue-700"
          disabled={!stripe || !isReady || loading}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {(localize as any)('com_custom_tokens_buy_button_processing')}
            </>
          ) : (
            <>
              <CreditCard className="mr-2 h-4 w-4" />
              {(localize as any)('com_custom_tokens_buy_button_pay')}
            </>
          )}
        </Button>
      </div>
    </form>
  );
};
