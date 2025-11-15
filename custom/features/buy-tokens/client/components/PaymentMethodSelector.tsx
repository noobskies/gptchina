/**
 * CUSTOM: gptchina fork
 *
 * Feature: Buy Tokens (Stripe Integration)
 * Created: 2025-11-09
 * Upstream Impact: None (standalone module)
 *
 * Payment method selection component with all Stripe-enabled methods.
 */

import React from 'react';
import { Check } from 'lucide-react';
import { FaCreditCard, FaWeixin, FaAlipay, FaBitcoin, FaGoogle, FaApple } from 'react-icons/fa';
import { useLocalize } from '~/hooks';
import { cn } from '~/utils';

interface PaymentMethodSelectorProps {
  selectedMethod: string;
  onSelectMethod: (methodId: string) => void;
}

export const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  selectedMethod,
  onSelectMethod,
}) => {
  const localize = useLocalize();

  const paymentMethods = [
    {
      id: 'card',
      name: (localize as any)('com_custom_tokens_buy_payment_card'),
      icon: <FaCreditCard />,
      available: true,
    },
    {
      id: 'wechat',
      name: (localize as any)('com_custom_tokens_buy_payment_wechat'),
      icon: <FaWeixin />,
      available: true,
    },
    {
      id: 'alipay',
      name: (localize as any)('com_custom_tokens_buy_payment_alipay'),
      icon: <FaAlipay />,
      available: true,
    },
    {
      id: 'bitcoin',
      name: (localize as any)('com_custom_tokens_buy_payment_bitcoin'),
      icon: <FaBitcoin />,
      available: true,
    },
    {
      id: 'google',
      name: (localize as any)('com_custom_tokens_buy_payment_google'),
      icon: <FaGoogle />,
      available: true,
    },
    {
      id: 'apple',
      name: (localize as any)('com_custom_tokens_buy_payment_apple'),
      icon: <FaApple />,
      available: true,
    },
  ];

  return (
    <div className="mt-6">
      <h3 className="mb-3 text-sm font-medium text-text-secondary">
        {(localize as any)('com_custom_tokens_buy_payment_methods')}
      </h3>
      <div className="grid grid-cols-2 gap-2">
        {paymentMethods.map((method) => (
          <button
            key={method.id}
            onClick={() => method.available && onSelectMethod(method.id)}
            disabled={!method.available}
            className={cn(
              'flex cursor-pointer items-center gap-2 rounded-lg border p-3 transition-all',
              selectedMethod === method.id
                ? 'border-blue-500'
                : 'border-border-light hover:border-border-medium',
              !method.available && 'cursor-not-allowed opacity-50',
            )}
          >
            <div
              className={cn(
                'text-lg',
                selectedMethod === method.id
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-text-primary',
              )}
            >
              {method.icon}
            </div>
            <div className="flex-1 text-left text-sm text-text-primary">{method.name}</div>
            {selectedMethod === method.id && (
              <div className="text-blue-600 dark:text-blue-400">
                <Check size={16} />
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};
