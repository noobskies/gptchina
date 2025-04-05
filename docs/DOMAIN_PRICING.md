# Domain-Specific Pricing System

This document explains how the domain-specific pricing system works across multiple domains:

- gptafrica.io
- gptchina.io
- novlisky.io

## Overview

The application now supports different pricing structures for each domain while maintaining a single codebase. This allows for market-specific pricing strategies, currencies, and payment methods.

## Configuration

All pricing configuration is centralized in the site configuration file:

```javascript
// client/src/utils/siteConfig.js
export const siteConfigs = {
  'gptafrica.io': {
    // Basic metadata
    title: 'GPT Africa',
    description: '...',
    // ... other metadata

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
        // Additional packages
      ],
      paymentMethods: ['card', 'bitcoin'],
    },
  },

  'gptchina.io': {
    // ... metadata
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
        // Additional packages
      ],
      paymentMethods: ['wechat', 'alipay', 'card'],
    },
  },

  // ... other domains
};
```

## Key Components

### 1. `CheckoutModal` Component

The `CheckoutModal` now detects the current domain and loads the appropriate pricing configuration:

- Shows token packages with domain-specific pricing
- Displays prices in the correct currency format
- Filters payment methods based on domain configuration
- Passes currency information to the payment API

### 2. Stripe Integration

The Stripe API backend has been updated to support multiple currencies:

- Accepts currency parameter from the frontend
- Creates payment intents in the specified currency
- Records currency information in transaction records

## Transaction Flow

1. User visits the site on a specific domain (e.g., gptafrica.io)
2. The system detects the domain and loads the corresponding pricing configuration
3. User selects a token package and payment method from the available options
4. The payment is processed in the domain's currency
5. Transaction is recorded with currency information

## Adding a New Domain with Custom Pricing

To add a new domain with its own pricing structure:

1. Add the domain to `siteConfig.js` with the appropriate metadata
2. Configure the pricing section:
   ```javascript
   pricing: {
     currency: 'EUR', // 3-letter currency code
     currencySymbol: '€', // Display symbol
     tokenPackages: [...], // Array of package options
     paymentMethods: [...] // Array of payment method IDs
   }
   ```
3. Ensure the Stripe account is configured to accept the currency

## Considerations

### Currency Support

Make sure your Stripe account is configured to accept all currencies you plan to use. Different regions may have different payment method requirements.

### Exchange Rates

The pricing structure is fixed per domain. If you want to update prices based on current exchange rates, you'll need to implement a separate system to periodically update the configuration.

### Payment Methods

Some payment methods may only be available in certain regions. The `paymentMethods` array in the domain configuration allows you to control which payment options appear for each domain.

## Testing

To test domain-specific pricing:

1. Modify your local hosts file to map the domains to your local development server
2. Access the application through each domain (e.g., http://gptafrica.io:3000)
3. Verify that the correct pricing, currency, and payment methods are displayed
4. Test the payment flow with Stripe test credentials
