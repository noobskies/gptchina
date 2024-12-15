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
  const platform = Capacitor.getPlatform();

  useEffect(() => {
    const initializeSocialAuth = async () => {
      if (!isInitialized && isNative) {
        try {
          console.log(`Initializing ${id} auth`);
          const config: InitializeOptions = {
            google:
              platform === 'android'
                ? {
                    webClientId: process.env.GOOGLE_WEB_CLIENT_ID,
                  }
                : {
                    iOSClientId: process.env.GOOGLE_IOS_CLIENT_ID,
                  },
            apple: {
              // For iOS, we only need to initialize with an empty object
              // The SignInWithApple capability in Xcode handles the rest
            },
          };

          await SocialLogin.initialize(config);
          setIsInitialized(true);
          console.log(`${id} auth initialized`);
        } catch (error) {
          console.error(`Failed to initialize ${id} auth:`, error);
        }
      }
    };

    initializeSocialAuth();
  }, [isInitialized, platform, id]);

  const handleNativeSocialLogin = useCallback(async () => {
    console.log(`Native ${id} login clicked`);
    try {
      if (!isInitialized) {
        console.error('Social login not initialized');
        return;
      }

      console.log('Attempting social login...');
      const response = await SocialLogin.login({
        provider: id as 'apple' | 'google',
        options: {}, // For Apple login on iOS, no additional options needed
      });

      console.log(`Response received:`, response);

      if (!response?.result?.idToken) {
        console.error('No ID token in response');
        throw new Error('No ID token received');
      }

      const apiResponse = await fetch(`${serverDomain}/oauth/${id}/mobile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: response.result.idToken,
          profile: response.result.profile,
        }),
        credentials: 'include',
      });

      if (!apiResponse.ok) {
        const errorData = await apiResponse.json();
        throw new Error(errorData.error || 'Authentication failed');
      }

      window.location.href = '/';
    } catch (error) {
      console.error(`Error during ${id} login:`, error);
    }
  }, [id, isInitialized, serverDomain]);

  if (!enabled) return null;

  // For native platforms
  if ((id === 'google' || id === 'apple') && isNative) {
    return (
      <div className="mt-2 flex gap-x-2">
        <button
          aria-label={label}
          className="flex w-full items-center space-x-3 rounded-2xl border border-border-light bg-surface-primary px-5 py-3 text-text-primary transition-colors duration-200 hover:bg-surface-tertiary"
          onClick={handleNativeSocialLogin}
          data-testid={`${id}-native`}
        >
          <Icon />
          <p>{label} (Native)</p>
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
        <p>{label} (Web)</p>
      </a>
    </div>
  );
};

export default SocialButton;
