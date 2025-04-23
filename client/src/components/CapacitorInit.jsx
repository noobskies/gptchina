import { useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { initializeCapacitorAuth } from '~/utils/capacitorAuth';
import { statusBarUtils } from '~/utils/statusBarUtils';

/**
 * Component that initializes Capacitor functionality on app start
 * that doesn't require authentication
 */
const CapacitorInit = () => {
  useEffect(() => {
    const init = async () => {
      try {
        // Initialize Capacitor authentication
        await initializeCapacitorAuth();

        // Initialize and configure StatusBar properly
        if (Capacitor.isNativePlatform()) {
          await statusBarUtils.initialize();
        }
      } catch (error) {
        console.error('Error initializing Capacitor:', error);
      }
    };

    init();
  }, []);

  // This component doesn't render anything
  return null;
};

export default CapacitorInit;
