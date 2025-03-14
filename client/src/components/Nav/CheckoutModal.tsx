import { useState } from 'react';
import { Check, CreditCard, X } from 'lucide-react';
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';
import { Button } from '~/components/ui/Button';
import { cn } from '~/utils';
import { useLocalize } from '~/hooks';

// Payment method icons
import { FaCreditCard, FaWeixin, FaAlipay, FaBitcoin, FaGoogle, FaApple } from 'react-icons/fa';

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

interface CheckoutModalProps {
  open: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

const CheckoutModal = ({ open, onOpenChange }: CheckoutModalProps) => {
  const [selectedPackage, setSelectedPackage] = useState(tokenPackages[3].id); // Default to 10 Million
  const [selectedPayment, setSelectedPayment] = useState('google'); // Default to Google Pay
  const localize = useLocalize();

  const handlePurchase = () => {
    // This will be implemented to handle the payment processing
    console.log('Purchase', {
      package: selectedPackage,
      paymentMethod: selectedPayment,
    });
    onOpenChange(false);
  };

  return (
    <Transition appear show={open}>
      <Dialog as="div" className="relative z-50" onClose={onOpenChange}>
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
                    {localize('com_checkout_buy_tokens')}
                  </h2>
                  <p className="mt-1 text-sm text-text-secondary">
                    {localize('com_checkout_select_package')}
                  </p>
                </div>
                <button
                  type="button"
                  className="rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-border-xheavy focus:ring-offset-2 disabled:pointer-events-none"
                  onClick={() => onOpenChange(false)}
                >
                  <X className="h-5 w-5 text-text-primary" />
                  <span className="sr-only">{localize('com_ui_close')}</span>
                </button>
              </DialogTitle>

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
                <Button variant="outline" onClick={() => onOpenChange(false)} className="px-4">
                  {localize('com_ui_cancel')}
                </Button>
                <Button variant="submit" onClick={handlePurchase} className="px-4">
                  <CreditCard className="mr-2 h-4 w-4" />
                  {localize('com_checkout_purchase')}
                </Button>
              </div>
            </DialogPanel>
          </div>
        </TransitionChild>
      </Dialog>
    </Transition>
  );
};

export default CheckoutModal;
