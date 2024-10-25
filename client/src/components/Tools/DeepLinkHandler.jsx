import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { App as CapacitorApp } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';
import { Browser } from '@capacitor/browser';

const DeepLinkHandler = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    const handleUrl = async (url: string) => {
      console.log('Processing URL:', url);
      
      try {
        // Parse the URL to handle both http and https
        const urlObj = new URL(url);
        const path = urlObj.pathname;
        const searchParams = new URLSearchParams(urlObj.search);
        
        // Extract parameters
        const userId = searchParams.get('user_id');
        const priceId = searchParams.get('price_id');
        
        console.log('Parsed URL:', {
          path,
          userId,
          priceId
        });

        if (path.includes('/stripe-success')) {
          console.log('Payment success path detected');
          // Ensure Browser is closed before reloading
          try {
            await Browser.close();
          } catch (err) {
            console.warn('Error closing browser:', err);
          }
          
          // Add a small delay before reload
          setTimeout(() => {
            console.log('Reloading app...');
            window.location.reload();
          }, 1000);
          
        } else if (path.includes('/stripe-cancel')) {
          console.log('Payment cancel path detected');
          try {
            await Browser.close();
          } catch (err) {
            console.warn('Error closing browser:', err);
          }
        }
      } catch (err) {
        console.error('Deep link handling error:', err);
      }
    };

    const handler = CapacitorApp.addListener('appUrlOpen', (data) => {
      console.log('Received deep link:', data.url);
      handleUrl(data.url);
    });

    // Handle initial URL if app was opened via deep link
    CapacitorApp.getLaunchUrl().then(result => {
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