import { useState } from 'react';
import {
  OGDialog,
  Button,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Tag,
  Separator,
} from '~/components/ui';
import OGDialogTemplate from '~/components/ui/OGDialogTemplate';
import { useLocalize } from '~/hooks';
import PaymentForm from '~/components/Stripe/PaymentForm';
import { useCreatePaymentIntentMutation } from '~/data-provider/mutations';
import { useGetUserBalance } from '~/data-provider';
import { useQueryClient } from '@tanstack/react-query';
import { QueryKeys } from 'librechat-data-provider';
import {
  CheckCircle,
  XCircle,
  CreditCard,
  Wallet,
  Bitcoin,
  Smartphone,
  DollarSign,
  Apple,
  LucideIcon,
} from 'lucide-react';

// Payment method tab labels
const CARDS_TAB = 'Cards';
const WALLETS_TAB = 'Digital Wallets';
const CRYPTO_TAB = 'Crypto';

// Payment method names
const METHOD_NAMES = {
  card: 'Credit Card',
  wechat: 'WeChat Pay',
  alipay: 'AliPay',
  bitcoin: 'Bitcoin',
  google: 'Google Pay',
  apple: 'Apple Pay',
};

interface TokenPackage {
  id: string;
  amount: number;
  price: number;
  originalPrice?: number;
  discount?: number;
  popular?: boolean;
}

interface PaymentMethod {
  id: string;
  name: string;
  Icon: LucideIcon;
}

interface BuyTokensModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function BuyTokensModal({
  open,
  onOpenChange,
  triggerRef,
}: BuyTokensModalProps & { triggerRef?: React.RefObject<HTMLButtonElement> }) {
  const localize = useLocalize();
  const queryClient = useQueryClient();
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);
  const [paymentStep, setPaymentStep] = useState<'select' | 'payment'>('select');
  const [clientSecret, setClientSecret] = useState<string>('');
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const createPaymentIntentMutation = useCreatePaymentIntentMutation();

  // Get user balance
  const balanceQuery = useGetUserBalance();

  // Reset state when modal is closed
  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      // Wait for the modal close animation to complete before resetting state
      setTimeout(() => {
        setSelectedPackage(null);
        setSelectedPaymentMethod(null);
        setPaymentStep('select');
        setClientSecret('');
        setPaymentStatus('idle');
        setErrorMessage('');
      }, 300);
    }
    onOpenChange(newOpen);
  };

  // Token packages
  const tokenPackages: TokenPackage[] = [
    { id: 'basic', amount: 100000, price: 1.5, popular: false },
    { id: 'standard', amount: 500000, price: 5, originalPrice: 7.5, discount: 30, popular: true },
    { id: 'premium', amount: 1000000, price: 7.5, originalPrice: 15, discount: 50, popular: false },
    {
      id: 'ultimate',
      amount: 10000000,
      price: 40,
      originalPrice: 150,
      discount: 75,
      popular: false,
    },
  ];

  // Payment methods
  const paymentMethods: PaymentMethod[] = [
    { id: 'card', name: METHOD_NAMES.card, Icon: CreditCard },
    { id: 'wechat', name: METHOD_NAMES.wechat, Icon: Smartphone },
    { id: 'alipay', name: METHOD_NAMES.alipay, Icon: DollarSign },
    { id: 'bitcoin', name: METHOD_NAMES.bitcoin, Icon: Bitcoin },
    { id: 'google', name: METHOD_NAMES.google, Icon: Wallet },
    { id: 'apple', name: METHOD_NAMES.apple, Icon: Apple },
  ];

  const handlePurchase = async () => {
    if (!selectedPackage || !selectedPaymentMethod) {
      return;
    }

    const selectedPkg = tokenPackages.find((pkg) => pkg.id === selectedPackage);
    if (!selectedPkg) {
      return;
    }

    if (selectedPaymentMethod === 'card') {
      try {
        const response = await createPaymentIntentMutation.mutateAsync({
          amount: selectedPkg.price,
          packageId: selectedPkg.id,
        });
        if (response && response.clientSecret) {
          setClientSecret(response.clientSecret);
          setPaymentStep('payment');
          console.log('Client secret received:', response.clientSecret);
        } else {
          console.error('No client secret returned from payment intent creation');
          setErrorMessage('Failed to initialize payment. Please try again.');
          setPaymentStatus('error');
        }
      } catch (error) {
        console.error('Error creating payment intent:', error);
        setErrorMessage('Failed to initialize payment. Please try again.');
        setPaymentStatus('error');
      }
    } else {
      // Handle other payment methods
      console.log('Purchase tokens:', {
        package: selectedPkg,
        paymentMethod: paymentMethods.find((method) => method.id === selectedPaymentMethod),
      });
      handleOpenChange(false);
    }
  };

  const handlePaymentSuccess = () => {
    setPaymentStatus('success');

    // Refresh the balance to show updated tokens
    queryClient.invalidateQueries([QueryKeys.balance]);

    // Force refetch the balance query
    balanceQuery.refetch();

    // Wait a moment to show success message before closing
    setTimeout(() => {
      handleOpenChange(false);
    }, 2000);
  };

  const handlePaymentError = (error: string) => {
    setErrorMessage(error);
    setPaymentStatus('error');
  };

  const formatNumber = (num: number) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const renderContent = () => {
    if (paymentStep === 'select') {
      return (
        <div className="flex w-full flex-col gap-6">
          <div>
            <h3 className="mb-4 text-lg font-medium">{localize('token_select_package')}</h3>
            <div className="grid gap-4 md:grid-cols-2">
              {tokenPackages.map((pkg) => (
                <div
                  key={pkg.id}
                  className={`relative cursor-pointer rounded-lg border p-4 transition-colors ${
                    selectedPackage === pkg.id
                      ? 'border-token-border-heavy bg-surface-secondary shadow-sm'
                      : 'border-token-border-light hover:border-token-border-medium hover:bg-surface-secondary'
                  }`}
                  onClick={() => setSelectedPackage(pkg.id)}
                >
                  {pkg.popular && (
                    <Tag
                      label={localize('token_popular')}
                      className="absolute -top-2 right-2 border-blue-600 bg-blue-600/20 text-blue-600"
                      labelClassName="py-0"
                    />
                  )}
                  <div className="flex flex-col">
                    <div className="text-xl font-bold">{formatNumber(pkg.amount)}</div>
                    <div className="text-token-text-secondary mb-2 text-sm">
                      {localize('token_tokens')}
                    </div>
                    <div className="mt-auto flex items-baseline">
                      <span className="text-lg font-medium">${pkg.price.toFixed(2)}</span>
                      {pkg.originalPrice && (
                        <>
                          <span className="text-token-text-tertiary ml-2 text-sm line-through">
                            ${pkg.originalPrice.toFixed(2)}
                          </span>
                          <span className="ml-2 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-200">
                            {localize('token_discount_off', { percent: pkg.discount })}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="mb-4 text-lg font-medium">{localize('token_select_payment')}</h3>
            <Tabs
              defaultValue="card"
              className="w-full"
              onValueChange={(value) => setSelectedPaymentMethod(value)}
            >
              <TabsList className="mb-4 w-full justify-start">
                <TabsTrigger value="card" className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  <span>{CARDS_TAB}</span>
                </TabsTrigger>
                <TabsTrigger value="wallet" className="flex items-center gap-2">
                  <Wallet className="h-4 w-4" />
                  <span>{WALLETS_TAB}</span>
                </TabsTrigger>
                <TabsTrigger value="crypto" className="flex items-center gap-2">
                  <Bitcoin className="h-4 w-4" />
                  <span>{CRYPTO_TAB}</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="card" className="mt-0">
                <div className="grid gap-3 md:grid-cols-2">
                  {paymentMethods
                    .filter((method) => ['card', 'google', 'apple'].includes(method.id))
                    .map((method) => (
                      <div
                        key={method.id}
                        className={`flex cursor-pointer items-center rounded-lg border p-3 transition-colors ${
                          selectedPaymentMethod === method.id
                            ? 'border-token-border-heavy bg-surface-secondary shadow-sm'
                            : 'border-token-border-light hover:border-token-border-medium hover:bg-surface-secondary'
                        }`}
                        onClick={() => setSelectedPaymentMethod(method.id)}
                      >
                        <span className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-surface-primary">
                          <method.Icon className="h-4 w-4" />
                        </span>
                        <span>{METHOD_NAMES[method.id as keyof typeof METHOD_NAMES]}</span>
                      </div>
                    ))}
                </div>
              </TabsContent>

              <TabsContent value="wallet" className="mt-0">
                <div className="grid gap-3 md:grid-cols-2">
                  {paymentMethods
                    .filter((method) => ['wechat', 'alipay'].includes(method.id))
                    .map((method) => (
                      <div
                        key={method.id}
                        className={`flex cursor-pointer items-center rounded-lg border p-3 transition-colors ${
                          selectedPaymentMethod === method.id
                            ? 'border-token-border-heavy bg-surface-secondary shadow-sm'
                            : 'border-token-border-light hover:border-token-border-medium hover:bg-surface-secondary'
                        }`}
                        onClick={() => setSelectedPaymentMethod(method.id)}
                      >
                        <span className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-surface-primary">
                          <method.Icon className="h-4 w-4" />
                        </span>
                        <span>{METHOD_NAMES[method.id as keyof typeof METHOD_NAMES]}</span>
                      </div>
                    ))}
                </div>
              </TabsContent>

              <TabsContent value="crypto" className="mt-0">
                <div className="grid gap-3 md:grid-cols-2">
                  {paymentMethods
                    .filter((method) => ['bitcoin'].includes(method.id))
                    .map((method) => (
                      <div
                        key={method.id}
                        className={`flex cursor-pointer items-center rounded-lg border p-3 transition-colors ${
                          selectedPaymentMethod === method.id
                            ? 'border-token-border-heavy bg-surface-secondary shadow-sm'
                            : 'border-token-border-light hover:border-token-border-medium hover:bg-surface-secondary'
                        }`}
                        onClick={() => setSelectedPaymentMethod(method.id)}
                      >
                        <span className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-surface-primary">
                          <method.Icon className="h-4 w-4" />
                        </span>
                        <span>{METHOD_NAMES[method.id as keyof typeof METHOD_NAMES]}</span>
                      </div>
                    ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      );
    } else if (paymentStep === 'payment') {
      const selectedPkg = tokenPackages.find((pkg) => pkg.id === selectedPackage);
      if (!selectedPkg) {
        return null;
      }
      return (
        <div className="flex w-full flex-col gap-4">
          <div className="mb-4 text-center">
            <h3 className="text-lg font-medium">
              {localize('token_payment_for_tokens', {
                tokens: formatNumber(selectedPkg.amount),
                amount: selectedPkg.price.toFixed(2),
              })}
            </h3>
          </div>
          {paymentStatus === 'success' ? (
            <div className="p-4 text-center">
              <CheckCircle className="mx-auto mb-2 text-xl text-green-500" size={24} />
              <h3 className="font-medium">{localize('token_payment_success')}</h3>
              <p className="text-token-text-secondary">
                {localize('token_payment_for_tokens', {
                  tokens: formatNumber(selectedPkg.amount),
                  amount: selectedPkg.price.toFixed(2),
                })}
              </p>
            </div>
          ) : paymentStatus === 'error' ? (
            <div className="p-4 text-center">
              <XCircle className="mx-auto mb-2 text-xl text-red-500" size={24} />
              <h3 className="font-medium">{localize('token_payment_error')}</h3>
              <p className="text-token-text-secondary">{errorMessage}</p>
              <Button onClick={() => setPaymentStatus('idle')} variant="submit" className="mt-4">
                {localize('token_payment_try_again')}
              </Button>
            </div>
          ) : (
            <PaymentForm
              clientSecret={clientSecret}
              amount={selectedPkg.price}
              onSuccess={handlePaymentSuccess}
              onError={handlePaymentError}
            />
          )}
          {paymentStatus === 'idle' && (
            <button
              className="text-token-text-secondary mt-2 text-sm underline"
              onClick={() => setPaymentStep('select')}
            >
              {localize('token_payment_back')}
            </button>
          )}
        </div>
      );
    }
    return null;
  };

  const renderButtons = () => {
    if (paymentStep === 'select') {
      return (
        <Button
          onClick={handlePurchase}
          disabled={!selectedPackage || !selectedPaymentMethod}
          variant="submit"
        >
          {localize('token_purchase')}
        </Button>
      );
    }
    return null;
  };

  return (
    <OGDialog open={open} onOpenChange={handleOpenChange} triggerRef={triggerRef}>
      <OGDialogTemplate
        title={paymentStep === 'select' ? localize('token_buy_title') : ''}
        className="max-w-2xl"
        main={renderContent()}
        buttons={renderButtons()}
      />
    </OGDialog>
  );
}
