/**
 * CUSTOM: gptchina fork
 *
 * Feature: Buy Tokens (Stripe Integration)
 * Created: 2025-11-09
 * Upstream Impact: None (standalone module)
 *
 * Card component for displaying token package options.
 */

import React from 'react';

interface TokenPackage {
  id: string;
  tokens: number;
  price: number;
  originalPrice: number | null;
  discount: number | null;
  popular: boolean;
  label: string;
}

interface TokenPackageCardProps {
  package: TokenPackage;
  isSelected: boolean;
  onSelect: (packageId: string) => void;
}

export const TokenPackageCard: React.FC<TokenPackageCardProps> = ({
  package: pkg,
  isSelected,
  onSelect,
}) => {
  const formatPrice = (priceInCents: number) => {
    return `¥${(priceInCents / 100).toFixed(2)}`;
  };

  const formatTokens = (tokens: number) => {
    if (tokens >= 1000000) {
      return `${(tokens / 1000000).toFixed(0)}M`;
    }
    if (tokens >= 1000) {
      return `${(tokens / 1000).toFixed(0)}K`;
    }
    return tokens.toString();
  };

  return (
    <button
      onClick={() => onSelect(pkg.id)}
      className={`relative flex flex-col rounded-lg border-2 p-4 transition-all ${
        isSelected
          ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
          : 'border-gray-200 hover:border-green-300 dark:border-gray-700 dark:hover:border-green-700'
      } ${pkg.popular ? 'ring-2 ring-green-500 ring-opacity-50' : ''}`}
    >
      {pkg.popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-green-500 px-3 py-1 text-xs font-semibold text-white">
          Popular
        </div>
      )}

      <div className="mb-2 text-center">
        <div className="text-2xl font-bold">{formatTokens(pkg.tokens)} Tokens</div>
      </div>

      <div className="mb-3 text-center">
        <div className="text-3xl font-bold text-green-600 dark:text-green-400">
          {formatPrice(pkg.price)}
        </div>
        {pkg.originalPrice && (
          <div className="mt-1 flex items-center justify-center gap-2">
            <span className="text-sm text-gray-500 line-through dark:text-gray-400">
              {formatPrice(pkg.originalPrice)}
            </span>
            {pkg.discount && (
              <span className="rounded-full bg-red-500 px-2 py-0.5 text-xs font-semibold text-white">
                {pkg.discount}% off
              </span>
            )}
          </div>
        )}
      </div>

      {isSelected && (
        <div className="mt-2 text-center text-sm font-semibold text-green-600 dark:text-green-400">
          ✓ Selected
        </div>
      )}
    </button>
  );
};
