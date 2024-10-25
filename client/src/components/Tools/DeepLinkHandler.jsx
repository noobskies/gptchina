import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { App as CapacitorApp } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';
import { Browser } from '@capacitor/browser';

const DeepLinkHandler = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      const handler = CapacitorApp.addListener('appUrlOpen', async (event) => {
        console.log('Deep link received:', event.url);
        
        try {
          const url = new URL(event.url);
          
          // If we detect novlisky.io, close the browser
          if (url.host.includes('novlisky.io')) {
            await Browser.close();
          }

          // Still handle the navigation
          const internalPath = url.pathname + url.search;
          navigate(internalPath);
        } catch (err) {
          console.error('Error handling deep link:', err);
        }
      });

      return () => {
        handler.remove();
      };
    }
  }, [navigate]);

  return null;
};

export default DeepLinkHandler;