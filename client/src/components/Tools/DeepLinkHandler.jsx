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
          const url = new URL(data.url);
          
          // If this is a return from Stripe payment
          if (url.host.includes('novlisky.io')) {
            alert('Detected return to novlisky.io');
            
            const status = url.searchParams.get('status');
            
            // Close the browser first
            await Browser.close();
            
            // Handle different payment statuses
            if (status === 'success') {
              alert('Payment successful!');
              // Refresh the app to update balance
              window.location.reload();
            } else if (status === 'cancelled') {
              alert('Payment was cancelled');
              // Just navigate back to dashboard without refresh
              navigate('/c/new', { replace: true });
            } else {
              // If no status, just close the browser
              alert('No payment status found');
            }
          } else {
            // Handle other deep links normally
            const internalPath = url.pathname + url.search;
            navigate(internalPath);
          }
        } catch (err) {
          alert('Error handling deep link:', err);
          alert('Error processing payment return: ' + err.message);
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