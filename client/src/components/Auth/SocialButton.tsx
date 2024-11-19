import React from 'react';
import { FirebaseAuthentication } from '@capacitor-firebase/authentication';
import { Capacitor } from '@capacitor/core';

const SocialButton = ({ id, enabled, serverDomain, oauthPath, Icon, label }) => {
  if (!enabled) {
    return null;
  }

  const handleLogin = async () => {
    if (id === 'google' && Capacitor.isNativePlatform()) {
      try {
        console.log('Starting Google sign-in process...');

        // Clear any existing sessions
        await FirebaseAuthentication.signOut();

        // Sign in with proper options structure
        const result = await FirebaseAuthentication.signInWithGoogle();

        console.log('Sign in result:', result);

        if (!result.user) {
          throw new Error('No user data received');
        }

        // Get the ID token
        const { token } = await FirebaseAuthentication.getIdToken({
          forceRefresh: true,
        });

        console.log('Making server request...');
        const res = await fetch(`${serverDomain}/oauth/google`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id_token: token,
            platform: Capacitor.getPlatform(),
            email: result.user.email,
            debug_info: {
              platform: Capacitor.getPlatform(),
              timestamp: new Date().toISOString(),
            },
          }),
          credentials: 'include',
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.message || 'Server authentication failed');
        }

        window.location.href = '/c/new';
      } catch (error) {
        console.error('Detailed Auth Error:', {
          name: error.name,
          message: error.message,
          code: error.code,
          stack: error.stack,
          raw: error,
        });

        const errorMessage = `Auth Error: ${error.message || error.code || 'Unknown error'}`;
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
      >
        <Icon />
        <p>{label}</p>
      </button>
    </div>
  );
};

export default SocialButton;
