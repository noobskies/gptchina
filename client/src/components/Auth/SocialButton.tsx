// SocialButton.tsx
import React from 'react';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { Capacitor } from '@capacitor/core';

const SocialButton = ({ id, enabled, serverDomain, oauthPath, Icon, label }) => {
  if (!enabled) {
    return null;
  }

  const handleLogin = async () => {
    if (id === 'google' && Capacitor.isNativePlatform()) {
      try {
        // Force sign out first to clear any existing state
        console.log('Clearing previous auth state...');
        await GoogleAuth.signOut();

        // Check if we're initialized
        console.log('Starting Google sign-in process...');
        const platform = Capacitor.getPlatform();
        console.log('Platform:', platform);

        // Re-initialize with minimal config
        await GoogleAuth.initialize({
          scopes: ['profile', 'email'],
          grantOfflineAccess: true,
        });

        console.log('Attempting sign in...');
        const response = await GoogleAuth.signIn();
        console.log('Sign in response:', JSON.stringify(response, null, 2));

        if (!response?.authentication?.idToken) {
          throw new Error('No authentication token received');
        }

        console.log('Making server request...');
        const res = await fetch(`${serverDomain}/oauth/google`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id_token: response.authentication.idToken,
            // Include additional verification data
            platform: platform,
            email: response.email,
          }),
          credentials: 'include',
        });

        console.log('Server response status:', res.status);
        const data = await res.json();
        console.log('Server response:', data);

        if (!res.ok) {
          throw new Error(data.message || 'Server authentication failed');
        }

        window.location.href = '/c/new';
      } catch (error) {
        console.error('Detailed Auth Error:', {
          name: error.name,
          message: error.message,
          stack: error.stack,
          error,
        });

        // More descriptive error for debugging
        const errorMessage = 'Auth Error: ' + (error.message || 'Unknown error');
        window.location.href = `/login?error=${encodeURIComponent(errorMessage)}`;
      }
    } else {
      // Regular web OAuth flow
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
