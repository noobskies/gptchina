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
  const [isInitializing, setIsInitializing] = useState(false);
  const isNative = Capacitor.isNativePlatform();

  useEffect(() => {
    const initializeGoogleAuth = async () => {
      if (!isInitialized && !isInitializing && isNative) {
        try {
          setIsInitializing(true);
          const platform = Capacitor.getPlatform();

          if (platform === 'ios') {
            alert('Starting iOS initialization');
          }

          const config: InitializeOptions = {
            google:
              platform === 'android'
                ? {
                    webClientId:
                      '397122273433-dkp13np8tm8e5llur593tmupu05764rs.apps.googleusercontent.com',
                  }
                : platform === 'ios'
                ? {
                    iOSClientId:
                      '397122273433-r5aed9p71h30699rtp2qjgcp9gdta8mb.apps.googleusercontent.com',
                    iOSServerClientId:
                      '397122273433-dkp13np8tm8e5llur593tmupu05764rs.apps.googleusercontent.com',
                  }
                : {},
          };

          if (platform === 'ios') {
            alert('Using config: ' + JSON.stringify(config));
          }

          await SocialLogin.initialize(config);
          setIsInitialized(true);
          if (platform === 'ios') {
            alert('iOS Google Auth initialized successfully');
          }
        } catch (error) {
          if (Capacitor.getPlatform() === 'ios') {
            alert('iOS init error: ' + JSON.stringify(error));
          }
          console.error('Failed to initialize Google Auth:', error);
        } finally {
          setIsInitializing(false);
        }
      }
    };

    initializeGoogleAuth();
  }, []);

  const handleNativeGoogleLogin = useCallback(async () => {
    const platform = Capacitor.getPlatform();

    if (!isInitialized) {
      if (platform === 'ios') {
        alert('Google Auth not initialized yet. Trying to initialize...');
      }
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait a bit
      if (!isInitialized) {
        if (platform === 'ios') {
          alert('Still not initialized after waiting. Please try again.');
        }
        return;
      }
    }

    try {
      if (platform === 'ios') {
        alert('Starting iOS Google Sign In...');
      }

      const { result } = await SocialLogin.login({
        provider: 'google',
        options: {
          scopes: ['email', 'profile'],
          ...(platform === 'ios' && { grantOfflineAccess: true }),
        },
      });

      if (platform === 'ios') {
        alert('Login result: ' + JSON.stringify(result));
      }

      if (!result?.idToken) {
        throw new Error('No ID token received');
      }

      if (platform === 'ios') {
        alert('Making server request');
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
      if (platform === 'ios') {
        alert('iOS Sign In Error: ' + JSON.stringify(error));
      }
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
