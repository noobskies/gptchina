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
    const initializeSocialAuth = async () => {
      if (!isInitialized && isNative) {
        try {
          const platform = Capacitor.getPlatform();
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
            apple: {
              clientId: process.env.APPLE_CLIENT_ID || '',
              redirectUri: `${process.env.DOMAIN_SERVER}${process.env.APPLE_CALLBACK_URL}`,
              scope: 'name email',
            },
          };

          await SocialLogin.initialize(config);
          setIsInitialized(true);
        } catch (error) {
          console.error('Failed to initialize Social Auth:', error);
        }
      }
    };

    initializeSocialAuth();
  }, [isInitialized]);

  const handleNativeLogin = useCallback(async () => {
    try {
      if (!isInitialized) {
        return;
      }

      const { result } = await SocialLogin.login({
        provider: id as 'google' | 'apple',
        options: {
          scopes: ['email', 'profile'],
        },
      });

      if (!result?.idToken) {
        throw new Error('No ID token received');
      }

      const response = await fetch(`${serverDomain}/oauth/${id}/mobile`, {
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
      console.error(`Native ${id} login error:`, error);
    }
  }, [serverDomain, isInitialized, id]);

  if (!enabled) {
    return null;
  }

  // For native platforms
  if ((id === 'google' || id === 'apple') && isNative) {
    return (
      <div className="mt-2 flex gap-x-2">
        <button
          aria-label={label}
          className="flex w-full items-center space-x-3 rounded-2xl border border-border-light bg-surface-primary px-5 py-3 text-text-primary transition-colors duration-200 hover:bg-surface-tertiary"
          onClick={handleNativeLogin}
          data-testid={`${id}-native`}
        >
          <Icon />
          <p>{label}</p>
        </button>
      </div>
    );
  }

  // Default web version
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
