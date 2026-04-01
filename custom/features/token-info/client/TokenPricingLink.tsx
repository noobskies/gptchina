/**
 * CUSTOM: gptchina fork
 *
 * Feature: Token Info / Pricing Guide
 * Created: 2025-11-14
 * Upstream Impact: None (standalone module)
 *
 * Link component to open token pricing guide in new tab.
 */

import React from 'react';

export const TokenPricingLink: React.FC = () => {
  return (
    <a
      href="/token-pricing"
      target="_blank"
      rel="noopener noreferrer"
      className="mb-2 flex items-center justify-center text-sm text-blue-600 underline-offset-2 hover:underline dark:text-blue-400"
    >
      Token Pricing Guide
    </a>
  );
};
