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
import { useLocalize } from '~/hooks';
import type { TokenPackage } from '../shared/types';
import { formatPrice, formatTokens } from './utils/currency';

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
  const localize = useLocalize();

  return (
    <button
      onClick={() => onSelect(pkg.id)}
      className={`relative flex flex-col rounded-lg border-2 p-3 transition-all sm:p-4 ${
        isSelected
          ? 'border-blue-500'
          : 'border-border-medium hover:border-blue-300 dark:hover:border-blue-600'
      }`}
    >
      {pkg.popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-blue-500 px-3 py-1 text-xs font-semibold text-white">
          {(localize as any)('com_custom_tokens_buy_package_popular')}
        </div>
      )}

      {/* Selected checkmark in top right */}
      {isSelected && (
        <div className="absolute right-3 top-3">
          <svg
            className="h-5 w-5 text-blue-600 dark:text-blue-400"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      )}

      {/* Token amount - left-aligned, on separate lines */}
      <div className="mb-3 text-left">
        <div className="text-lg font-semibold text-text-primary">{formatTokens(pkg.tokens)}</div>
        <div className="text-sm text-text-secondary">
          {(localize as any)('com_custom_tokens_buy_package_tokens_label')}
        </div>
      </div>

      {/* Price - left-aligned, smaller */}
      <div className="text-left">
        <div className="text-xl font-semibold text-text-primary">{formatPrice(pkg.price)}</div>
        {pkg.originalPrice && (
          <div className="mt-1 flex items-center gap-2">
            <span className="text-sm text-text-secondary">
              <s>{formatPrice(pkg.originalPrice)}</s>
            </span>
            {pkg.discount && (
              <span className="rounded-full bg-blue-500 px-2 py-0.5 text-xs font-semibold text-white">
                {(localize as any)('com_custom_tokens_buy_package_discount', {
                  percent: pkg.discount,
                })}
              </span>
            )}
          </div>
        )}
      </div>
    </button>
  );
};
