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

          // Only initialize the config for the current provider
          const config: InitializeOptions = {};

          if (id === 'google') {
            config.google =
              platform === 'android'
                ? {
                    webClientId:
                      '397122273433-dkp13np8tm8e5llur593tmupu05764rs.apps.googleusercontent.com',
                  }
                : {
                    iOSClientId:
                      '397122273433-r5aed9p71h30699rtp2qjgcp9gdta8mb.apps.googleusercontent.com',
                  };
          }

          if (id === 'apple') {
            config.apple =
              platform === 'android'
                ? {
                    clientId: 'io.novlisky.signin',
                    redirectUrl: `${serverDomain}/oauth/apple/callback`,
                    scope: 'email name',
                    responseType: 'code id_token',
                    responseMode: 'form_post',
                    state: true,
                  }
                : {
                    clientId: 'io.novlisky.signin',
                  };
          }

          await SocialLogin.initialize(config);
          setIsInitialized(true);
          console.log(`${id} auth initialized`);
        } catch (error) {
          console.log(`Failed to initialize ${id} auth:`, error);
        }
      }
    };

    initializeSocialAuth();
  }, [isInitialized, platform, id, serverDomain]);

  const handleNativeSocialLogin = useCallback(async () => {
    console.log(`Native ${id} login clicked`);
    try {
      if (!isInitialized) {
        console.log('Social login not initialized');
        return;
      }

      console.log('Attempting social login...');
      const response = await SocialLogin.login({
        provider: id as 'apple' | 'google',
        options: {
          scopes: id === 'apple' ? ['email', 'name'] : ['email', 'profile'],
        },
      });

      console.log(`Response received:`, response);

      const { result } = response;
      console.log(`Social Login Result:`, result);

      if (!result?.idToken) {
        console.log(`No ID token in result:`, result);
        throw new Error('No ID token received');
      }

      const apiResponse = await fetch(`${serverDomain}/oauth/${id}/mobile`, {
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

      const responseData = await apiResponse.clone().json();
      console.log(`API Response:`, responseData);

      if (!apiResponse.ok) {
        const errorData = await apiResponse.json();
        throw new Error(errorData.error || 'Authentication failed');
      }

      window.location.href = '/';
    } catch (error) {
      console.log(`Error during ${id} login:`, error);
    }
  }, [id, isInitialized, serverDomain]);

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
