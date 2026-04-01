/**
 * CUSTOM: gptchina fork
 *
 * Feature: Product Tour
 * Created: 2025-12-10
 * Upstream Impact: None (standalone module)
 *
 * Tour step definitions with i18n support.
 * Each step targets a specific UI element with data-tour attribute.
 */

import type { Step } from 'react-joyride';

/**
 * Get tour steps with localized content
 * @param localize - LibreChat's localize function
 * @param isSmallScreen - Whether the screen is mobile/small
 */
export const getTourSteps = (localize: any, isSmallScreen: boolean): Step[] => {
  const steps: Step[] = [
    // Step 1: Model Selection
    {
      target: '[data-tour="model-selector"]',
      title: (localize as any)('com_custom_tour_step1_title'),
      content: (localize as any)('com_custom_tour_step1_body'),
      placement: 'bottom',
      disableBeacon: true,
    },
    // Step 2: Compare Mode
    {
      target: '[data-tour="compare-mode"]',
      title: (localize as any)('com_custom_tour_step2_title'),
      content: (localize as any)('com_custom_tour_step2_body'),
      placement: 'bottom',
    },
    // Step 3: Token Usage Rates
    {
      target: '[data-tour="token-rates"]',
      title: (localize as any)('com_custom_tour_step3_title'),
      content: (localize as any)('com_custom_tour_step3_body'),
      placement: 'top',
    },
    // Step 4: Powerful Input Tools
    {
      target: '[data-tour="input-tools"]',
      title: (localize as any)('com_custom_tour_step4_title'),
      content: (localize as any)('com_custom_tour_step4_body'),
      placement: 'top',
    },
    // Step 5: The Command Center (Side Panel)
    {
      target: isSmallScreen ? '[data-tour="mobile-nav-toggle"]' : '[data-tour="side-panel"]',
      title: (localize as any)('com_custom_tour_step5_title'),
      content: isSmallScreen
        ? (localize as any)('com_custom_tour_step5_body_mobile')
        : (localize as any)('com_custom_tour_step5_body'),
      placement: isSmallScreen ? 'bottom' : 'right',
    },
  ];

  return steps;
};

/**
 * Get the total number of tour steps
 */
export const getTotalSteps = (): number => 5;
