/**
 * CUSTOM: gptchina fork
 *
 * Feature: Buy Tokens (Stripe Integration)
 * Created: 2025-11-09
 * Upstream Impact: None (standalone module)
 *
 * Modal component for token purchase flow.
 * NOTE: Full Stripe Elements integration requires:
 * - npm install @stripe/stripe-js @stripe/react-stripe-js
 * - VITE_STRIPE_PUBLIC_KEY environment variable
 */

import React, { useState, useEffect } from 'react';
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { TokenPackageCard } from './TokenPackageCard';
import { PaymentForm } from './PaymentForm';
import { useBuyTokens } from './useBuyTokens';
import { cn } from '~/utils';
import { useQueryClient } from '@tanstack/react-query';
import { TOKEN_PACKAGES } from '../shared/types';

// Initialize Stripe with public key from environment
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || '');

interface TokenPurchaseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const TokenPurchaseModal: React.FC<TokenPurchaseModalProps> = ({ open, onOpenChange }) => {
  const queryClient = useQueryClient();
  const { createPaymentIntent, isLoading, error, clientSecret, setError } = useBuyTokens();
  const [selectedPackageId, setSelectedPackageId] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<
    'idle' | 'selecting' | 'payment' | 'processing' | 'success' | 'error'
  >('idle');
  const [paymentAmount, setPaymentAmount] = useState<number>(0);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (open) {
      setPaymentStatus('selecting');
      setSelectedPackageId(null);
      setError(null);
    } else {
      setPaymentStatus('idle');
      setSelectedPackageId(null);
      setError(null);
    }
  }, [open, setError]);

  if (!open) {
    return null;
  }

  const closeModal = () => {
    if (paymentStatus === 'processing') {
      return; // Don't allow closing during payment
    }
    onOpenChange(false);
  };

  const selectedPackage = TOKEN_PACKAGES.find((pkg) => pkg.id === selectedPackageId);

  const handleContinueToPayment = async () => {
    if (!selectedPackageId) return;

    setPaymentStatus('processing');
    try {
      const response = await createPaymentIntent(selectedPackageId, 'card');
      setPaymentAmount(response.amount || 0);
      setPaymentStatus('payment');
    } catch (err) {
      setPaymentStatus('error');
    }
  };

  const handlePaymentSuccess = () => {
    setPaymentStatus('success');
    // Invalidate balance query to update displayed balance
    queryClient.invalidateQueries({ queryKey: ['balance'] });
    // Auto-close after 2 seconds
    setTimeout(() => {
      onOpenChange(false);
    }, 2000);
  };

  const handlePaymentError = (errorMessage: string) => {
    setError(errorMessage);
    setPaymentStatus('error');
  };

  const handleBackToSelection = () => {
    setPaymentStatus('selecting');
    setError(null);
  };

  return (
    <Transition appear show={open}>
      <Dialog as="div" className="relative z-50" onClose={closeModal}>
        <TransitionChild
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black opacity-50 dark:opacity-80" aria-hidden="true" />
        </TransitionChild>

        <TransitionChild
          enter="ease-out duration-200"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="ease-in duration-100"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <div className={cn('fixed inset-0 flex w-screen items-center justify-center p-4')}>
            <DialogPanel
              className={cn(
                'relative w-full max-w-4xl overflow-hidden rounded-xl bg-background p-6 shadow-2xl backdrop-blur-2xl',
              )}
            >
              <DialogTitle className="mb-4 flex items-center justify-between text-left" as="div">
                <div>
                  <h2 className="text-2xl font-bold text-text-primary">Buy Tokens</h2>
                  <p className="mt-1 text-sm text-text-secondary">
                    Select a token package to continue
                  </p>
                </div>
                <button
                  type="button"
                  className="rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-border-xheavy focus:ring-offset-2 disabled:pointer-events-none"
                  onClick={closeModal}
                  disabled={paymentStatus === 'processing'}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5 text-text-primary"
                  >
                    <line x1="18" x2="6" y1="6" y2="18"></line>
                    <line x1="6" x2="18" y1="6" y2="18"></line>
                  </svg>
                  <span className="sr-only">Close</span>
                </button>
              </DialogTitle>

              {/* Success State */}
              {paymentStatus === 'success' && (
                <div className="py-8 text-center">
                  <div className="mb-4 flex justify-center">
                    <div className="rounded-full bg-green-100 p-3 dark:bg-green-900/20">
                      <svg
                        className="h-12 w-12 text-green-600 dark:text-green-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                  </div>
                  <h3 className="mb-2 text-xl font-bold text-text-primary">Payment Successful!</h3>
                  <p className="text-text-secondary">
                    Your tokens have been added to your account.
                  </p>
                </div>
              )}

              {/* Error State */}
              {paymentStatus === 'error' && error && (
                <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
                  <p className="font-semibold text-red-800 dark:text-red-400">Payment Error</p>
                  <p className="mt-1 text-sm text-red-700 dark:text-red-300">{error}</p>
                  <button
                    onClick={handleBackToSelection}
                    className="mt-3 text-sm font-medium text-red-800 underline hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                  >
                    Try Again
                  </button>
                </div>
              )}

              {/* Package Selection */}
              {(paymentStatus === 'selecting' || paymentStatus === 'processing') && (
                <>
                  <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
                    {TOKEN_PACKAGES.map((pkg) => (
                      <TokenPackageCard
                        key={pkg.id}
                        package={pkg}
                        isSelected={selectedPackageId === pkg.id}
                        onSelect={setSelectedPackageId}
                      />
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-sm text-text-secondary">
                      {selectedPackage && (
                        <span>
                          Selected: <strong>{selectedPackage.label}</strong> for{' '}
                          <strong>¥{(selectedPackage.price / 100).toFixed(2)}</strong>
                        </span>
                      )}
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={closeModal}
                        disabled={paymentStatus === 'processing'}
                        className="rounded-lg border border-border-medium px-4 py-2 text-sm font-medium text-text-primary hover:bg-surface-hover disabled:opacity-50"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleContinueToPayment}
                        disabled={!selectedPackageId || paymentStatus === 'processing' || isLoading}
                        className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
                      >
                        {paymentStatus === 'processing' || isLoading ? (
                          <span className="flex items-center gap-2">
                            <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                                fill="none"
                              />
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              />
                            </svg>
                            Processing...
                          </span>
                        ) : (
                          'Continue to Payment'
                        )}
                      </button>
                    </div>
                  </div>
                </>
              )}

              {/* Payment Form */}
              {paymentStatus === 'payment' && clientSecret && (
                <div className="space-y-4">
                  <div className="mb-4 flex items-center gap-2">
                    <button
                      onClick={handleBackToSelection}
                      className="text-sm text-text-secondary hover:text-text-primary"
                    >
                      ← Back to packages
                    </button>
                  </div>
                  <Elements stripe={stripePromise}>
                    <PaymentForm
                      clientSecret={clientSecret}
                      amount={paymentAmount}
                      onSuccess={handlePaymentSuccess}
                      onError={handlePaymentError}
                      onCancel={handleBackToSelection}
                    />
                  </Elements>
                </div>
              )}
            </DialogPanel>
          </div>
        </TransitionChild>
      </Dialog>
    </Transition>
  );
};
