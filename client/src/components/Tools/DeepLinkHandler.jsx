import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { App as CapacitorApp } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';

const DeepLinkHandler = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      const handler = CapacitorApp.addListener('appUrlOpen', (event) => {
        const url = new URL(event.url);
        const internalPath = url.pathname + url.search;

        // Navigate to the appropriate route within your app
        navigate(internalPath);
      });

      return () => {
        handler.remove();
      };
    }
  }, [navigate]);

  return null;
};

export default DeepLinkHandler;
