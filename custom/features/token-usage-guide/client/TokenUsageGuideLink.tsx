/**
 * CUSTOM: gptchina fork
 *
 * Feature: Token Usage Guide
 * File: Link component for side navigation
 * Created: 2025-12-09
 * Upstream Impact: None (standalone module)
 *
 * Link component to open Token Usage Guide in new tab.
 * Appears in left side navigation below Buy Tokens button.
 */

import React from 'react';
import { Button, TooltipAnchor } from '@librechat/client';
import { useLocalize } from '~/hooks';

interface TokenUsageGuideLinkProps {
  collapsed?: boolean;
}

export const TokenUsageGuideLink: React.FC<TokenUsageGuideLinkProps> = ({ collapsed = false }) => {
  const localize = useLocalize();
  const label = (localize as any)('com_custom_usage_guide_learn_more');

  if (collapsed) {
    return (
      <TooltipAnchor
        side="right"
        description={label}
        render={
          <Button
            size="icon"
            variant="ghost"
            aria-label={label}
            className="h-9 w-9 rounded-lg text-text-secondary hover:bg-surface-hover"
            render={
              <a href="/token-usage-guide" target="_blank" rel="noopener noreferrer">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                  aria-hidden="true"
                >
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                </svg>
              </a>
            }
          />
        }
      />
    );
  }

  return (
    <a
      href="/token-usage-guide"
      target="_blank"
      rel="noopener noreferrer"
      className="mb-2 flex items-center justify-start text-sm text-blue-600 underline-offset-2 hover:underline dark:text-blue-400"
    >
      {label}
    </a>
  );
};
