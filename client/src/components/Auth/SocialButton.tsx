import React, { useCallback, useEffect, useState } from 'react';
import { Capacitor } from '@capacitor/core';
import { SocialLogin } from '@capgo/capacitor-social-login';

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
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initializeGoogleAuth = async () => {
      if (!isInitialized && Capacitor.isNativePlatform()) {
        try {
          if (Capacitor.getPlatform() === 'android') {
            await SocialLogin.initialize({
              google: {
                webClientId:
                  '397122273433-dkp13np8tm8e5llur593tmupu05764rs.apps.googleusercontent.com',
              },
            });
          } else if (Capacitor.getPlatform() === 'ios') {
            await SocialLogin.initialize({
              google: {
                iOSClientId:
                  '397122273433-r5aed9p71h30699rtp2qjgcp9gdta8mb.apps.googleusercontent.com',
              },
            });
          }
          setIsInitialized(true);
          console.log('Google Auth initialized successfully');
        } catch (error) {
          console.error('Failed to initialize Google Auth:', error);
        }
      }
    };

    initializeGoogleAuth();
  }, [isInitialized]);

  const handleNativeGoogleLogin = useCallback(async () => {
    try {
      console.log('Starting Google Sign In...');

      if (!isInitialized) {
        console.log('Google Auth not initialized');
        return;
      }

      console.log('Attempting login...');
      const { result } = await SocialLogin.login({
        provider: 'google' as const,
        options: {
          scopes: ['email', 'profile'],
        },
      });

      console.log('Login successful, result:', result);

      const response = await fetch(`${serverDomain}/oauth/google/mobile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: result.idToken,
          profile: result.profile,
        }),
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Authentication failed');
      }

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
  }, [serverDomain, isInitialized]);

  if (!enabled) {
    return null;
  }

  if (id === 'google' && Capacitor.isNativePlatform()) {
    return (
      <div className="mt-2 flex gap-x-2">
        <button
          aria-label={label}
          className="flex w-full items-center space-x-3 rounded-2xl border border-border-light bg-surface-primary px-5 py-3 text-text-primary transition-colors duration-200 hover:bg-surface-tertiary"
          onClick={handleNativeGoogleLogin}
          data-testid={id}
        >
          <Icon />
          <p>{label}</p>
        </button>
      </div>
    );
  }

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
};

export default SocialButton;
