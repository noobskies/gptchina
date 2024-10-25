import { useEffect } from 'react';
import { App as CapacitorApp } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';
import { Browser } from '@capacitor/browser';

const DeepLinkHandler = () => {
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) {
      return;
    }

    alert('Deep link handler initialized');

    const handleStripeRedirect = async (url) => {
      alert(`Received redirect URL: ${url}`);
      
      try {
        const parsedUrl = new URL(url);
        const status = parsedUrl.searchParams.get('status');
        const userId = parsedUrl.searchParams.get('user_id');
        const priceId = parsedUrl.searchParams.get('price_id');
        
        alert(`Parsed URL data:
Status: ${status}
User ID: ${userId}
Price ID: ${priceId}`);
        
        try {
          alert('Attempting to close browser');
          await Browser.close();
          alert('Browser closed successfully');
        } catch (closeError) {
          alert(`Error closing browser: ${closeError.message}`);
        }

        if (status === 'success') {
          alert('Payment successful! Reloading page...');
          setTimeout(() => {
            window.location.reload();
          }, 250);
        } else if (status === 'cancelled' || status === 'canceled') {
          alert('Payment was cancelled');
        } else {
          alert(`Unknown status received: ${status}`);
        }
      } catch (error) {
        alert(`Error processing deep link: ${error.message}`);
      }
    };

    const urlHandler = CapacitorApp.addListener('appUrlOpen', (data) => {
      alert(`App URL opened: ${data.url}`);
      
      // Check if it's your domain and contains expected params
      if (data.url.includes('novlisky.io')) {
        handleStripeRedirect(data.url);
      } else {
        alert(`Unexpected URL received: ${data.url}`);
      }
    });

    // Check for initial URL
    CapacitorApp.getLaunchUrl().then(result => {
      if (result && result.url) {
        alert(`Initial launch URL: ${result.url}`);
        if (result.url.includes('novlisky.io')) {
          handleStripeRedirect(result.url);
        }
      }
    });

    return () => {
      urlHandler.remove();
    };
  }, []);

  return null;
};

export default DeepLinkHandler;