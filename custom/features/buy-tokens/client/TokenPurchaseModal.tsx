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
import { TokenPackageCard } from './TokenPackageCard';
import { useBuyTokens } from './useBuyTokens';

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

export const TokenPurchaseModal: React.FC = () => {
  const { isModalOpen, closeModal, createPaymentIntent, isLoading, error } = useBuyTokens();
  const [selectedPackageId, setSelectedPackageId] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'error'>(
    'idle',
  );

  if (!isModalOpen) {
    return null;
  }

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="relative w-full max-w-4xl rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800">
        {/* Close button */}
        <button
          onClick={closeModal}
          disabled={paymentStatus === 'processing'}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          aria-label="Close modal"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Modal content */}
        <div className="mb-4">
          <h2 className="text-2xl font-bold">Buy Tokens</h2>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Select a token package to continue
          </p>
        </div>

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

        {/* Token packages grid */}
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

        {/* Purchase button */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600 dark:text-gray-400">
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
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50 disabled:opacity-50 dark:border-gray-600 dark:hover:bg-gray-700"
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
      </div>
    </div>
  );
};
