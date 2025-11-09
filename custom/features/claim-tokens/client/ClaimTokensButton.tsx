/**
 * CUSTOM: gptchina fork
 *
 * Feature: Claim Tokens
 * Created: 2025-11-09
 * Upstream Impact: None (standalone module)
 *
 * Button component for claiming tokens.
 */

import React from 'react';
import { Button, useToastContext } from '@librechat/client';
import { useClaimTokens } from './useClaimTokens';
import { ClaimTokensIcon } from './ClaimTokensIcon';

export const ClaimTokensButton: React.FC = () => {
  const { showToast } = useToastContext();
  const { canClaim, isLoading, isClaiming, formattedTime, claimTokens, isSuccess } =
    useClaimTokens();

  const handleClaim = () => {
    claimTokens(undefined, {
      onSuccess: (data) => {
        showToast({
          message: `Successfully claimed ${new Intl.NumberFormat().format(
            data.tokensAdded || 20000,
          )} tokens!`,
          status: 'success',
        });
      },
      onError: (error: unknown) => {
        const errorMessage =
          error instanceof Error ? error.message : 'Failed to claim tokens. Please try again.';
        showToast({
          message: errorMessage,
          status: 'error',
        });
      },
    });
  };

  const buttonText = canClaim ? 'Claim 20,000 Tokens' : formattedTime || 'Loading...';
  const isDisabled = !canClaim || isLoading;

  const buttonClassName = canClaim
    ? 'relative mb-2 flex h-10 w-full items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white ring-offset-background transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50'
    : 'relative mb-2 flex h-10 w-full items-center justify-center gap-2 whitespace-nowrap rounded-lg border border-border-light bg-background px-4 py-2 text-sm font-medium text-text-primary ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50';

  return (
    <Button
      onClick={handleClaim}
      disabled={isDisabled}
      variant="outline"
      className={buttonClassName}
      data-testid="claim-tokens-button"
      aria-label={canClaim ? 'Claim 20,000 tokens' : `Next claim available in ${formattedTime}`}
    >
      <ClaimTokensIcon className="h-4 w-4" />
      <span className="text-center">{buttonText}</span>
      {isClaiming && (
        <svg
          className="h-4 w-4 animate-spin"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
    </Button>
  );
};
