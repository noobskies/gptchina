import { useState, useEffect } from 'react';
import { useLocalize } from '~/hooks';
import { getSiteConfig } from '~/utils/siteConfig';

/**
 * DynamicLogo component that displays the appropriate logo based on the current domain
 * It either uses the logo path stored in localStorage by SiteMetadata component
 * or fetches it directly based on the current hostname
 *
 * @param {Object} props Component props
 * @param {string} props.alt Alt text for the logo
 * @param {string} props.className CSS classes for the logo
 * @param {string} [props.fallbackLogo] Fallback logo path if domain-specific logo is not found
 */
function DynamicLogo({
  alt = 'Logo',
  className = 'h-full w-full object-contain',
  fallbackLogo = '/assets/logo.svg',
}) {
  const [logoPath, setLogoPath] = useState(fallbackLogo);
  const localize = useLocalize();

  useEffect(() => {
    // First try to get the logo path from localStorage (set by SiteMetadata component)
    const storedLogoPath = localStorage.getItem('siteLogoPath');

    if (storedLogoPath) {
      setLogoPath(storedLogoPath);
    } else {
      // If not found in localStorage, determine it based on the current hostname
      const hostname = window.location.hostname;
      const siteConfig = getSiteConfig(hostname);
      setLogoPath(siteConfig.logo || fallbackLogo);
    }
  }, [fallbackLogo]);

  return <img src={logoPath} className={className} alt={alt || localize('com_ui_logo')} />;
}

export default DynamicLogo;
