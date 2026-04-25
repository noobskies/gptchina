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
import { useLocalize } from '~/hooks';

export const TokenUsageGuideLink: React.FC = () => {
  const localize = useLocalize();

  return (
    <a
      href="/token-usage-guide"
      target="_blank"
      rel="noopener noreferrer"
      className="mb-2 flex items-center justify-start text-sm text-blue-600 underline-offset-2 hover:underline dark:text-blue-400"
    >
      {(localize as any)('com_custom_usage_guide_learn_more')}
    </a>
  );
};
