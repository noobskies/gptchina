import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { App as CapacitorApp } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';
import { Browser } from '@capacitor/browser';

const DeepLinkHandler = () => {
  const navigate = useNavigate();
  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      alert('Listening for deep links...');
      const handler = CapacitorApp.addListener('appUrlOpen', async (data) => {
        alert('Deep link received: ' + data.url);

        try {
          if (data.url.includes('novlisky.io') && data.url.includes('status=')) {
            alert('Closing browser');
            await Browser.close();
            
            if (data.url.includes('status=success')) {
              alert('Payment successful!');
              window.location.reload();
            } else if (data.url.includes('status=cancelled')) {
              alert('Payment cancelled');
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