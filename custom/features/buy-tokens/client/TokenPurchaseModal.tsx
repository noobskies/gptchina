/**
 * CUSTOM: gptchina fork
 *
 * Feature: Buy Tokens (Stripe Integration)
 * Created: 2025-11-09
 * Updated: 2025-11-09 - Refactored into modular components
 * Upstream Impact: None (standalone module)
 *
 * Main modal orchestrator for token purchase flow.
 */

import React, { useState, useEffect, useMemo, useContext } from 'react';
import { X, CreditCard, Loader2 } from 'lucide-react';
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';
import { Button, ThemeContext, isDark } from '@librechat/client';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { useQueryClient } from '@tanstack/react-query';
import { QueryKeys } from 'librechat-data-provider';
import { TOKEN_PACKAGES } from '../shared/types';
import { getStripeAppearance } from './config/stripeConfig';
import { PackageSelection } from './components/PackageSelection';
import { PaymentMethodSelector } from './components/PaymentMethodSelector';
import { PaymentForm } from './components/PaymentForm';
import { PurchaseReceipt } from './components/PurchaseReceipt';
import { useBuyTokens } from './useBuyTokens';

// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || '');

interface TokenPurchaseModalProps {
  open: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export const TokenPurchaseModal: React.FC<TokenPurchaseModalProps> = ({ open, onOpenChange }) => {
  // State management
  const [step, setStep] = useState<'select' | 'payment' | 'receipt'>('select');
  const [selectedPackage, setSelectedPackage] = useState('package_500k'); // Default to Popular
  const [selectedPayment, setSelectedPayment] = useState('card');
  const [paymentIntent, setPaymentIntent] = useState(null);

  // Hooks
  const { createPaymentIntent, isLoading, error, clientSecret, setError } = useBuyTokens();
  const queryClient = useQueryClient();
  const { theme } = useContext(ThemeContext);

  // Compute dark mode
  const isDarkMode = useMemo(() => isDark(theme), [theme]);

  // Stripe appearance configuration
  const stripeAppearance = useMemo(() => getStripeAppearance(isDarkMode), [isDarkMode]);

  // Reset state when modal closes
  useEffect(() => {
    if (!open) {
      const timer = setTimeout(() => {
        setStep('select');
        setPaymentIntent(null);
        setError(null);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [open, setError]);

  // Handlers
  const handlePurchase = async () => {
    try {
      await createPaymentIntent(selectedPackage, selectedPayment);
      setStep('payment');
    } catch (err) {
      console.error('Error creating payment intent:', err);
    }
  };

  const handlePaymentSuccess = (paymentIntentResult: any) => {
    setPaymentIntent(paymentIntentResult);
    setStep('receipt');

    // Refresh balance multiple times to ensure update
    queryClient.invalidateQueries([QueryKeys.balance]);
    setTimeout(() => queryClient.invalidateQueries([QueryKeys.balance]), 1000);
    setTimeout(() => queryClient.invalidateQueries([QueryKeys.balance]), 3000);
  };

  const handleClose = () => {
    onOpenChange(false);
  };

  // Render step content
  const renderStepContent = () => {
    switch (step) {
      case 'payment':
        if (!clientSecret) {
          return (
            <div className="p-4 text-center">
              <Loader2 className="mx-auto h-8 w-8 animate-spin" />
              <p className="mt-4 text-text-secondary">Preparing payment...</p>
            </div>
          );
        }
        return (
          <Elements stripe={stripePromise} options={{ clientSecret, appearance: stripeAppearance }}>
            <PaymentForm
              selectedPackage={selectedPackage}
              onSuccess={handlePaymentSuccess}
              onBack={() => setStep('select')}
            />
          </Elements>
        );

      case 'receipt':
        return (
          <PurchaseReceipt
            paymentIntent={paymentIntent}
            selectedPackage={selectedPackage}
            onClose={handleClose}
          />
        );

      case 'select':
      default:
        return (
          <>
            <div className="p-3 sm:p-6">
              {/* Package Selection */}
              <PackageSelection
                packages={TOKEN_PACKAGES}
                selectedPackage={selectedPackage}
                onSelectPackage={setSelectedPackage}
              />

              {/* Payment Method Selection */}
              <PaymentMethodSelector
                selectedMethod={selectedPayment}
                onSelectMethod={setSelectedPayment}
              />

              {/* Error Display */}
              {error && (
                <div className="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-500 dark:bg-red-900/20 dark:text-red-400">
                  {error}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between border-t border-border-light bg-background px-4 py-3 sm:justify-end sm:gap-2 sm:px-6 sm:py-4">
              <Button variant="outline" onClick={handleClose} className="w-1/3 sm:w-auto sm:px-4">
                Cancel
              </Button>
              <Button
                variant="submit"
                onClick={handlePurchase}
                className="ml-2 w-2/3 bg-blue-600 hover:bg-blue-700 sm:w-auto sm:px-4"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="mr-2 h-4 w-4" />
                    Purchase
                  </>
                )}
              </Button>
            </div>
          </>
        );
    }
  };

  // Step titles
  const getStepTitle = () => {
    switch (step) {
      case 'receipt':
        return 'Purchase Complete';
      case 'payment':
        return 'Complete Payment';
      default:
        return 'Buy Tokens';
    }
  };

  const getStepDescription = () => {
    if (step === 'select') {
      return 'Select a package and payment method';
    }
    return null;
  };

  return (
    <Transition appear show={open}>
      <Dialog
        as="div"
        className="relative z-50"
        onClose={step === 'receipt' ? () => {} : onOpenChange}
      >
        {/* Backdrop */}
        <TransitionChild
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50 dark:bg-black/80" aria-hidden="true" />
        </TransitionChild>

        {/* Modal */}
        <TransitionChild
          enter="ease-out duration-200"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="ease-in duration-100"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <DialogPanel className="w-full max-w-lg overflow-hidden rounded-2xl bg-background shadow-2xl">
              {/* Header */}
              <DialogTitle
                className="flex items-center justify-between border-b border-border-light bg-background p-4 sm:p-6"
                as="div"
              >
                <div>
                  <h2 className="text-lg font-medium leading-6 text-text-primary">
                    {getStepTitle()}
                  </h2>
                  {getStepDescription() && (
                    <p className="mt-1 text-sm text-text-secondary">{getStepDescription()}</p>
                  )}
                </div>
                {step !== 'payment' && (
                  <button
                    type="button"
                    className="rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-border-xheavy focus:ring-offset-2 disabled:pointer-events-none"
                    onClick={handleClose}
                  >
                    <X className="h-5 w-5 text-text-primary" />
                    <span className="sr-only">Close</span>
                  </button>
                )}
              </DialogTitle>

              {/* Content */}
              <div className="max-h-[calc(90vh-8rem)] overflow-y-auto">{renderStepContent()}</div>
            </DialogPanel>
          </div>
        </TransitionChild>
      </Dialog>
    </Transition>
  );
};
