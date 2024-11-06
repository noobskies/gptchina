// components/payment/TokenOptionButton.tsx
import React from 'react';
import { useLocalize } from '~/hooks';

// Update the TokenPackage interface to reflect our new structure
interface TokenPackage {
  tokens: number;
  label: string;
  price: string;
  amount: number; // amount in cents
  currency: 'USD' | 'CNY';
  priceId: string;
  originalPrice: string;
  discountedPrice: string;
  discountPercentage?: string;
}

interface TokenOptionButtonProps extends TokenPackage {
  isSelected: boolean;
  onClick: () => void;
}

const formatTokenAmount = (tokens: number): string =>
  tokens >= 1_000_000 ? `${tokens / 1_000_000} Million` : `${(tokens / 1000).toLocaleString()}k`;

const formatCurrency = (amount: number, currency: 'USD' | 'CNY'): string => {
  const value = (amount / 100).toFixed(2);
  return currency === 'USD' ? `$${value}` : `¥${value}`;
};

const TokenOptionButton: React.FC<TokenOptionButtonProps> = ({
  tokens,
  label,
  amount,
  currency,
  originalPrice,
  discountedPrice,
  discountPercentage,
  isSelected,
  onClick,
}) => {
  const localize = useLocalize();

  // We'll keep using originalPrice and discountedPrice for display
  // since they're pre-formatted strings that might include currency symbols
  // But we could also format them from the amount if needed:
  // const displayPrice = formatCurrency(amount, currency);

  return (
    <button
      onClick={onClick}
      className={`flex w-full flex-col items-center rounded border-2 p-2 transition-all
        ${
          isSelected
            ? 'border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-900/20'
            : 'border-gray-200 bg-white hover:border-blue-200 hover:bg-blue-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-blue-700 dark:hover:bg-gray-700'
        }`}
    >
      <span className="text-base font-semibold text-gray-900 dark:text-gray-100">
        {formatTokenAmount(tokens)}
      </span>
      <span className="mb-1 text-xs text-gray-500 dark:text-gray-400">Tokens</span>

      <div className="flex flex-col items-center gap-0.5">
        {discountPercentage ? (
          <>
            <span className="text-xs text-gray-400 line-through">{originalPrice}</span>
            <span className="text-base font-medium text-gray-900 dark:text-gray-100">
              {discountedPrice}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">({discountPercentage})</span>
          </>
        ) : (
          <span className="text-base font-medium text-gray-900 dark:text-gray-100">
            {discountedPrice}
          </span>
        )}
      </div>

      {discountPercentage?.includes('75%') && (
        <div
          className="mt-1.5 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium 
          text-green-800 dark:bg-green-900/30 dark:text-green-400"
        >
          {localize('com_ui_payment_best_value')}
        </div>
      )}
    </button>
  );
};

export default TokenOptionButton;
