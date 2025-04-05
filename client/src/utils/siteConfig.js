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
    // Domain-specific pricing
    pricing: {
      currency: 'USD',
      currencySymbol: '$',
      tokenPackages: [
        {
          id: '100k',
          tokens: '100k',
          price: 1.0, // Lower price for Africa
          originalPrice: null,
          discount: null,
        },
        {
          id: '500k',
          tokens: '500k',
          price: 4.0,
          originalPrice: 6.0,
          discount: '33% off',
        },
        {
          id: '1m',
          tokens: '1 Million',
          price: 6.0,
          originalPrice: 12.0,
          discount: '50% off',
        },
        {
          id: '10m',
          tokens: '10 Million',
          price: 30.0,
          originalPrice: 120.0,
          discount: '75% off',
        },
      ],
      // Available payment methods for this domain
      paymentMethods: ['card', 'bitcoin'],
    },
  },
  'gptchina.io': {
    title: 'GPT China',
    description: 'An open source chat application optimized for China',
    favicon16: '/assets/favicon-china-16x16.png',
    favicon32: '/assets/favicon-china-32x32.png',
    logo: '/assets/logo-china.png',
    appleIcon: '/assets/apple-touch-icon-180x180.png',
    // Domain-specific pricing
    pricing: {
      currency: 'CNY',
      currencySymbol: '¥',
      tokenPackages: [
        {
          id: '100k',
          tokens: '100k',
          price: 10.0, // Price in Yuan
          originalPrice: null,
          discount: null,
        },
        {
          id: '500k',
          tokens: '500k',
          price: 35.0,
          originalPrice: 50.0,
          discount: '30% off',
        },
        {
          id: '1m',
          tokens: '1 Million',
          price: 55.0,
          originalPrice: 100.0,
          discount: '45% off',
        },
        {
          id: '10m',
          tokens: '10 Million',
          price: 280.0,
          originalPrice: 1000.0,
          discount: '72% off',
        },
      ],
      // Available payment methods for this domain
      paymentMethods: ['wechat', 'alipay', 'card'],
    },
  },
  'novlisky.io': {
    title: 'Novlisky',
    description: 'An open source chat application with support for multiple AI models',
    favicon16: '/assets/favicon-novlisky-16x16.png',
    favicon32: '/assets/favicon-novlisky-32x32.png',
    logo: '/assets/logo-novlisky.png',
    appleIcon: '/assets/apple-touch-icon-180x180.png',
    // Domain-specific pricing
    pricing: {
      currency: 'USD',
      currencySymbol: '$',
      tokenPackages: [
        {
          id: '100k',
          tokens: '100k',
          price: 1.5, // Standard US pricing
          originalPrice: null,
          discount: null,
        },
        {
          id: '500k',
          tokens: '500k',
          price: 5.0,
          originalPrice: 7.5,
          discount: '33% off',
        },
        {
          id: '1m',
          tokens: '1 Million',
          price: 7.5,
          originalPrice: 15.0,
          discount: '50% off',
        },
        {
          id: '10m',
          tokens: '10 Million',
          price: 40.0,
          originalPrice: 150.0,
          discount: '73% off',
        },
      ],
      // Available payment methods for this domain
      paymentMethods: ['card', 'google', 'apple', 'bitcoin'],
    },
  },
  // Default fallback config if domain doesn't match
  default: {
    title: 'Novlisky',
    description: 'An open source chat application with support for multiple AI models',
    favicon16: '/assets/favicon-16x16.png',
    favicon32: '/assets/favicon-32x32.png',
    logo: '/assets/logo-novlisky.png',
    appleIcon: '/assets/apple-touch-icon-180x180.png',
    // Default pricing configuration
    pricing: {
      currency: 'USD',
      currencySymbol: '$',
      tokenPackages: [
        {
          id: '100k',
          tokens: '100k',
          price: 1.5,
          originalPrice: null,
          discount: null,
        },
        {
          id: '500k',
          tokens: '500k',
          price: 5.0,
          originalPrice: 7.5,
          discount: '33% off',
        },
        {
          id: '1m',
          tokens: '1 Million',
          price: 7.5,
          originalPrice: 15.0,
          discount: '50% off',
        },
        {
          id: '10m',
          tokens: '10 Million',
          price: 40.0,
          originalPrice: 150.0,
          discount: '73% off',
        },
      ],
      // Default available payment methods
      paymentMethods: ['card', 'google', 'apple', 'bitcoin', 'wechat', 'alipay'],
    },
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
