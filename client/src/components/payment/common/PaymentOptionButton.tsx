// components/payment/common/PaymentOptionButton.tsx
import React from 'react';
import { useLocalize } from '~/hooks';
import { PaymentMethod, PaymentMethodConfig } from '../constants/paymentMethods';

import { FaCreditCard, FaBitcoin, FaGooglePay, FaApple } from 'react-icons/fa';
import { SiWechat, SiAlipay } from 'react-icons/si';

interface PaymentOptionButtonProps extends Omit<PaymentMethodConfig, 'regions' | 'providers'> {
  isSelected: boolean;
  onClick: () => void;
  disabled?: boolean;
}

const PaymentOptionButton: React.FC<PaymentOptionButtonProps> = ({
  id,
  name,
  icon,
  isSelected,
  onClick,
  disabled = false,
}) => {
  const localize = useLocalize();

  const getPaymentIcon = (iconName: string) => {
    switch (iconName) {
      case 'credit-card':
        return <FaCreditCard className="h-5 w-5" />;
      case 'bitcoin':
        return <FaBitcoin className="h-5 w-5" />;
      case 'wechat':
        return <SiWechat className="h-5 w-5" />;
      case 'alipay':
        return <SiAlipay className="h-5 w-5" />;
      case 'google-pay':
        return <FaGooglePay className="h-5 w-5" />;
      case 'apple-pay':
        return <FaApple className="h-5 w-5" />;
      default:
        return <FaCreditCard className="h-5 w-5" />;
    }
  };

  const getPaymentLabel = () => {
    return name;
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`
        flex w-full items-center gap-3 rounded-lg border-2 p-4 transition-all duration-200
        ${
          isSelected
            ? 'border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-900/20'
            : 'border-gray-200 bg-white hover:border-blue-200 hover:bg-blue-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-blue-700 dark:hover:bg-gray-700'
        }
        ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
      `}
      aria-label={`Pay with ${getPaymentLabel()}`}
    >
      {/* Payment Icon */}
      <span
        className={`
        flex items-center justify-center
        ${isSelected ? 'text-blue-500 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}
      `}
      >
        {getPaymentIcon(icon)}
      </span>

      {/* Payment Name */}
      <span
        className={`
        flex-1 text-left text-sm font-medium
        ${isSelected ? 'text-blue-700 dark:text-blue-300' : 'text-gray-700 dark:text-gray-300'}
      `}
      >
        {getPaymentLabel()}
      </span>

      {/* Selected Indicator */}
      {isSelected && (
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500 text-white dark:bg-blue-400">
          <svg
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </span>
      )}
    </button>
  );
};

export default PaymentOptionButton;
