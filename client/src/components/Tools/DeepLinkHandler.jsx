import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { App as CapacitorApp } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';
import { Browser } from '@capacitor/browser';

const DeepLinkHandler = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    const handleUrl = async (url) => {
      console.log('Received deep link:', url);

      try {
        const urlObj = new URL(url);
        const path = urlObj.pathname;
        const searchParams = new URLSearchParams(urlObj.search);

        console.log('Parsed URL:', { path, searchParams: Object.fromEntries(searchParams) });

        // Close any in-app browser if needed
        try {
          await Browser.close();
        } catch (err) {
          console.warn('Error closing browser:', err);
        }

        // Now handle the URL in a general way:
        // For example, if your app defines certain routes, you can map them:
        if (path.includes('/stripe-success')) {
          console.log('Stripe success detected, reloading app...');
          window.location.reload();
        } else if (path.includes('/stripe-cancel')) {
          console.log('Stripe cancel detected, just log or handle gracefully.');
          // Navigate or update state within the app as needed.
        } else if (path.includes('/login-success')) {
          console.log('Login success path detected, navigating to home screen.');
          navigate('/'); // Navigate to your home screen or a specific route in your app
        } else {
          // Catch-all: If the path doesn't match anything you specifically check for
          // you could log it or navigate to a default screen
          console.log('No specific handler for this path, navigating to home.');
          navigate('/');
        }
      } catch (err) {
        console.error('Deep link handling error:', err);
      }
    };

    const handler = CapacitorApp.addListener('appUrlOpen', (data) => {
      handleUrl(data.url);
    });

    // Handle initial URL if app was opened via deep link
    CapacitorApp.getLaunchUrl().then((result) => {
      if (result?.url) {
        console.log('Processing launch URL:', result.url);
        handleUrl(result.url);
      }
    });

    return () => {
      handler.remove();
    };
  }, [navigate]);

  return null;
};

export default DeepLinkHandler;
