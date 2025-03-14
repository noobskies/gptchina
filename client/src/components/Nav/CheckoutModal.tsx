import { useState, useEffect } from 'react';
import { Check, CreditCard, X, ArrowLeft, Loader2 } from 'lucide-react';
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';
import { Button } from '~/components/ui/Button';
import { cn } from '~/utils';
import { useLocalize } from '~/hooks';
import { loadStripe } from '@stripe/stripe-js';
import { useGetUserBalance } from '~/data-provider';
import { useQueryClient } from '@tanstack/react-query';
import { QueryKeys } from 'librechat-data-provider';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
  AddressElement,
} from '@stripe/react-stripe-js';

// Payment method icons
import { FaCreditCard, FaWeixin, FaAlipay, FaBitcoin, FaGoogle, FaApple } from 'react-icons/fa';

// Initialize Stripe
const stripePromise = loadStripe(
  import.meta.env.VITE_APP_STRIPE_PUBLIC_KEY ||
    'pk_test_51MwvEEHKD0byXXClhlIY96bsuIIIcdGgTenVqBnktRp8fzoUHlcI29yTj9ktyqumu2Xk1uz7KptFryWfTZz5Sdj200f3cPZSa3',
);

const tokenPackages = [
  {
    id: '100k',
    tokens: '100k',
    price: '$1.50',
    originalPrice: null,
    discount: null,
  },
  {
    id: '500k',
    tokens: '500k',
    price: '$5.00',
    originalPrice: '$7.50',
    discount: '30% off',
  },
  {
    id: '1m',
    tokens: '1 Million',
    price: '$7.50',
    originalPrice: '$15.00',
    discount: '50% off',
  },
  {
    id: '10m',
    tokens: '10 Million',
    price: '$40.00',
    originalPrice: '$150.00',
    discount: '75% off',
  },
];

const paymentMethods = [
  { id: 'card', name: 'Credit Card', icon: <FaCreditCard /> },
  { id: 'wechat', name: 'WeChat Pay', icon: <FaWeixin /> },
  { id: 'alipay', name: 'AliPay', icon: <FaAlipay /> },
  { id: 'bitcoin', name: 'Bitcoin', icon: <FaBitcoin /> },
  { id: 'google', name: 'Google Pay', icon: <FaGoogle /> },
  { id: 'apple', name: 'Apple Pay', icon: <FaApple /> },
];

// Payment form component
const CheckoutForm = ({ selectedPackage, selectedPayment, onSuccess, onBack, localize }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: window.location.href,
        },
        redirect: 'if_required',
      });

      if (error) {
        setErrorMessage(error.message || 'An error occurred with your payment');
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        onSuccess(paymentIntent);
      } else {
        setErrorMessage('Payment failed. Please try again.');
      }
    } catch (err) {
      console.error('Payment error:', err);
      setErrorMessage('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="p-4 sm:p-6">
        <div className="mb-4">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center text-sm text-text-secondary hover:text-text-primary"
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            {localize('com_ui_back')}
          </button>
        </div>

        <div className="mb-6">
          <PaymentElement
            options={{
              defaultValues: {
                billingDetails: {},
              },
              // Set payment method options based on the selected payment method
              paymentMethodOrder: (() => {
                // Map payment method to Stripe payment method type
                let primaryMethod = 'card';
                if (selectedPayment === 'google') {
                  primaryMethod = 'google_pay';
                } else if (selectedPayment === 'apple') {
                  primaryMethod = 'apple_pay';
                } else if (selectedPayment === 'wechat') {
                  primaryMethod = 'wechat_pay';
                } else if (selectedPayment === 'alipay') {
                  primaryMethod = 'alipay';
                } else if (selectedPayment === 'bitcoin') {
                  primaryMethod = 'card'; // Bitcoin uses card payment method
                }
                // Return array with primary method first, then card as fallback
                return [primaryMethod, 'card'];
              })(),
            }}
          />
        </div>

        <div className="mb-6">
          <AddressElement options={{ mode: 'billing' }} />
        </div>

        {errorMessage && (
          <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-500 dark:bg-red-900/20 dark:text-red-400">
            {errorMessage}
          </div>
        )}
      </div>

      <div className="flex justify-end gap-2 border-t border-border-light px-4 py-3 sm:px-6 sm:py-4">
        <Button type="submit" variant="submit" className="px-4" disabled={!stripe || loading}>
          {loading ? (
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
    </form>
  );
};

// Receipt component
const ReceiptView = ({ paymentIntent, selectedPackage, onClose, localize }) => {
  const packageDetails = tokenPackages.find((pkg) => pkg.id === selectedPackage);

  return (
    <>
      <div className="p-4 sm:p-6">
        <div className="rounded-lg border border-border-light bg-surface-tertiary p-4">
          <h3 className="mb-2 text-lg font-medium text-text-primary">
            {localize('com_checkout_purchase')}
          </h3>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-text-secondary">{localize('com_checkout_amount')}:</span>
              <span className="font-medium text-text-primary">{packageDetails?.price}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">{localize('com_checkout_tokens')}:</span>
              <span className="font-medium text-text-primary">{packageDetails?.tokens}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">{localize('com_checkout_payment_id')}:</span>
              <span className="font-medium text-text-primary">
                {paymentIntent?.id?.substring(0, 16)}...
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">{localize('com_checkout_date')}:</span>
              <span className="font-medium text-text-primary">
                {new Date().toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2 border-t border-border-light px-4 py-3 sm:px-6 sm:py-4">
        <Button variant="submit" onClick={onClose} className="px-4">
          {localize('com_ui_close')}
        </Button>
      </div>
    </>
  );
};

interface CheckoutModalProps {
  open: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

const CheckoutModal = ({ open, onOpenChange }: CheckoutModalProps) => {
  const [selectedPackage, setSelectedPackage] = useState(tokenPackages[3].id); // Default to 10 Million
  const [selectedPayment, setSelectedPayment] = useState('card'); // Default to Credit Card
  const [step, setStep] = useState('select'); // 'select', 'payment', 'receipt'
  const [paymentIntent, setPaymentIntent] = useState(null);
  const [clientSecret, setClientSecret] = useState('');
  const localize = useLocalize();

  // Get query client for refetching balance
  const queryClient = useQueryClient();

  // Get user balance and ability to refetch it
  const { refetch: refetchBalance } = useGetUserBalance();

  // Reset state when modal is closed
  useEffect(() => {
    if (!open) {
      // Wait for the modal close animation to finish before resetting
      const timer = setTimeout(() => {
        setStep('select');
        setPaymentIntent(null);
        setClientSecret('');
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [open]);

  const handlePurchase = async () => {
    try {
      // Get the selected package details
      const packageDetails = tokenPackages.find((pkg) => pkg.id === selectedPackage);
      if (!packageDetails) {
        return;
      }

      // Import the request module
      const { request } = await import('librechat-data-provider');

      // Create a payment intent on the server
      const data = await request.post('/api/stripe/create-payment-intent', {
        packageId: selectedPackage,
        amount: parseFloat(packageDetails.price.replace('$', '')),
        paymentMethod: selectedPayment,
      });
      setClientSecret(data.clientSecret);
      setStep('payment');
    } catch (error) {
      console.error('Error creating payment intent:', error);
      // Show error message to user
    }
  };

  const handlePaymentSuccess = (paymentIntentResult) => {
    setPaymentIntent(paymentIntentResult);
    setStep('receipt');

    // First immediate refresh attempt
    refetchBalance();
    queryClient.invalidateQueries([QueryKeys.balance]);

    // Second attempt after 1 second
    setTimeout(() => {
      refetchBalance();
      queryClient.invalidateQueries([QueryKeys.balance]);
    }, 1000);

    // Third attempt after 3 seconds
    setTimeout(() => {
      refetchBalance();
      queryClient.invalidateQueries([QueryKeys.balance]);
    }, 3000);
  };

  // Refresh balance when receipt is shown with multiple attempts
  useEffect(() => {
    if (step === 'receipt') {
      // Initial refresh
      refetchBalance();
      queryClient.invalidateQueries([QueryKeys.balance]);

      // Set up delayed refreshes
      const timer1 = setTimeout(() => {
        refetchBalance();
        queryClient.invalidateQueries([QueryKeys.balance]);
      }, 1500);

      const timer2 = setTimeout(() => {
        refetchBalance();
        queryClient.invalidateQueries([QueryKeys.balance]);
      }, 3500);

      // Cleanup function to clear timeouts if component unmounts
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    }
  }, [step, refetchBalance, queryClient]);

  const handleClose = () => {
    onOpenChange(false);
  };

  const renderStepContent = () => {
    switch (step) {
      case 'payment': {
        if (!clientSecret) {
          return (
            <div className="p-4 text-center">
              <Loader2 className="mx-auto h-8 w-8 animate-spin" />
            </div>
          );
        }

        // Map our payment method IDs to Stripe payment method types
        const paymentMethodMap = {
          card: 'card',
          google: 'google_pay',
          apple: 'apple_pay',
          wechat: 'wechat_pay',
          alipay: 'alipay',
        };

        // Get the Stripe payment method type from our internal ID
        const defaultPaymentMethod = paymentMethodMap[selectedPayment] || 'card';

        return (
          <Elements
            stripe={stripePromise}
            options={{
              clientSecret,
              appearance: {
                theme: 'night' as const,
                variables: {
                  colorPrimary: '#0066FF',
                  colorBackground: '#1F2937',
                  colorText: '#F9FAFB',
                  colorDanger: '#EF4444',
                  fontFamily:
                    'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                  spacingUnit: '4px',
                  borderRadius: '8px',
                },
                rules: {
                  '.Input': {
                    color: '#F9FAFB',
                    backgroundColor: '#374151',
                    borderColor: '#4B5563',
                  },
                  '.Input:focus': {
                    borderColor: '#0066FF',
                  },
                  '.Label': {
                    color: '#D1D5DB',
                  },
                },
              },
              // Note: We would ideally set the default payment method here,
              // but we'll rely on the Stripe Elements UI to handle this
            }}
          >
            <CheckoutForm
              selectedPackage={selectedPackage}
              selectedPayment={selectedPayment}
              onSuccess={handlePaymentSuccess}
              onBack={() => setStep('select')}
              localize={localize}
            />
          </Elements>
        );
      }

      case 'receipt': {
        return (
          <ReceiptView
            paymentIntent={paymentIntent}
            selectedPackage={selectedPackage}
            onClose={handleClose}
            localize={localize}
          />
        );
      }

      case 'select':
      default: {
        return (
          <>
            <div className="p-4 sm:p-6">
              {/* Token Packages */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {tokenPackages.map((pkg) => (
                  <div
                    key={pkg.id}
                    className={cn(
                      'relative cursor-pointer rounded-lg p-4 transition-all',
                      selectedPackage === pkg.id
                        ? 'border border-border-light bg-surface-tertiary'
                        : 'border border-border-light hover:border-border-medium',
                    )}
                    onClick={() => setSelectedPackage(pkg.id)}
                  >
                    {selectedPackage === pkg.id && (
                      <div className="absolute right-2 top-2 text-text-primary">
                        <Check size={16} />
                      </div>
                    )}
                    <div className="text-lg font-bold text-text-primary">{pkg.tokens}</div>
                    <div className="text-sm text-text-secondary">
                      {localize('com_checkout_tokens')}
                    </div>
                    <div className="mt-2 text-lg font-bold text-text-primary">{pkg.price}</div>
                    {pkg.originalPrice && (
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-text-tertiary line-through">
                          {pkg.originalPrice}
                        </span>
                        <span className="rounded bg-blue-800 px-1.5 py-0.5 text-xs text-white">
                          {pkg.discount}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Payment Methods */}
              <div className="mt-6">
                <h3 className="mb-3 text-sm font-medium text-text-secondary">
                  {localize('com_checkout_select_payment')}
                </h3>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {paymentMethods.map((method) => (
                    <div
                      key={method.id}
                      className={cn(
                        'flex cursor-pointer items-center gap-2 rounded-lg p-3 transition-all',
                        selectedPayment === method.id
                          ? 'border border-border-light bg-surface-tertiary'
                          : 'border border-border-light hover:border-border-medium',
                      )}
                      onClick={() => setSelectedPayment(method.id)}
                    >
                      <div className="text-lg text-text-primary">{method.icon}</div>
                      <div className="text-text-primary">{method.name}</div>
                      {selectedPayment === method.id && (
                        <div className="ml-auto text-text-primary">
                          <Check size={16} />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 border-t border-border-light px-4 py-3 sm:px-6 sm:py-4">
              <Button variant="outline" onClick={handleClose} className="px-4">
                {localize('com_ui_cancel')}
              </Button>
              <Button variant="submit" onClick={handlePurchase} className="px-4">
                <CreditCard className="mr-2 h-4 w-4" />
                {localize('com_checkout_purchase')}
              </Button>
            </div>
          </>
        );
      }
    }
  };

  return (
    <Transition appear show={open}>
      <Dialog
        as="div"
        className="relative z-50"
        onClose={step === 'receipt' ? () => {} : onOpenChange}
      >
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
          <div className="fixed inset-0 flex w-screen items-center justify-center p-2 sm:p-4">
            <DialogPanel className="max-h-[90vh] w-full overflow-auto rounded-xl bg-background shadow-2xl backdrop-blur-2xl animate-in sm:max-w-lg sm:rounded-2xl md:max-h-fit md:max-w-xl">
              <DialogTitle
                className="mb-1 flex items-center justify-between p-4 pb-0 text-left sm:p-6"
                as="div"
              >
                <div>
                  <h2 className="text-lg font-medium leading-6 text-text-primary">
                    {step === 'receipt'
                      ? localize('com_checkout_buy_tokens')
                      : step === 'payment'
                        ? localize('com_checkout_buy_tokens')
                        : localize('com_checkout_buy_tokens')}
                  </h2>
                  {step !== 'receipt' && step !== 'payment' && (
                    <p className="mt-1 text-sm text-text-secondary">
                      {localize('com_checkout_select_package')}
                    </p>
                  )}
                </div>
                {step !== 'payment' && (
                  <button
                    type="button"
                    className="rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-border-xheavy focus:ring-offset-2 disabled:pointer-events-none"
                    onClick={handleClose}
                  >
                    <X className="h-5 w-5 text-text-primary" />
                    <span className="sr-only">{localize('com_ui_close')}</span>
                  </button>
                )}
              </DialogTitle>

              {renderStepContent()}
            </DialogPanel>
          </div>
        </TransitionChild>
      </Dialog>
    </Transition>
  );
};

export default CheckoutModal;
