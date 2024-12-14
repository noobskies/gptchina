import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { App as CapacitorApp } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';
import { Browser } from '@capacitor/browser';
import { SocialLogin } from '@capgo/capacitor-social-login';

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

        alert('Parsed URL:', { path, searchParams: Object.fromEntries(searchParams) });

        // Try to close any open in-app browser
        try {
          await Browser.close();
        } catch (err) {
          console.warn('Error closing browser:', err);
        }

        // Handle Apple OAuth callback
        if (path.includes('/oauth/apple/callback')) {
          alert('Handling Apple OAuth callback');
          const code = searchParams.get('code');
          const state = searchParams.get('state');

          if (code) {
            try {
              // Let the SocialLogin plugin handle the callback
              await SocialLogin.handleCallback({
                url: url,
                provider: 'apple',
              });
              alert('Successfully handled Apple callback');
              navigate('/');
            } catch (error) {
              alert('Error handling Apple callback:', error);
            }
          }
        }
        // Handle Apple Sign In success
        else if (path.includes('/oauth/login-success')) {
          alert('Apple Sign In success detected');
          navigate('/');
        }
        // Your existing handlers
        else if (path.includes('/stripe-success')) {
          console.log('Stripe success detected, reloading app...');
          window.location.reload();
        } else if (path.includes('/stripe-cancel')) {
          console.log('Stripe cancel detected');
        } else {
          console.log('No specific handler for path:', path);
          navigate('/');
        }
      } catch (err) {
        console.error('Deep link handling error:', err);
        console.error('Error details:', err.message);
      }
    };

    const handler = CapacitorApp.addListener('appUrlOpen', (data) => {
      console.log('App URL opened:', data.url);
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
