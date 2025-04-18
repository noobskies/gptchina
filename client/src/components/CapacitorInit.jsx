import { useEffect } from 'react';
import { initializeCapacitorAuth } from '~/utils/capacitorAuth';

/**
 * Component that initializes Capacitor functionality on app start
 */
const CapacitorInit = () => {
  useEffect(() => {
    const init = async () => {
      try {
        // Initialize Capacitor authentication
        await initializeCapacitorAuth();
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
