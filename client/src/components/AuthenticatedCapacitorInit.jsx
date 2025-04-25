import { useEffect } from 'react';
import { revenueCatService } from '~/services/RevenueCatService';
import { useAuthContext } from '~/hooks/AuthContext';

/**
 * Component that initializes Capacitor functionality that requires authentication
 * This component must be rendered within the AuthContextProvider
 */
const AuthenticatedCapacitorInit = () => {
  const { user, isAuthenticated } = useAuthContext();

  // Initialize RevenueCat when user authentication changes
  useEffect(() => {
    const initRevenueCat = async () => {
      try {
        // Initialize RevenueCat if user is authenticated
        if (isAuthenticated && user?.id) {
          const initialized = await revenueCatService.initialize(user.id);
          console.log('RevenueCat initialization status:', initialized);
        }
      } catch (error) {
        console.error('Error initializing RevenueCat:', error);
      }
    };

    initRevenueCat();
  }, [user, isAuthenticated]);

  // This component doesn't render anything
  return null;
};

export default AuthenticatedCapacitorInit;
