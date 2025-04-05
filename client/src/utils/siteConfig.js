/**
 * Site configuration for multiple domains
 * This file provides centralized metadata management for different domains:
 * - gptafrica.io
 * - gptchina.io
 * - novlisky.io
 */

/**
 * Configuration object containing metadata for each domain
 */
export const siteConfigs = {
  'gptafrica.io': {
    title: 'GPT Africa',
    description: 'An open source chat application optimized for Africa',
    favicon16: '/assets/favicon-africa-16x16.png',
    favicon32: '/assets/favicon-africa-32x32.png',
    logo: '/assets/logo-africa.png',
    appleIcon: '/assets/apple-touch-icon-180x180.png',
  },
  'gptchina.io': {
    title: 'GPT China',
    description: 'An open source chat application optimized for China',
    favicon16: '/assets/favicon-china-16x16.png',
    favicon32: '/assets/favicon-china-32x32.png',
    logo: '/assets/logo-china.png',
    appleIcon: '/assets/apple-touch-icon-180x180.png',
  },
  'novlisky.io': {
    title: 'Novlisky',
    description: 'An open source chat application with support for multiple AI models',
    favicon16: '/assets/favicon-novlisky-16x16.png',
    favicon32: '/assets/favicon-novlisky-32x32.png',
    logo: '/assets/logo-novlisky.png',
    appleIcon: '/assets/apple-touch-icon-180x180.png',
  },
  // Default fallback config if domain doesn't match
  default: {
    title: 'Novlisky',
    description: 'An open source chat application with support for multiple AI models',
    favicon16: '/assets/favicon-16x16.png',
    favicon32: '/assets/favicon-32x32.png',
    logo: '/assets/logo-novlisky.png',
    appleIcon: '/assets/apple-touch-icon-180x180.png',
  },
};

/**
 * Returns the site configuration based on the hostname
 * @param {string} hostname - The hostname from window.location.hostname
 * @returns {Object} The site configuration for the specified domain or default if not found
 */
export const getSiteConfig = (hostname) => {
  // Remove www. prefix if present
  const domain = hostname.replace(/^www\./, '');
  return siteConfigs[domain] || siteConfigs.default;
};
