import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { App as CapacitorApp } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';
import { Browser } from '@capacitor/browser';

const DeepLinkHandler = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      alert('Deep link handler initialized');
      
      const handler = CapacitorApp.addListener('appUrlOpen', async (data) => {
        alert('Deep link received: ' + data.url);

        try {
          if (data.url.includes('novlisky.io')) {
            if (data.url.includes('/stripe-success')) {
              alert('Payment successful!');
              await Browser.close();
              window.location.reload();
            } else if (data.url.includes('/stripe-cancel')) {
              alert('Payment cancelled');
              await Browser.close();
            }
          }
        } catch (err) {
          alert('Error: ' + err.message);
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