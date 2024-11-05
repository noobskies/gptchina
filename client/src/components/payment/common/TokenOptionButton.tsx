// components/payment/common/TokenOptionButton.tsx
import React from 'react';
import { useLocalize } from '~/hooks';
import type { TokenPackage } from '../constants/tokenOptions';

interface TokenOptionButtonProps extends TokenPackage {
  isSelected: boolean;
  onClick: () => void;
}

const TokenOptionButton: React.FC<TokenOptionButtonProps> = ({
  tokens,
  label,
  originalPrice,
  discountedPrice,
  discountPercentage,
  isSelected,
  onClick,
}) => {
  const localize = useLocalize();

  return (
    <button
      onClick={onClick}
      className={`
        flex w-full flex-col items-center rounded-lg border-2 p-4 transition-all duration-200
        ${
          isSelected
            ? 'border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-900/20'
            : 'border-gray-200 bg-white hover:border-blue-200 hover:bg-blue-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-blue-700 dark:hover:bg-gray-700'
        }
      `}
    >
      {/* Token Amount */}
      <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
        {(tokens / 1000).toLocaleString()}K
      </span>

      {/* Token Label */}
      <span className="mb-2 text-sm text-gray-600 dark:text-gray-400">{localize(label)}</span>

      {/* Price Information */}
      <div className="flex flex-col items-center">
        {discountPercentage && (
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-400 line-through">{originalPrice}</span>
            <span className="text-sm font-medium text-green-600 dark:text-green-400">
              {discountPercentage}
            </span>
          </div>
        )}

        <span
          className={`text-lg font-semibold ${
            discountPercentage
              ? 'text-green-600 dark:text-green-400'
              : 'text-gray-900 dark:text-gray-100'
          }`}
        >
          {discountedPrice}
        </span>
      </div>

      {/* Best Value Badge */}
      {discountPercentage?.includes('75%') && (
        <div className="mt-2 rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-400">
          {localize('com_ui_payment_best_value')}
        </div>
      )}
    </button>
  );
};

export default TokenOptionButton;
