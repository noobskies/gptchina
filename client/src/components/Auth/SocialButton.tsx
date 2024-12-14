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
          console.log('Initializing social auth for:', id);

          let config: InitializeOptions = {};

          if (id === 'google') {
            config = {
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
          } else if (id === 'apple') {
            config = {
              apple: {
                clientId: `io.novlisky.signin`,
                redirectUrl:
                  platform === 'android' ? `${serverDomain}/oauth/apple/callback` : undefined,
              },
            };
          }

          console.log('Initializing with config:', config);
          await SocialLogin.initialize(config);
          console.log('Social auth initialized successfully');
          setIsInitialized(true);
        } catch (error) {
          console.error('Failed to initialize Social Auth:', error);
          if (error instanceof Error) {
            console.error('Error details:', error.message);
          }
        }
      }
    };

    initializeSocialAuth();
  }, [isInitialized, id, platform, serverDomain]);

  const handleNativeLogin = useCallback(async () => {
    try {
      console.log('Starting login for:', id);
      alert('Starting login process...');

      if (!isInitialized) {
        console.log('Not initialized yet, returning');
        return;
      }

      console.log(`Attempting ${id} login...`);
      const loginResult = await SocialLogin.login({
        provider: id as 'google' | 'apple',
        options: {
          scopes: id === 'apple' ? ['name', 'email'] : ['email', 'profile'],
        },
      });

      console.log('Login result:', loginResult);
      alert(
        `Got login result: ${JSON.stringify(
          loginResult.result.idToken ? 'token present' : 'no token',
        )}`,
      );

      if (!loginResult?.result?.idToken) {
        throw new Error('No ID token received');
      }

      const response = await fetch(`${serverDomain}/oauth/${id}/mobile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: loginResult.result.idToken,
          profile: loginResult.result.profile,
        }),
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Authentication failed');
      }

      const data = await response.json();
      alert(`Got server response: ${JSON.stringify(data)}`);

      if (data.success && data.user?._id) {
        const redirectUrl = `https://novlisky.io/oauth/login-success?userId=${data.user._id}`;
        alert(`Redirecting to: ${redirectUrl}`);

        // Try using window.location.replace instead of href
        window.location.replace(redirectUrl);

        // If that doesn't work, we can try forcing the URL to have all components:
        // const fullUrl = `https://novlisky.io/oauth/login-success?userId=${data.user._id}&time=${Date.now()}`;
        // window.location.href = fullUrl;
      } else {
        console.log('No user ID found in response');
        alert('No user ID in response');
        window.location.href = '/';
      }
    } catch (error) {
      console.error(`Native ${id} login error:`, error);
      alert(`Error during login: ${error.message}`);
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
          onClick={() => {
            console.log('Button clicked for:', id);
            handleNativeLogin();
          }}
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
