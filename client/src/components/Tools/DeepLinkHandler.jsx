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
          const urlParams = new URLSearchParams(url.search);
          const status = urlParams.get('status');
          const internalPath = url.pathname + url.search;

          // Handle payment status if present
          if (status) {
            if (status === 'success') {
              console.log('Payment successful via deep link');
              alert('Payment completed successfully!');
              // Close any open browser windows
              await Browser.close();
              // Refresh the page to update balance
              window.location.reload();
            } else if (status === 'cancelled') {
              console.log('Payment cancelled via deep link');
              alert('Payment was cancelled');
              await Browser.close();
            }
          }

          // Navigate to the appropriate route within your app
          navigate(internalPath);
        } catch (err) {
          console.error('Error handling deep link:', err);
          alert('Error processing payment redirect: ' + err.message);
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