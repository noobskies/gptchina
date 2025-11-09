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

import React, { useState } from 'react';
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';
import { TokenPackageCard } from './TokenPackageCard';
import { useBuyTokens } from './useBuyTokens';
import { cn } from '~/utils';

interface TokenPurchaseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Import constants
const TOKEN_PACKAGES = [
  {
    id: 'package_100k',
    tokens: 100000,
    price: 1000,
    originalPrice: null,
    discount: null,
    popular: false,
    label: '100K Tokens',
  },
  {
    id: 'package_500k',
    tokens: 500000,
    price: 3500,
    originalPrice: 5000,
    discount: 30,
    popular: true,
    label: '500K Tokens',
  },
  {
    id: 'package_1m',
    tokens: 1000000,
    price: 5500,
    originalPrice: 10000,
    discount: 45,
    popular: false,
    label: '1M Tokens',
  },
  {
    id: 'package_10m',
    tokens: 10000000,
    price: 28000,
    originalPrice: 100000,
    discount: 72,
    popular: false,
    label: '10M Tokens',
  },
];

export const TokenPurchaseModal: React.FC<TokenPurchaseModalProps> = ({ open, onOpenChange }) => {
  const { createPaymentIntent, isLoading, error } = useBuyTokens();
  const [selectedPackageId, setSelectedPackageId] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'error'>(
    'idle',
  );

  if (!open) {
    return null;
  }

  const closeModal = () => onOpenChange(false);

  const selectedPackage = TOKEN_PACKAGES.find((pkg) => pkg.id === selectedPackageId);

  const handlePurchase = async () => {
    if (!selectedPackageId) return;

    setPaymentStatus('processing');
    try {
      await createPaymentIntent(selectedPackageId, 'card');

      // TODO: Integrate Stripe Elements here
      // For now, show a placeholder message
      setPaymentStatus('error');
    } catch (err) {
      setPaymentStatus('error');
    }
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

              {paymentStatus === 'error' && (
                <div className="mb-4 rounded-lg bg-red-50 p-4 text-red-800 dark:bg-red-900/20 dark:text-red-400">
                  <p className="font-semibold">Stripe Integration Required</p>
                  <p className="mt-1 text-sm">To complete the payment integration, please:</p>
                  <ul className="mt-2 list-inside list-disc text-sm">
                    <li>
                      Install Stripe packages: npm install @stripe/stripe-js @stripe/react-stripe-js
                      stripe
                    </li>
                    <li>Add VITE_STRIPE_PUBLIC_KEY to .env file</li>
                    <li>Add STRIPE_SECRET_KEY and STRIPE_WEBHOOK_SECRET to backend .env</li>
                    <li>Configure Stripe webhook endpoint</li>
                  </ul>
                  {error && <p className="mt-2 text-sm">Error: {error}</p>}
                </div>
              )}

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
                    className="rounded-lg border border-border-medium px-4 py-2 text-sm font-medium hover:bg-surface-hover disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handlePurchase}
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
            </DialogPanel>
          </div>
        </TransitionChild>
      </Dialog>
    </Transition>
  );
};
