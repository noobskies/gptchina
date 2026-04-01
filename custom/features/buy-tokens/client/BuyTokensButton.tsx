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
import { Button, TooltipAnchor } from '@librechat/client';
import { useLocalize } from '~/hooks';
import { BuyTokensIcon } from './BuyTokensIcon';

interface BuyTokensButtonProps {
  onClick: () => void;
  collapsed?: boolean;
}

export const BuyTokensButton: React.FC<BuyTokensButtonProps> = ({ onClick, collapsed = false }) => {
  const localize = useLocalize();
  const label = (localize as any)('com_custom_tokens_buy_button');
  const ariaLabel = (localize as any)('com_custom_tokens_buy_button_aria');

  if (collapsed) {
    return (
      <TooltipAnchor
        side="right"
        description={label}
        render={
          <Button
            size="icon"
            variant="ghost"
            onClick={onClick}
            aria-label={ariaLabel}
            data-testid="buy-tokens-button"
            className="h-9 w-9 rounded-lg text-blue-600 hover:bg-surface-hover"
          >
            <BuyTokensIcon className="h-4 w-4" />
          </Button>
        }
      />
    );
  }

  return (
    <button
      onClick={onClick}
      className="relative mb-2 flex h-10 w-full items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white ring-offset-background transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
      data-testid="buy-tokens-button"
      aria-label={ariaLabel}
    >
      <BuyTokensIcon className="h-4 w-4" />
      <span className="text-center">{label}</span>
    </button>
  );
};
