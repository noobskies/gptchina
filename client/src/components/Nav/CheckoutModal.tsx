import { useState, useEffect, useMemo, useCallback, useContext } from 'react';
import { Check, CreditCard, X, ArrowLeft, Loader2 } from 'lucide-react';
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';
import { Button } from '~/components/ui/Button';
import { cn } from '~/utils';
import { useLocalize } from '~/hooks';
import { ThemeContext, isDark } from '~/hooks/ThemeContext';
import { loadStripe } from '@stripe/stripe-js';
import { useGetUserBalance } from '~/data-provider';
import { useQueryClient } from '@tanstack/react-query';
import { QueryKeys } from 'librechat-data-provider';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { getSiteConfig } from '~/utils/siteConfig';

// Payment method icons
import { FaCreditCard, FaWeixin, FaAlipay, FaBitcoin, FaGoogle, FaApple } from 'react-icons/fa';

// Initialize Stripe
const stripePromise = loadStripe(
  import.meta.env.REACT_APP_STRIPE_PUBLIC_KEY ||
    'pk_live_51MwvEEHKD0byXXCl8IzAvUl0oZ7RE6vIz72lWUVYl5rW3zy0u3FiGtIAgsbmqSHbhkTJeZjs5VEbQMNStaaQL9xQ001pwxI3RP',
);

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

// Default token packages if site configuration is not available
const defaultTokenPackages: TokenPackage[] = [
  {
    id: '100k',
    tokens: '100k',
    price: 1.5,
    originalPrice: null,
    discount: null,
  },
  {
    id: '500k',
    tokens: '500k',
    price: 5.0,
    originalPrice: 7.5,
    discount: '30% off',
  },
  {
    id: '1m',
    tokens: '1 Million',
    price: 7.5,
    originalPrice: 15.0,
    discount: '50% off',
  },
  {
    id: '10m',
    tokens: '10 Million',
    price: 40.0,
    originalPrice: 150.0,
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
          payment_method_data: {
            billing_details: {
              name: 'Anonymous User', // Provide a default name since we opted out of collecting it
              email: 'anonymous@example.com', // Provide a default email
              phone: '', // Empty string for phone
              address: {
                line1: '',
                line2: '',
                city: '',
                state: '',
                country: 'US', // Default to US
                postal_code: '00000', // Default postal code
              },
            },
          },
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
              fields: {
                billingDetails: {
                  // Only collect postal code, which is often required for fraud prevention
                  address: {
                    country: 'never',
                    line1: 'never',
                    line2: 'never',
                    city: 'never',
                    state: 'never',
                    postalCode: 'auto',
                  },
                  name: 'never',
                  email: 'never',
                  phone: 'never',
                },
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

        {errorMessage && (
          <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-500 dark:bg-red-900/20 dark:text-red-400">
            {errorMessage}
          </div>
        )}
      </div>

      <div className="flex justify-end gap-2 border-t border-border-light px-4 py-3 sm:px-6 sm:py-4">
        <Button
          type="submit"
          variant="submit"
          className="bg-blue-600 px-4 hover:bg-blue-700"
          disabled={!stripe || loading}
        >
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

// Receipt component props interface
interface ReceiptViewProps {
  paymentIntent: any;
  selectedPackage: string;
  onClose: () => void;
  localize: any;
  currencySymbol: string;
  tokenPackages: TokenPackage[];
}

// Receipt component
const ReceiptView = ({
  paymentIntent,
  selectedPackage,
  onClose,
  localize,
  currencySymbol,
  tokenPackages,
}: ReceiptViewProps) => {
  const packageDetails = tokenPackages.find((pkg) => pkg.id === selectedPackage);

  return (
    <>
      <div className="p-4 sm:p-6">
        <div className="rounded-lg border border-border-light bg-surface-tertiary p-4">
          <h3 className="mb-2 text-lg font-medium text-text-primary">
            {localize('com_checkout_receipt')}
          </h3>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-text-secondary">{localize('com_checkout_amount')}:</span>
              <span className="font-medium text-text-primary">{packageDetails?.priceDisplay}</span>
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
        <Button variant="submit" onClick={onClose} className="bg-blue-600 px-4 hover:bg-blue-700">
          {localize('com_ui_close')}
        </Button>
      </div>
    </>
  );
};

interface CheckoutModalProps {
  open: boolean;
  onOpenChange: (isOpen: boolean) => void;
  reason?: 'insufficient_funds' | 'manual' | null;
  details?: {
    balance?: number;
    requiredTokens?: number;
    cost?: number;
  } | null;
}

const CheckoutModal = ({ open, onOpenChange, reason, details }: CheckoutModalProps) => {
  // Get domain-specific pricing configuration
  const [domainConfig, setDomainConfig] = useState({
    tokenPackages: defaultTokenPackages,
    currencySymbol: '$',
    currency: 'USD',
    availablePaymentMethods: ['card', 'google', 'apple', 'bitcoin', 'wechat', 'alipay'],
  });

  const [selectedPackage, setSelectedPackage] = useState('10m'); // Default to 10 Million
  const [selectedPayment, setSelectedPayment] = useState('card'); // Default to Credit Card
  const [step, setStep] = useState('select'); // 'select', 'payment', 'receipt'
  const [paymentIntent, setPaymentIntent] = useState(null);
  const [clientSecret, setClientSecret] = useState('');
  const [isPurchaseLoading, setIsPurchaseLoading] = useState(false);
  const [isElementsLoading, setIsElementsLoading] = useState(true);
  const [purchaseError, setPurchaseError] = useState('');
  const localize = useLocalize();

  // Load the domain-specific configuration
  useEffect(() => {
    const hostname = window.location.hostname;
    const siteConfig = getSiteConfig(hostname);

    if (siteConfig.pricing) {
      const { pricing } = siteConfig;

      // Format prices for display
      const formattedPackages = pricing.tokenPackages.map((pkg) => ({
        ...pkg,
        priceDisplay: `${pricing.currencySymbol}${pkg.price.toFixed(2)}`,
        originalPriceDisplay: pkg.originalPrice
          ? `${pricing.currencySymbol}${pkg.originalPrice.toFixed(2)}`
          : null,
      }));

      // Set the domain config
      setDomainConfig({
        tokenPackages: formattedPackages,
        currencySymbol: pricing.currencySymbol,
        currency: pricing.currency,
        availablePaymentMethods: pricing.paymentMethods || [
          'card',
          'google',
          'apple',
          'bitcoin',
          'wechat',
          'alipay',
        ],
      });

      // Set default selected package (use the last one, typically the best value)
      if (formattedPackages.length > 0) {
        setSelectedPackage(formattedPackages[formattedPackages.length - 1].id);
      }
    }
  }, []);

  // Filter payment methods based on domain configuration
  const availablePaymentMethods = useMemo(() => {
    return paymentMethods.filter((method) =>
      domainConfig.availablePaymentMethods.includes(method.id),
    );
  }, [domainConfig.availablePaymentMethods]);

  // Get query client for refetching balance
  const queryClient = useQueryClient();

  // Get user balance and ability to refetch it
  const { refetch: refetchBalance } = useGetUserBalance();

  // Get theme from ThemeContext
  const { theme } = useContext(ThemeContext);

  // Determine if dark mode is active using the isDark helper from ThemeContext
  const isDarkMode = useMemo(() => {
    return isDark(theme);
  }, [theme]);

  // Configure Stripe appearance based on current theme - moved outside of conditional rendering
  const stripeAppearance = useMemo(() => {
    return {
      theme: (isDarkMode ? 'night' : 'stripe') as 'night' | 'stripe',
      labels: 'floating' as const, // Use floating labels for a more modern look
      variables: {
        colorPrimary: '#0066FF',
        colorBackground: isDarkMode ? '#1F2937' : '#F9FAFB',
        colorText: isDarkMode ? '#F9FAFB' : '#1F2937',
        colorDanger: '#EF4444',
        colorSuccess: '#10B981',
        colorWarning: '#F59E0B',
        fontFamily:
          'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        fontSizeBase: '16px', // Ensure at least 16px for mobile input fields
        spacingUnit: '4px',
        borderRadius: '8px',
        // Accessible colors for text on different backgrounds
        accessibleColorOnColorPrimary: '#FFFFFF',
        accessibleColorOnColorBackground: isDarkMode ? '#F9FAFB' : '#1F2937',
        accessibleColorOnColorSuccess: '#FFFFFF',
        accessibleColorOnColorDanger: '#FFFFFF',
        accessibleColorOnColorWarning: isDarkMode ? '#1F2937' : '#FFFFFF',
      },
      rules: {
        // Input fields
        '.Input': {
          color: isDarkMode ? '#F9FAFB' : '#1F2937',
          backgroundColor: isDarkMode ? '#374151' : '#F9FAFB',
          borderColor: isDarkMode ? '#4B5563' : '#E5E7EB',
          fontSize: '16px', // Ensure readability on mobile
          padding: '10px 14px',
          boxShadow: isDarkMode
            ? '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
            : '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        },
        '.Input:hover': {
          borderColor: isDarkMode ? '#6B7280' : '#D1D5DB',
        },
        '.Input:focus': {
          borderColor: '#0066FF',
          boxShadow: '0 0 0 1px #0066FF',
        },
        '.Input--invalid': {
          borderColor: '#EF4444',
          boxShadow: '0 0 0 1px #EF4444',
        },
        '.Input::placeholder': {
          color: isDarkMode ? '#9CA3AF' : '#9CA3AF',
        },
        // Labels
        '.Label': {
          color: isDarkMode ? '#D1D5DB' : '#6B7280',
          fontSize: '14px',
          fontWeight: '500',
        },
        '.Label--floating': {
          color: isDarkMode ? '#D1D5DB' : '#6B7280',
        },
        '.Label--invalid': {
          color: '#EF4444',
        },
        // Tabs
        '.Tab': {
          borderColor: isDarkMode ? '#4B5563' : '#E5E7EB',
          color: isDarkMode ? '#D1D5DB' : '#6B7280',
          backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF',
          padding: '10px 16px',
          borderRadius: '6px',
          fontWeight: '500',
        },
        '.Tab:hover': {
          color: isDarkMode ? '#F9FAFB' : '#1F2937',
          borderColor: isDarkMode ? '#6B7280' : '#9CA3AF',
        },
        '.Tab--selected': {
          borderColor: '#0066FF',
          color: isDarkMode ? '#F9FAFB' : '#1F2937',
          boxShadow: '0 0 0 1px #0066FF',
        },
        '.TabIcon': {
          color: isDarkMode ? '#9CA3AF' : '#6B7280',
        },
        '.TabIcon--selected': {
          color: '#0066FF',
        },
        // Error messages
        '.Error': {
          color: '#EF4444',
          fontSize: '14px',
          fontWeight: '500',
          marginTop: '4px',
        },
        // Block elements
        '.Block': {
          backgroundColor: isDarkMode ? '#374151' : '#F9FAFB',
          borderColor: isDarkMode ? '#4B5563' : '#E5E7EB',
          borderRadius: '8px',
          padding: '12px',
        },
      },
    };
  }, [isDarkMode]);

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

  // Set a timer to hide the loading state for Stripe Elements
  useEffect(() => {
    if (step === 'payment' && clientSecret) {
      // Give Stripe Elements time to load (typically takes 1-2 seconds)
      const timer = setTimeout(() => {
        setIsElementsLoading(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [step, clientSecret]);

  const handlePurchase = async () => {
    setIsPurchaseLoading(true);
    setPurchaseError('');
    try {
      // Get the selected package details
      const packageDetails = domainConfig.tokenPackages.find((pkg) => pkg.id === selectedPackage);
      if (!packageDetails) {
        setPurchaseError('Package details not found');
        return;
      }

      // Import the request module
      const { request } = await import('librechat-data-provider');

      // If Bitcoin is selected, use OpenNode
      if (selectedPayment === 'bitcoin') {
        // Create a charge with OpenNode
        const data = await request.post('/api/opennode/create-charge', {
          packageId: selectedPackage,
          amount: packageDetails.price, // Now using numeric price directly
        });

        // Redirect to OpenNode hosted checkout
        window.location.href = data.hosted_checkout_url;
        return;
      }

      // For other payment methods, use Stripe
      const data = await request.post('/api/stripe/create-payment-intent', {
        packageId: selectedPackage,
        amount: packageDetails.price, // Now using numeric price directly
        paymentMethod: selectedPayment,
        currency: domainConfig.currency.toLowerCase(), // Add currency from domain config
      });
      setClientSecret(data.clientSecret);
      setIsElementsLoading(true); // Reset elements loading state
      setStep('payment');
    } catch (error) {
      console.error('Error creating payment:', error);
      setPurchaseError(
        error instanceof Error
          ? error.message
          : 'An error occurred while processing your payment. Please try again.',
      );
    } finally {
      setIsPurchaseLoading(false);
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
              <p className="mt-4 text-text-secondary">Preparing payment...</p>
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
              appearance: stripeAppearance,
              // Note: We would ideally set the default payment method here,
              // but we'll rely on the Stripe Elements UI to handle this
            }}
          >
            {isElementsLoading && (
              <div className="space-y-4 p-6">
                <div className="mb-4 flex items-center justify-center">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  <span className="ml-2 text-text-secondary">Loading payment form...</span>
                </div>
                <div className="h-12 animate-pulse rounded-md bg-surface-tertiary"></div>
                <div className="h-12 animate-pulse rounded-md bg-surface-tertiary"></div>
                <div className="h-12 animate-pulse rounded-md bg-surface-tertiary"></div>
              </div>
            )}
            <div className={isElementsLoading ? 'hidden' : 'block'}>
              <CheckoutForm
                selectedPackage={selectedPackage}
                selectedPayment={selectedPayment}
                onSuccess={handlePaymentSuccess}
                onBack={() => setStep('select')}
                localize={localize}
              />
            </div>
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
            currencySymbol={domainConfig.currencySymbol}
            tokenPackages={domainConfig.tokenPackages}
          />
        );
      }

      case 'select':
      default: {
        return (
          <>
            <div className="p-4 sm:p-6">
              {/* Show reason for modal opening if it's due to insufficient funds */}
              {reason === 'insufficient_funds' && details && (
                <div className="mb-6 rounded-md border border-amber-300 bg-amber-50 p-4 dark:border-amber-700 dark:bg-amber-900/30">
                  <h3 className="text-base font-medium text-amber-800 dark:text-amber-400">
                    {localize('com_ui_insufficient_funds' as any)}
                  </h3>
                  <div className="mt-2 text-sm text-amber-700 dark:text-amber-300">
                    <p>
                      {localize('com_checkout_insufficient_funds_message' as any, {
                        balance: details.balance?.toLocaleString() || '0',
                        cost: details.cost?.toLocaleString() || '0',
                      })}
                    </p>
                    <p className="mt-1">{localize('com_checkout_buy_more_tokens' as any)}</p>
                  </div>
                </div>
              )}

              {/* Token Packages */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {domainConfig.tokenPackages.map((pkg) => (
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
                    <div className="mt-2 text-lg font-bold text-text-primary">
                      {pkg.priceDisplay}
                    </div>
                    {pkg.originalPrice && (
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-text-tertiary line-through">
                          {pkg.originalPriceDisplay}
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
                  {localize('com_checkout_payment_methods')}
                </h3>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {availablePaymentMethods.map((method) => (
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
              {purchaseError && (
                <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-500 dark:bg-red-900/20 dark:text-red-400">
                  {purchaseError}
                </div>
              )}
              <Button
                variant="submit"
                onClick={handlePurchase}
                className="bg-blue-600 px-4 hover:bg-blue-700"
                disabled={isPurchaseLoading}
              >
                {isPurchaseLoading ? (
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
