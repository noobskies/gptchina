import { useState, useEffect } from 'react';
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';
import { Capacitor } from '@capacitor/core';
import { CreditCard, Loader2, Check, X, ArrowLeft } from 'lucide-react';
import { Button } from '~/components/ui/Button';
import { cn } from '~/utils';
import { useLocalize } from '~/hooks';
import { useGetUserBalance } from '~/data-provider';
import { useAuthContext } from '~/hooks/AuthContext';
import { useQueryClient } from '@tanstack/react-query';
import { QueryKeys } from 'librechat-data-provider';
import { revenueCatService } from '~/services/RevenueCatService';

interface MobileCheckoutModalProps {
  open: boolean;
  onOpenChange: (isOpen: boolean) => void;
  reason?: 'insufficient_funds' | 'manual' | null;
  details?: {
    balance?: number;
    requiredTokens?: number;
    cost?: number;
  } | null;
}

// Define interfaces for token packages
interface TokenPackage {
  id: string;
  tokens: string;
  price: number;
  originalPrice: number | null;
  discount: string | null;
  priceDisplay?: string;
  originalPriceDisplay?: string | null;
}

// Token package definitions (matching existing ones)
const tokenPackages: TokenPackage[] = [
  {
    id: '100k',
    tokens: '100k',
    price: 1.5,
    originalPrice: null,
    discount: null,
    priceDisplay: '$1.50',
  },
  {
    id: '500k',
    tokens: '500k',
    price: 5.0,
    originalPrice: 7.5,
    discount: '30% off',
    priceDisplay: '$5.00',
    originalPriceDisplay: '$7.50',
  },
  {
    id: '1m',
    tokens: '1 Million',
    price: 7.5,
    originalPrice: 15.0,
    discount: '50% off',
    priceDisplay: '$7.50',
    originalPriceDisplay: '$15.00',
  },
  {
    id: '10m',
    tokens: '10 Million',
    price: 40.0,
    originalPrice: 150.0,
    discount: '75% off',
    priceDisplay: '$40.00',
    originalPriceDisplay: '$150.00',
  },
];

const MobileCheckoutModal = ({ open, onOpenChange, reason, details }: MobileCheckoutModalProps) => {
  const [selectedPackage, setSelectedPackage] = useState('10m');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [purchaseComplete, setPurchaseComplete] = useState(false);
  const [offerings, setOfferings] = useState<any>(null);

  const { user } = useAuthContext();
  const { refetch: refetchBalance } = useGetUserBalance();
  const queryClient = useQueryClient();
  const localize = useLocalize();

  // Load offerings when the modal opens
  useEffect(() => {
    if (open && user?.id) {
      loadOfferings();
    }
  }, [open, user?.id]);

  const loadOfferings = async () => {
    try {
      const offeringsData = await revenueCatService.getOfferings();
      setOfferings(offeringsData);
    } catch (err) {
      console.error('Failed to load offerings', err);
      setError('Failed to load available purchases');
    }
  };

  const handlePurchase = async () => {
    setIsLoading(true);
    setError('');

    try {
      // Make purchase through RevenueCat
      const purchaseResult = await revenueCatService.purchasePackage(selectedPackage);

      // Verify purchase on backend to credit tokens
      const { request } = await import('librechat-data-provider');
      await request.post('/api/revenuecat/verify-purchase', {
        packageId: `tokens_${selectedPackage}`,
        platform: Capacitor.getPlatform(),
      });
      setPurchaseComplete(true);

      // Refresh user balance
      refetchBalance();
      queryClient.invalidateQueries([QueryKeys.balance]);

      // Refresh again after short delay
      setTimeout(() => {
        refetchBalance();
        queryClient.invalidateQueries([QueryKeys.balance]);
      }, 2000);
    } catch (err: any) {
      console.error('Purchase failed', err);
      setError(err instanceof Error ? err.message : 'Purchase failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    // Reset state for next time
    setTimeout(() => {
      setPurchaseComplete(false);
      setError('');
    }, 300);
  };

  // Render receipt view if purchase is complete
  if (purchaseComplete) {
    const packageDetails = tokenPackages.find((pkg) => pkg.id === selectedPackage);

    return (
      <Transition appear show={open}>
        <Dialog as="div" className="relative z-50" onClose={handleClose}>
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
            <div className="fixed inset-0 flex w-screen items-start justify-center">
              <DialogPanel className="h-full w-full overflow-auto bg-background shadow-2xl backdrop-blur-2xl animate-in">
                <DialogTitle
                  className="sticky top-0 z-10 flex items-center justify-between border-b border-border-light bg-background p-4 text-left"
                  as="div"
                >
                  <div>
                    <h2 className="pt-6 text-lg font-medium leading-6 text-text-primary">
                      {localize('com_checkout_receipt')}
                    </h2>
                  </div>
                  <button
                    type="button"
                    className="rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-border-xheavy focus:ring-offset-2 disabled:pointer-events-none"
                    onClick={handleClose}
                  >
                    <X className="h-5 w-5 text-text-primary" />
                    <span className="sr-only">{localize('com_ui_close')}</span>
                  </button>
                </DialogTitle>

                <div className="p-3 pb-20">
                  <div className="rounded-lg border border-border-light bg-surface-tertiary p-4">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-text-secondary">
                          {localize('com_checkout_tokens')}:
                        </span>
                        <span className="font-medium text-text-primary">
                          {packageDetails?.tokens}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-secondary">
                          {localize('com_checkout_date')}:
                        </span>
                        <span className="font-medium text-text-primary">
                          {new Date().toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="fixed bottom-0 left-0 right-0 flex justify-between border-t border-border-light bg-background px-4 py-3 sm:px-6 sm:py-4">
                  <Button
                    variant="submit"
                    onClick={handleClose}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    {localize('com_ui_close')}
                  </Button>
                </div>
              </DialogPanel>
            </div>
          </TransitionChild>
        </Dialog>
      </Transition>
    );
  }

  // Main purchase view
  return (
    <Transition appear show={open}>
      <Dialog as="div" className="relative z-50" onClose={handleClose}>
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
          <div className="fixed inset-0 flex w-screen items-start justify-center">
            <DialogPanel className="h-full w-full overflow-auto bg-background shadow-2xl backdrop-blur-2xl animate-in">
              <DialogTitle
                className="sticky top-0 z-10 flex items-center justify-between border-b border-border-light bg-background p-4 text-left"
                as="div"
              >
                <div>
                  <h2 className="pt-6 text-lg font-medium leading-6 text-text-primary">
                    {localize('com_checkout_buy_tokens')}
                  </h2>
                  <p className="mt-1 text-sm text-text-secondary">
                    {localize('com_checkout_select_package')}
                  </p>
                </div>
                <button
                  type="button"
                  className="rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-border-xheavy focus:ring-offset-2 disabled:pointer-events-none"
                  onClick={handleClose}
                >
                  <X className="h-5 w-5 text-text-primary" />
                  <span className="sr-only">{localize('com_ui_close')}</span>
                </button>
              </DialogTitle>

              {/* Insufficient funds message */}
              {reason === 'insufficient_funds' && details && (
                <div className="mx-4 mb-4 rounded-md border border-amber-300 bg-amber-50 p-3 dark:border-amber-700 dark:bg-amber-900/30">
                  <h3 className="font-medium text-amber-800 dark:text-amber-400">
                    {localize('com_ui_insufficient_funds')}
                  </h3>
                  <p className="mt-1 text-sm text-amber-700 dark:text-amber-300">
                    {localize('com_checkout_insufficient_funds_message', {
                      balance: details.balance?.toLocaleString() || '0',
                      cost: details.cost?.toLocaleString() || '0',
                    })}
                  </p>
                </div>
              )}

              {/* Token packages */}
              <div className="p-3 pb-20">
                <div className="grid grid-cols-2 gap-3">
                  {tokenPackages.map((pkg) => (
                    <div
                      key={pkg.id}
                      className={cn(
                        'relative cursor-pointer rounded-lg border p-3 transition-all',
                        selectedPackage === pkg.id
                          ? 'border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-900/20'
                          : 'border-gray-200 hover:border-blue-300 dark:border-gray-700',
                      )}
                      onClick={() => setSelectedPackage(pkg.id)}
                    >
                      {selectedPackage === pkg.id && (
                        <div className="absolute right-2 top-2 text-blue-600 dark:text-blue-400">
                          <Check size={14} />
                        </div>
                      )}
                      <div className="text-base font-bold text-text-primary">{pkg.tokens}</div>
                      <div className="text-xs text-text-secondary">
                        {localize('com_checkout_tokens')}
                      </div>
                      <div className="mt-1 text-base font-bold text-text-primary">
                        {pkg.priceDisplay}
                      </div>
                      {pkg.originalPrice && (
                        <div className="flex items-center gap-1">
                          <span className="text-xs text-text-tertiary line-through">
                            {pkg.originalPriceDisplay}
                          </span>
                          <span className="rounded bg-blue-800 px-1 py-0.5 text-xs text-white">
                            {pkg.discount}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {error && (
                  <div className="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-500 dark:bg-red-900/20 dark:text-red-400">
                    {error}
                  </div>
                )}
              </div>

              {/* Action buttons */}
              <div className="fixed bottom-0 left-0 right-0 flex justify-between border-t border-border-light bg-background px-4 py-3 sm:px-6 sm:py-4">
                <Button variant="outline" onClick={handleClose} className="w-1/3">
                  {localize('com_ui_cancel')}
                </Button>
                <Button
                  variant="submit"
                  onClick={handlePurchase}
                  className="ml-2 w-2/3 bg-blue-600 hover:bg-blue-700"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {localize('com_ui_processing')}
                    </>
                  ) : (
                    <>
                      <CreditCard className="mr-2 h-4 w-4" />
                      {localize('com_checkout_purchase')}
                    </>
                  )}
                </Button>
              </div>
            </DialogPanel>
          </div>
        </TransitionChild>
      </Dialog>
    </Transition>
  );
};

export default MobileCheckoutModal;
