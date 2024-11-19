import React, { useEffect, useState } from 'react';
import { FirebaseAuthentication } from '@capacitor-firebase/authentication';
import { Capacitor } from '@capacitor/core';

const SocialButton = ({ id, enabled, serverDomain, oauthPath, Icon, label }) => {
  const [isAuthInitialized, setIsAuthInitialized] = useState(false);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Check current auth state
        const { user } = await FirebaseAuthentication.getCurrentUser();
        console.log('Initial auth state:', user ? 'Logged in' : 'Not logged in');
        setIsAuthInitialized(true);
      } catch (error) {
        console.error('Auth initialization error:', error);
        setIsAuthInitialized(true);
      }
    };

    initializeAuth();
  }, []);

  if (!enabled) {
    return null;
  }

  const handleLogin = async () => {
    if (id === 'google' && Capacitor.isNativePlatform()) {
      try {
        console.log('Starting Google sign-in process...');

        // Ensure we're starting fresh
        try {
          await FirebaseAuthentication.signOut();
        } catch (e) {
          console.log('No previous session to sign out');
        }

        // Perform Google sign in
        const signInResult = await FirebaseAuthentication.signInWithGoogle();
        console.log('Sign in result:', signInResult);

        if (!signInResult.user) {
          throw new Error('No user data received');
        }

        // Get the ID token
        const { token } = await FirebaseAuthentication.getIdToken();

        if (!token) {
          throw new Error('Failed to get ID token');
        }

        console.log('Making server request...');
        const res = await fetch(`${serverDomain}/oauth/google`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id_token: token,
            platform: Capacitor.getPlatform(),
            email: signInResult.user.email,
            debug_info: {
              providerId: signInResult.user.providerId,
              uid: signInResult.user.uid,
            },
          }),
          credentials: 'include',
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.message || 'Server authentication failed');
        }

        // Add auth state change listener
        FirebaseAuthentication.addListener('authStateChange', (change) => {
          console.log('Auth state changed:', change);
        });

        window.location.href = '/c/new';
      } catch (error) {
        console.error('Detailed Auth Error:', {
          name: error.name,
          message: error.message,
          code: error.code,
          stack: error.stack,
          raw: error,
        });

        const errorMessage = error.message || 'Authentication failed';
        window.location.href = `/login?error=${encodeURIComponent(errorMessage)}`;
      }
    } else {
      window.location.href = `${serverDomain}/oauth/${oauthPath}`;
    }
  };

  return (
    <div className="mt-2 flex gap-x-2">
      <button
        aria-label={`${label}`}
        className="flex w-full items-center space-x-3 rounded-2xl border border-border-light bg-surface-primary px-5 py-3 text-text-primary transition-colors duration-200 hover:bg-surface-tertiary"
        onClick={handleLogin}
        data-testid={id}
        disabled={!isAuthInitialized}
      >
        <Icon />
        <p>{label}</p>
      </button>
    </div>
  );
};

export default SocialButton;
