import React from 'react';
import { isNativeMobile, nativeGoogleLogin } from '~/utils/capacitorAuth';
import { useAuthContext } from '~/hooks/AuthContext';

type NativeSocialButtonProps = {
  id: string;
  enabled: boolean;
  provider: string;
  Icon: React.ComponentType;
  label: string;
  serverDomain: string;
  oauthPath: string;
};

/**
 * A social login button that uses native authentication for mobile platforms
 * and falls back to web authentication for non-mobile platforms
 */
const NativeSocialButton: React.FC<NativeSocialButtonProps> = ({
  id,
  enabled,
  provider,
  Icon,
  label,
  serverDomain,
  oauthPath,
}) => {
  const { login } = useAuthContext();

  if (!enabled) {
    return null;
  }

  const handleNativeLogin = async () => {
    if (provider === 'google') {
      try {
        const response = await nativeGoogleLogin();

        if (response.success && response.idToken) {
          // Make a request to your backend to validate the token
          const backendResponse = await fetch(`${serverDomain}/api/auth/google/mobile`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              idToken: response.idToken,
              // Include any other necessary information
            }),
            credentials: 'include',
          });

          if (backendResponse.ok) {
            // Refresh the authentication state
            window.location.href = '/chat';
          } else {
            console.error('Backend validation failed:', await backendResponse.text());
          }
        } else {
          console.error('Native login failed:', response.error);
        }
      } catch (error) {
        console.error('Error during native login:', error);
      }
    }
  };

  // For mobile platforms, use native authentication
  if (isNativeMobile()) {
    return (
      <div className="mt-2 flex gap-x-2">
        <button
          aria-label={`${label}`}
          className="flex w-full items-center space-x-3 rounded-2xl border border-border-light bg-surface-primary px-5 py-3 text-text-primary transition-colors duration-200 hover:bg-surface-tertiary"
          onClick={handleNativeLogin}
          data-testid={`native-${id}`}
        >
          <Icon />
          <p>{label}</p>
        </button>
      </div>
    );
  }

  // For web platforms, use regular web-based authentication
  return (
    <div className="mt-2 flex gap-x-2">
      <a
        aria-label={`${label}`}
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

export default NativeSocialButton;
