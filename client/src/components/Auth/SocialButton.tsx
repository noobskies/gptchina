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
        const response = await GoogleAuth.signIn();
        // Use the same endpoint as web OAuth
        const res = await fetch(`${serverDomain}/oauth/google`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id_token: response.authentication.idToken,
          }),
          credentials: 'include',
        });

        if (!res.ok) {
          throw new Error('Failed to authenticate');
        }

        // Handle the response the same way as web OAuth
        window.location.href = '/c/new';
      } catch (error) {
        console.error('Authentication Error:', error);
        window.location.href = '/login?error=Authentication failed';
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
