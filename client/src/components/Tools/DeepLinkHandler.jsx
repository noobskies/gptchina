import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { App as CapacitorApp } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';
import { Browser } from '@capacitor/browser';

const DeepLinkHandler = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      const handler = CapacitorApp.addListener('appUrlOpen', async (data) => {
        alert('Deep link received:', data.url);
        
        try {
          if (data.url.includes('novlisky.io')) {
            alert('Detected return to novlisky.io, closing browser');
            alert('Payment process completed');
            await Browser.close();
          }
          
          const url = new URL(data.url);
          const internalPath = url.pathname + url.search;
          navigate(internalPath);
        } catch (err) {
          alert('Error handling deep link:', err);
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