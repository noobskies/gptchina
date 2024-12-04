import React, { useCallback } from 'react';
import { Capacitor } from '@capacitor/core';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';

type SocialButtonProps = {
  id: string;
  enabled: boolean;
  serverDomain: string;
  oauthPath: string;
  Icon: React.ComponentType;
  label: string;
};

const SocialButton: React.FC<SocialButtonProps> = ({
  id,
  enabled,
  serverDomain,
  oauthPath,
  Icon,
  label,
}) => {
  const handleGoogleLogin = useCallback(async () => {
    if (id === 'google' && Capacitor.isNativePlatform()) {
      try {
        // Initialize without parameters to avoid iOS crash
        await GoogleAuth.initialize();

        // Sign in and get user
        const user = await GoogleAuth.signIn();
        console.log('Google Sign In Success:', user);

        // Get the ID token
        const { idToken } = await GoogleAuth.refresh();
        console.log('Token refresh successful');

        // Send token to your backend - keeping the same endpoint
        const response = await fetch(`${serverDomain}/oauth/google/android`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token: idToken }),
          credentials: 'include', // Important for handling cookies
        });

        if (!response.ok) {
          throw new Error('Authentication failed');
        }

        // Redirect or handle success
        window.location.href = '/';
      } catch (error) {
        console.error('Google Sign In Error:', error);
        if (error instanceof Error) {
          console.error('Error details:', {
            message: error.message,
            stack: error.stack,
            name: error.name,
          });
        }
      }
    } else {
      // Regular web OAuth flow
      window.location.href = `${serverDomain}/oauth/${oauthPath}`;
    }
  }, [id, serverDomain, oauthPath]);

  if (!enabled) {
    return null;
  }

  // For non-Google buttons or web platform, use anchor tag
  if (id !== 'google' || !Capacitor.isNativePlatform()) {
    return (
      <div className="mt-2 flex gap-x-2">
        <a
          aria-label={label}
          className="flex w-full items-center space-x-3 rounded-2xl border border-border-light bg-surface-primary px-5 py-3 text-text-primary transition-colors duration-200 hover:bg-surface-tertiary"
          href={`${serverDomain}/oauth/${oauthPath}`}
          data-testid={id}
        >
          <Icon />
          <p>{label}</p>
        </a>
      </div>
    );
  }

  // For Google button on mobile platform, use button
  return (
    <div className="mt-2 flex gap-x-2">
      <button
        aria-label={label}
        className="flex w-full items-center space-x-3 rounded-2xl border border-border-light bg-surface-primary px-5 py-3 text-text-primary transition-colors duration-200 hover:bg-surface-tertiary"
        onClick={handleGoogleLogin}
        data-testid={id}
      >
        <Icon />
        <p>{label}</p>
      </button>
    </div>
  );
};

export default SocialButton;
