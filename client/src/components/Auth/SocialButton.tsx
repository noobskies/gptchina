import React, { useCallback, useEffect, useState } from 'react';
import { Capacitor } from '@capacitor/core';
import { SocialLogin, InitializeOptions } from '@capgo/capacitor-social-login';

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
  const isNative = Capacitor.isNativePlatform();

  useEffect(() => {
    const initializeGoogleAuth = async () => {
      if (!isInitialized && isNative) {
        try {
          const platform = Capacitor.getPlatform();
          alert(`Initializing on ${platform}`);

          const config: InitializeOptions = {
            google:
              platform === 'android'
                ? {
                    webClientId:
                      '397122273433-dkp13np8tm8e5llur593tmupu05764rs.apps.googleusercontent.com',
                  }
                : {
                    iOSClientId:
                      '397122273433-r5aed9p71h30699rtp2qjgcp9gdta8mb.apps.googleusercontent.com',
                  },
          };

          alert('Config: ' + JSON.stringify(config));
          await SocialLogin.initialize(config);
          setIsInitialized(true);
          alert('Initialized successfully');
        } catch (error) {
          alert('Init error: ' + JSON.stringify(error));
          console.error('Failed to initialize Google Auth:', error);
        }
      }
    };

    initializeGoogleAuth();
  }, [isInitialized]);

  const handleNativeGoogleLogin = useCallback(async () => {
    try {
      alert('Starting login');

      if (!isInitialized) {
        alert('Not initialized');
        return;
      }

      const { result } = await SocialLogin.login({
        provider: 'google',
        options: {
          scopes: ['email', 'profile'],
        },
      });

      alert('Login result: ' + JSON.stringify(result));

      if (!result?.idToken) {
        throw new Error('No ID token received');
      }

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
        const errorData = await response.json();
        throw new Error(errorData.error || 'Authentication failed');
      }

      window.location.href = '/';
    } catch (error) {
      alert('Error: ' + JSON.stringify(error));
      console.error('Native Google Sign In Error:', error);
    }
  }, [serverDomain, isInitialized]);

  if (!enabled) {
    return null;
  }

  // For Google on native platforms
  if (id === 'google' && isNative) {
    return (
      <div className="mt-2 flex gap-x-2">
        <button
          aria-label={label}
          className="flex w-full items-center space-x-3 rounded-2xl border border-border-light bg-surface-primary px-5 py-3 text-text-primary transition-colors duration-200 hover:bg-surface-tertiary"
          onClick={handleNativeGoogleLogin}
          data-testid={`${id}-native`}
        >
          <Icon />
          <p>{label}</p>
        </button>
      </div>
    );
  }

  // Default web version remains unchanged
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
