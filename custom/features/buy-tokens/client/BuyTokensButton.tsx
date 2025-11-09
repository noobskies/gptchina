/**
 * CUSTOM: gptchina fork
 *
 * Feature: Buy Tokens (Stripe Integration)
 * Created: 2025-11-09
 * Upstream Impact: None (standalone module)
 *
 * Button component for buying tokens.
 */

import React from 'react';
import { BuyTokensIcon } from './BuyTokensIcon';

interface BuyTokensButtonProps {
  onClick: () => void;
}

export const BuyTokensButton: React.FC<BuyTokensButtonProps> = ({ onClick }) => {
  return (
    <div className="px-2 py-2">
      <button
        onClick={onClick}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 p-2 text-sm text-white transition-all duration-200 ease-in-out hover:bg-green-700"
        data-testid="buy-tokens-button"
        aria-label="Buy tokens"
      >
        <BuyTokensIcon className="h-5 w-5" />
        <span className="flex-1 text-center">Buy Tokens</span>
      </button>
    </div>
  );
};
