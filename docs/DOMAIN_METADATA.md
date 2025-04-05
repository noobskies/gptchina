# Domain-Specific Metadata Configuration

This document explains how the domain-specific metadata configuration works across multiple domains:

- gptafrica.io
- gptchina.io
- novlisky.io

## Overview

The application now dynamically updates its metadata (title, description, favicon, and logo) based on the current domain. This allows for different branding across different domains while maintaining a single codebase.

## How It Works

1. **Centralized Configuration**: All domain-specific settings are stored in a single configuration file at `client/src/utils/siteConfig.js`.

2. **Automatic Detection**: The application automatically detects the current domain and applies the appropriate metadata.

3. **Dynamic Updates**: The metadata (document title, description, favicon) and logo are updated at runtime based on the detected domain.

## Configuration File

The configuration file (`client/src/utils/siteConfig.js`) contains settings for each domain:

```javascript
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
  // ... other domains
};
```

## Components

The implementation uses several components:

1. **SiteMetadata**: Updates document metadata (title, description, favicon) based on the current domain.
2. **DynamicLogo**: Displays the appropriate logo based on the current domain.

## Adding a New Domain

To add a new domain:

1. Add the domain configuration to `client/src/utils/siteConfig.js`:

```javascript
'new-domain.com': {
  title: 'New Domain Title',
  description: 'Description for the new domain',
  favicon16: '/assets/favicon-new-16x16.png',
  favicon32: '/assets/favicon-new-32x32.png',
  logo: '/assets/logo-new.png',
  appleIcon: '/assets/apple-touch-icon-new.png',
},
```

2. Add the necessary image assets to the `client/public/assets/` directory.

## Testing

To test the domain-specific metadata, you can:

1. Modify your local hosts file to point the domains to your local development server:

   ```
   127.0.0.1 gptafrica.io
   127.0.0.1 gptchina.io
   127.0.0.1 novlisky.io
   ```

2. Access the application through each domain (e.g., http://gptafrica.io:3000, http://gptchina.io:3000).

3. Verify that the correct title, description, favicon, and logo are displayed for each domain.

## Implementation Details

- The `SiteMetadata` component is mounted in the App component and handles updating the document metadata.
- The domain detection happens at runtime using `window.location.hostname`.
- Domain-specific logos are loaded by the `DynamicLogo` component, which is used throughout the application.
- The site configuration is stored in localStorage to minimize multiple lookups.
