import { useState } from 'react';
import { OGDialog, Button } from '~/components/ui';
import OGDialogTemplate from '~/components/ui/OGDialogTemplate';
import { useLocalize } from '~/hooks';

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
  icon: string;
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
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);

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
    { id: 'card', name: 'Credit Card', icon: '💳' },
    { id: 'wechat', name: 'WeChat Pay', icon: '📱' },
    { id: 'alipay', name: 'AliPay', icon: '💰' },
    { id: 'bitcoin', name: 'Bitcoin', icon: '₿' },
    { id: 'google', name: 'Google Pay', icon: 'G' },
    { id: 'apple', name: 'Apple Pay', icon: '🍎' },
  ];

  const handlePurchase = () => {
    console.log('Purchase tokens:', {
      package: tokenPackages.find((pkg) => pkg.id === selectedPackage),
      paymentMethod: paymentMethods.find((method) => method.id === selectedPaymentMethod),
    });
    onOpenChange(false);
  };

  const formatNumber = (num: number) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  return (
    <OGDialog open={open} onOpenChange={onOpenChange} triggerRef={triggerRef}>
      <OGDialogTemplate
        title={localize('token_buy_title')}
        className="max-w-md"
        main={
          <div className="flex w-full flex-col gap-4">
            <h3 className="mb-3 font-medium">{localize('token_select_package')}</h3>
            <div className="grid gap-3 md:grid-cols-2">
              {tokenPackages.map((pkg) => (
                <div
                  key={pkg.id}
                  className={`cursor-pointer rounded-lg border p-3 transition-colors ${
                    selectedPackage === pkg.id
                      ? 'border-token-border-heavy bg-surface-secondary'
                      : 'border-token-border-light hover:border-token-border-medium hover:bg-surface-secondary'
                  } ${pkg.popular ? 'relative' : ''}`}
                  onClick={() => setSelectedPackage(pkg.id)}
                >
                  {pkg.popular && (
                    <span className="border-token-border-medium absolute -top-2 right-2 rounded-full border bg-surface-primary px-2 py-0.5 text-xs text-text-primary">
                      {localize('token_popular')}
                    </span>
                  )}
                  <div className="text-lg font-bold">{formatNumber(pkg.amount)}</div>
                  <div className="text-token-text-secondary text-sm">
                    {localize('token_tokens')}
                  </div>
                  <div className="mt-2 font-medium">
                    ${pkg.price.toFixed(2)}
                    {pkg.originalPrice && (
                      <>
                        <span className="text-token-text-tertiary ml-2 text-sm line-through">
                          ${pkg.originalPrice.toFixed(2)}
                        </span>
                        <span className="text-token-text-secondary ml-2 text-xs">
                          ({localize('token_discount_off', { percent: pkg.discount })})
                        </span>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <h3 className="mb-3 mt-6 font-medium">{localize('token_select_payment')}</h3>
            <div className="grid gap-3 md:grid-cols-2">
              {paymentMethods.map((method) => (
                <div
                  key={method.id}
                  className={`flex cursor-pointer items-center rounded-lg border p-3 transition-colors ${
                    selectedPaymentMethod === method.id
                      ? 'border-token-border-heavy bg-surface-secondary'
                      : 'border-token-border-light hover:border-token-border-medium hover:bg-surface-secondary'
                  }`}
                  onClick={() => setSelectedPaymentMethod(method.id)}
                >
                  <span className="mr-2 text-xl">{method.icon}</span>
                  <span>{method.name}</span>
                </div>
              ))}
            </div>
          </div>
        }
        buttons={
          <Button
            onClick={handlePurchase}
            disabled={!selectedPackage || !selectedPaymentMethod}
            variant="submit"
          >
            {localize('token_purchase')}
          </Button>
        }
      />
    </OGDialog>
  );
}
