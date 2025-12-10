/**
 * CUSTOM: gptchina fork
 *
 * Feature: Product Tour
 * Created: 2025-12-10
 * Upstream Impact: None (standalone module)
 *
 * Styling configuration for React Joyride tour.
 * Uses LibreChat's design tokens for theme consistency.
 */

import type { Styles } from 'react-joyride';

/**
 * Get tour styles based on current theme
 * Integrates with LibreChat's design system
 */
export const getTourStyles = (isDarkMode: boolean): Partial<Styles> => ({
  options: {
    arrowColor: isDarkMode ? '#1f2937' : '#ffffff',
    backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
    overlayColor: 'rgba(0, 0, 0, 0.65)',
    primaryColor: '#2563eb',
    textColor: isDarkMode ? '#f9fafb' : '#111827',
    zIndex: 10000,
    width: 420,
    beaconSize: 36,
  },
  tooltip: {
    borderRadius: '12px',
    fontSize: '15px',
    padding: '24px',
    boxShadow: isDarkMode
      ? '0 20px 60px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.1)'
      : '0 20px 60px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0, 0, 0, 0.05)',
    maxWidth: '420px',
  },
  tooltipContainer: {
    textAlign: 'left',
  },
  tooltipTitle: {
    fontSize: '20px',
    fontWeight: 700,
    marginBottom: '12px',
    lineHeight: '1.3',
    color: isDarkMode ? '#f9fafb' : '#111827',
  },
  tooltipContent: {
    fontSize: '15px',
    lineHeight: '1.65',
    padding: '0 0 20px 0',
    color: isDarkMode ? '#e5e7eb' : '#374151',
  },
  tooltipFooter: {
    marginTop: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  buttonNext: {
    background: 'linear-gradient(to bottom, #3b82f6, #2563eb)',
    borderRadius: '8px',
    color: '#ffffff',
    fontSize: '15px',
    fontWeight: 600,
    padding: '10px 24px',
    border: 'none',
    cursor: 'pointer',
    boxShadow: '0 2px 12px rgba(37, 99, 235, 0.4)',
    transition: 'all 0.2s ease',
  },
  buttonBack: {
    color: isDarkMode ? '#9ca3af' : '#6b7280',
    fontSize: '14px',
    fontWeight: 500,
    marginRight: '12px',
    padding: '10px 20px',
    border: 'none',
    background: 'transparent',
    cursor: 'pointer',
    borderRadius: '8px',
    transition: 'all 0.2s ease',
  },
  buttonSkip: {
    color: isDarkMode ? '#9ca3af' : '#6b7280',
    fontSize: '14px',
    fontWeight: 500,
    padding: '10px 20px',
    border: `1px solid ${isDarkMode ? '#4b5563' : '#d1d5db'}`,
    background: 'transparent',
    cursor: 'pointer',
    borderRadius: '8px',
    transition: 'all 0.2s ease',
  },
  buttonClose: {
    color: isDarkMode ? '#9ca3af' : '#6b7280',
    height: '20px',
    width: '20px',
    padding: 0,
    border: 'none',
    background: 'transparent',
    cursor: 'pointer',
    opacity: 0.6,
    transition: 'opacity 0.2s ease',
  },
  beaconInner: {
    backgroundColor: '#2563eb',
  },
  beaconOuter: {
    backgroundColor: 'rgba(37, 99, 235, 0.3)',
    border: '3px solid #2563eb',
    boxShadow: '0 0 0 6px rgba(37, 99, 235, 0.1)',
  },
  spotlight: {
    borderRadius: '8px',
  },
  overlay: {
    mixBlendMode: 'normal',
  },
});

/**
 * Custom locale strings for React Joyride buttons
 * These will be replaced with actual i18n keys in the component
 */
export const getTourLocale = (localize: any) => ({
  back: (localize as any)('com_custom_tour_button_back'),
  close: (localize as any)('com_custom_tour_button_close'),
  last: (localize as any)('com_custom_tour_button_finish'),
  next: (localize as any)('com_custom_tour_button_next'),
  open: 'Open',
  skip: (localize as any)('com_custom_tour_button_skip'),
});
