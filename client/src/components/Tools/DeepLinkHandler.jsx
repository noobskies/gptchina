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
      alert(`Received URL: ${url}`);

      try {
        const urlObj = new URL(url);
        const path = urlObj.pathname;
        const searchParams = new URLSearchParams(urlObj.search);

        alert(`Path: ${path}\nSearch params: ${urlObj.search}`);

        // Try to close any open in-app browser
        try {
          await Browser.close();
        } catch (err) {
          alert(`Error closing browser: ${err.message}`);
        }

        // Handle Apple OAuth callback
        if (path.includes('/oauth/apple/callback')) {
          alert('Apple callback detected');
          const code = searchParams.get('code');
          const state = searchParams.get('state');

          alert(`Apple code: ${code}\nState: ${state}`);

          if (code) {
            try {
              alert('Attempting to handle Apple callback');
              await SocialLogin.handleCallback({
                url: url,
                provider: 'apple',
              });
              alert('Apple callback handled successfully');
              navigate('/');
            } catch (error) {
              alert(`Error handling Apple callback: ${error.message}`);
            }
          }
        }
        // Handle Apple Sign In success
        else if (path.includes('/oauth/login-success')) {
          alert('Login success detected');
          const token = searchParams.get('token');
          alert(`Token: ${token}`);
          navigate('/');
        }
        // Your existing handlers
        else if (path.includes('/stripe-success')) {
          alert('Stripe success detected');
          window.location.reload();
        } else {
          alert(`Unhandled path: ${path}`);
          navigate('/');
        }
      } catch (err) {
        alert(`Error handling URL: ${err.message}\nURL was: ${url}`);
      }
    };

    const handler = CapacitorApp.addListener('appUrlOpen', (data) => {
      alert(`App URL opened: ${data.url}`);
      handleUrl(data.url);
    });

    // Handle initial URL if app was opened via deep link
    CapacitorApp.getLaunchUrl().then((result) => {
      if (result?.url) {
        alert(`Launch URL: ${result.url}`);
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
