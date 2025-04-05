import { useEffect } from 'react';
import { LocalStorageKeys } from 'librechat-data-provider';
import { getSiteConfig } from '../utils/siteConfig';

/**
 * Component that dynamically updates site metadata based on the current domain
 * This component doesn't render anything visible but updates the document metadata
 */
function SiteMetadata() {
  useEffect(() => {
    // Get the current hostname
    const hostname = window.location.hostname;

    // Get the site configuration based on the hostname
    const siteConfig = getSiteConfig(hostname);

    // Update document title - respect existing app title if present
    const storedAppTitle = localStorage.getItem(LocalStorageKeys.APP_TITLE);
    if (!storedAppTitle) {
      document.title = siteConfig.title;
    }

    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', siteConfig.description);
    }

    // Update favicons
    const favicon16 = document.querySelector('link[rel="icon"][sizes="16x16"]');
    if (favicon16) {
      favicon16.setAttribute('href', siteConfig.favicon16);
    }

    const favicon32 = document.querySelector('link[rel="icon"][sizes="32x32"]');
    if (favicon32) {
      favicon32.setAttribute('href', siteConfig.favicon32);
    }

    const appleIcon = document.querySelector('link[rel="apple-touch-icon"]');
    if (appleIcon) {
      appleIcon.setAttribute('href', siteConfig.appleIcon);
    }

    // Store the site logo path in localStorage for use elsewhere in the app if needed
    localStorage.setItem('siteLogoPath', siteConfig.logo);
  }, []);

  // This component doesn't render anything visible
  return null;
}

export default SiteMetadata;
