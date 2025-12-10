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
    width: 380,
    beaconSize: 36,
  },
  tooltip: {
    borderRadius: '12px',
    fontSize: '14px',
    padding: '20px',
    boxShadow: isDarkMode
      ? '0 20px 60px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.1)'
      : '0 20px 60px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0, 0, 0, 0.05)',
    maxWidth: '380px',
    minWidth: '320px',
  },
  tooltipContainer: {
    textAlign: 'left',
  },
  tooltipTitle: {
    fontSize: '18px',
    fontWeight: 700,
    marginBottom: '10px',
    lineHeight: '1.3',
    color: isDarkMode ? '#f9fafb' : '#111827',
  },
  tooltipContent: {
    fontSize: '14px',
    lineHeight: '1.6',
    padding: '0 0 16px 0',
    color: isDarkMode ? '#e5e7eb' : '#374151',
  },
  tooltipFooter: {
    marginTop: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'nowrap',
    gap: '8px',
  },
  buttonNext: {
    background: 'linear-gradient(to bottom, #3b82f6, #2563eb)',
    borderRadius: '8px',
    color: '#ffffff',
    fontSize: '14px',
    fontWeight: 600,
    padding: '10px 20px',
    border: 'none',
    cursor: 'pointer',
    boxShadow: '0 2px 12px rgba(37, 99, 235, 0.4)',
    transition: 'all 0.2s ease',
    whiteSpace: 'nowrap',
    flexShrink: 0,
  },
  buttonBack: {
    color: isDarkMode ? '#9ca3af' : '#6b7280',
    fontSize: '13px',
    fontWeight: 500,
    marginRight: '8px',
    padding: '8px 16px',
    border: 'none',
    background: 'transparent',
    cursor: 'pointer',
    borderRadius: '8px',
    transition: 'all 0.2s ease',
    whiteSpace: 'nowrap',
    flexShrink: 0,
  },
  buttonSkip: {
    color: isDarkMode ? '#9ca3af' : '#6b7280',
    fontSize: '13px',
    fontWeight: 500,
    padding: '8px 16px',
    border: `1px solid ${isDarkMode ? '#4b5563' : '#d1d5db'}`,
    background: 'transparent',
    cursor: 'pointer',
    borderRadius: '8px',
    transition: 'all 0.2s ease',
    whiteSpace: 'nowrap',
    flexShrink: 0,
  },
  buttonClose: {
    position: 'absolute',
    top: '20px',
    right: '20px',
    color: isDarkMode ? '#9ca3af' : '#6b7280',
    height: '24px',
    width: '24px',
    padding: '4px',
    border: 'none',
    background: 'transparent',
    cursor: 'pointer',
    opacity: 0.6,
    transition: 'opacity 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
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
    boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.65)',
  },
  overlay: {
    // Remove mixBlendMode to use default 'hard-light' for better contrast
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
