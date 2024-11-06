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
    const iconProps = { className: 'h-5 w-5' };
    switch (iconName) {
      case 'credit-card':
        return <FaCreditCard {...iconProps} />;
      case 'bitcoin':
        return <FaBitcoin {...iconProps} />;
      case 'wechat':
        return <SiWechat {...iconProps} />;
      case 'alipay':
        return <SiAlipay {...iconProps} />;
      case 'google-pay':
        return <FaGooglePay {...iconProps} />;
      case 'apple-pay':
        return <FaApple {...iconProps} />;
      default:
        return <FaCreditCard {...iconProps} />;
    }
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`
        flex w-full items-center justify-between rounded border-2 p-3 transition-all
        ${
          isSelected
            ? 'border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-900/20'
            : 'border-gray-200 bg-white hover:border-blue-200 hover:bg-blue-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-blue-700 dark:hover:bg-gray-700'
        }
        ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
      `}
      aria-label={`Pay with ${name}`}
    >
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <span
          className={
            isSelected ? 'text-blue-500 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'
          }
        >
          {getPaymentIcon(icon)}
        </span>

        <span
          className={`whitespace-nowrap text-sm font-medium ${
            isSelected ? 'text-blue-700 dark:text-blue-300' : 'text-gray-700 dark:text-gray-300'
          }`}
        >
          {name}
        </span>
      </div>

      {isSelected && (
        <svg
          className="h-5 w-5 flex-shrink-0 text-blue-500 dark:text-blue-400"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      )}
    </button>
  );
};

export default PaymentOptionButton;
