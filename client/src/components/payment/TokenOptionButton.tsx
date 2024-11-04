// components/payment/TokenOptionButton.tsx
import React from 'react';
import { useLocalize } from '~/hooks';

const TokenOptionButton = ({
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
      className={`flex h-[120px] flex-col items-center justify-center space-y-1 rounded border-2 p-3 text-gray-700 transition-colors duration-200 ease-in-out ${
        isSelected
          ? 'border-blue-600 bg-blue-600 text-white ring-2 ring-blue-400 ring-offset-2'
          : 'border-gray-300 bg-white hover:bg-blue-100 active:bg-blue-200'
      }`}
    >
      <div className="text-lg font-bold leading-tight">{localize(label)}</div>
      <div className="leading-tight">{localize('com_ui_payment_tokens')}</div>
      <div className="flex flex-col items-center space-y-1">
        {originalPrice === discountedPrice ? (
          <span className="text-sm leading-none">{discountedPrice}</span>
        ) : (
          <>
            <div className="flex items-center">
              <span className="mr-2 text-sm leading-none line-through">{originalPrice}</span>
              <span className="text-sm leading-none">{discountedPrice}</span>
            </div>
            {discountPercentage && (
              <span className="text-xs font-bold leading-none text-gray-700">
                {discountPercentage}
              </span>
            )}
          </>
        )}
      </div>
    </button>
  );
};

export default TokenOptionButton;
