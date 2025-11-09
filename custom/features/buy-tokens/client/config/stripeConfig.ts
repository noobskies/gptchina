/**
 * CUSTOM: gptchina fork
 *
 * Feature: Buy Tokens (Stripe Integration)
 * Created: 2025-11-09
 * Upstream Impact: None (standalone module)
 *
 * Stripe Elements appearance configuration.
 */

import type { Appearance } from '@stripe/stripe-js';

/**
 * Get Stripe Elements appearance configuration based on theme
 * @param isDarkMode - Whether dark mode is active
 * @returns Stripe Appearance configuration
 */
export const getStripeAppearance = (isDarkMode: boolean): Appearance => {
  return {
    theme: isDarkMode ? 'night' : 'stripe',
    labels: 'floating',
    variables: {
      colorPrimary: '#0066FF',
      colorBackground: isDarkMode ? '#1F2937' : '#F9FAFB',
      colorText: isDarkMode ? '#F9FAFB' : '#1F2937',
      colorDanger: '#EF4444',
      fontFamily:
        'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      fontSizeBase: '16px',
      spacingUnit: '4px',
      borderRadius: '8px',
    },
    rules: {
      '.Input': {
        color: isDarkMode ? '#F9FAFB' : '#1F2937',
        backgroundColor: isDarkMode ? '#374151' : '#F9FAFB',
        borderColor: isDarkMode ? '#4B5563' : '#E5E7EB',
        fontSize: '16px',
        padding: '10px 14px',
      },
      '.Input:focus': {
        borderColor: '#0066FF',
        boxShadow: '0 0 0 1px #0066FF',
      },
      '.Label': {
        color: isDarkMode ? '#D1D5DB' : '#6B7280',
        fontSize: '14px',
        fontWeight: '500',
      },
      '.Error': {
        color: '#EF4444',
      },
    },
  };
};
