import React, { useEffect } from 'react';
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
        alert(`Path: ${urlObj.pathname}`);

        // Try to close any open browser
        try {
          await Browser.close();
        } catch (err) {
          console.warn('Error closing browser:', err);
        }

        // Handle Apple Sign In callback
        if (urlObj.pathname.includes('/oauth/apple/callback')) {
          alert('Handling Apple callback');
          try {
            await SocialLogin.handleCallback({
              url,
              provider: 'apple',
            });
            alert('Apple callback handled successfully');
            navigate('/c/new');
          } catch (error) {
            alert(`Error handling Apple callback: ${error.message || String(error)}`);
          }
        }
        // Handle success redirect
        else if (urlObj.pathname.includes('/oauth/login-success')) {
          alert('Login success detected');
          navigate('/');
        } else {
          alert(`Unknown path: ${urlObj.pathname}`);
        }
      } catch (err) {
        alert(`URL handling error: ${err.message || String(err)}`);
      }
    };

    const handler = CapacitorApp.addListener('appUrlOpen', (data) => {
      alert(`App opened with URL: ${data.url}`);
      handleUrl(data.url);
    });

    // Handle initial URL
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
