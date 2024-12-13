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
          const config: InitializeOptions = {
            // Google config
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
            // Apple config
            apple:
              platform === 'android'
                ? {
                    clientId: 'io.novlisky.signin',
                    redirectUrl: 'https://novlisky.io/oauth/apple/callback',
                  }
                : {
                    clientId: 'io.novlisky.signin',
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
  }, [isInitialized, platform]);

  const handleNativeSocialLogin = useCallback(async () => {
    try {
      if (!isInitialized) {
        alert('Social login not initialized');
        return;
      }

      const response = await SocialLogin.login({
        provider: id as 'apple' | 'google',
        options: {
          scopes: id === 'apple' ? ['email', 'name'] : ['email', 'profile'],
        },
      });

      alert(`Social Login Response: ${JSON.stringify(response, null, 2)}`);

      const { result } = response;
      alert(`Social Login Result: ${JSON.stringify(result, null, 2)}`);

      if (!result?.idToken) {
        alert(`No ID token in result: ${JSON.stringify(result, null, 2)}`);
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
          raw: result,
        }),
        credentials: 'include',
      });

      const responseData = await apiResponse.clone().json();
      alert(`API Response: ${JSON.stringify(responseData, null, 2)}`);

      if (!apiResponse.ok) {
        const errorData = await apiResponse.json();
        throw new Error(errorData.error || 'Authentication failed');
      }

      window.location.href = '/';
    } catch (error) {
      alert(`Native ${id} login error: ${error.message}`);
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
          onClick={handleNativeSocialLogin}
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
