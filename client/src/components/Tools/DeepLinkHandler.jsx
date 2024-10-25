import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { App as CapacitorApp } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';
import { Browser } from '@capacitor/browser';
import { Preferences } from '@capacitor/preferences';

const DeepLinkHandler = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      const handler = CapacitorApp.addListener('appUrlOpen', async (data) => {
        alert('Deep link received: ' + data.url);

        try {
          if (data.url.includes('novlisky.io') && data.url.includes('status=')) {
            // Store payment status before closing
            await Preferences.set({
              key: 'paymentStatus',
              value: data.url
            });
            
            alert('Closing browser');
            await Browser.close();
            
            // Check the status and show appropriate alert
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