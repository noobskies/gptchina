import { Capacitor } from '@capacitor/core';

/**
 * Check if the current device is a mobile device.
 * This detection covers both native mobile apps and mobile web browsers.
 *
 * @returns {boolean} True if the current device is a mobile device, false otherwise.
 */
export function isMobileDevice(): boolean {
  // Check if window exists (for SSR)
  if (typeof window === 'undefined') {
    return false;
  }

  // First check if running in a native Capacitor environment
  if (Capacitor.isNativePlatform()) {
    return true;
  }

  // For mobile web browsers:
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  const isSmallScreen = window.innerWidth <= 768; // Common breakpoint for mobile devices

  // Check for mobile user agent
  const userAgent = navigator.userAgent.toLowerCase();
  const mobileRegex = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i;
  const isMobileUserAgent = mobileRegex.test(userAgent);

  return (isTouchDevice && isSmallScreen) || isMobileUserAgent;
}
