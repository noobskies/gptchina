import { SocialLogin } from '@capgo/capacitor-social-login';
import { Capacitor } from '@capacitor/core';
import { jwtDecode } from 'jwt-decode';

/**
 * Initializes social login capabilities for Capacitor
 */
export const initializeCapacitorAuth = async () => {
  if (Capacitor.isNativePlatform()) {
    try {
      // For Google login
      await SocialLogin.initialize({
        google: {
          webClientId: '397122273433-dkp13np8tm8e5llur593tmupu05764rs.apps.googleusercontent.com',
          // This is the web client ID from the google-services.json file
        },
      });
      console.log('Capacitor Social Login initialized');
    } catch (error) {
      console.error('Failed to initialize Capacitor Social Login:', error);
    }
  }
};

/**
 * Checks if the app is running on a native mobile platform
 */
export const isNativeMobile = () => {
  return Capacitor.isNativePlatform();
};

/**
 * Handles Google login through Capacitor on native platforms
 * @returns The login response with tokens and user info
 */
export const nativeGoogleLogin = async () => {
  try {
    const response = await SocialLogin.login({
      provider: 'google',
      options: {
        scopes: ['email', 'profile'],
      },
    });

    console.log('Native Google login successful:', response);

    // The structure depends on the response from the plugin
    // For Google, it might include idToken and profile information
    const result = response.result as any;

    return {
      idToken: result.idToken || result.accessToken?.token || null,
      profile: result.profile || {},
      success: true,
    };
  } catch (error) {
    console.error('Native Google login failed:', error);
    return {
      success: false,
      error,
    };
  }
};

/**
 * Logs out the user from Google through Capacitor
 */
export const nativeGoogleLogout = async () => {
  try {
    await SocialLogin.logout({
      provider: 'google',
    });
    console.log('Native Google logout successful');
    return { success: true };
  } catch (error) {
    console.error('Native Google logout failed:', error);
    return { success: false, error };
  }
};
