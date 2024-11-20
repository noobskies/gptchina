import React from 'react';
import { FirebaseAuthentication } from '@capacitor-firebase/authentication';
import { Capacitor } from '@capacitor/core';

const SocialButton = ({ id, enabled, serverDomain, oauthPath, Icon, label, useFirebase }) => {
  if (!enabled) {
    return null;
  }

  const handleLogin = async () => {
    if (id === 'google' && Capacitor.isNativePlatform()) {
      try {
        console.log('Starting Google sign-in process...');

        // Clear any existing sessions
        await FirebaseAuthentication.signOut();

        // Sign in with Google
        const result = await FirebaseAuthentication.signInWithGoogle();
        console.log('Sign in result:', {
          hasUser: !!result.user,
          email: result.user?.email,
          hasCredential: !!result.credential,
          hasIdToken: !!result.credential?.idToken,
        });

        if (!result.credential?.idToken) {
          throw new Error('No credential received');
        }

        console.log('Making server request to:', `${serverDomain}/oauth/google`);
        const res = await fetch(`${serverDomain}/oauth/google`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id_token: result.credential.idToken, // Changed from credential to id_token
            platform: Capacitor.getPlatform(),
            debug_info: {
              platform: Capacitor.getPlatform(),
              authProvider: 'firebase',
              hasUser: !!result.user,
              email: result.user?.email,
              tokenParts: result.credential.idToken.split('.').length,
            },
          }),
          credentials: 'include',
        });

        console.log('Server response status:', res.status);

        if (!res.ok) {
          let errorMessage = 'Server authentication failed';
          try {
            const errorData = await res.json();
            errorMessage = errorData.message || errorMessage;
          } catch (e) {
            console.log('Could not parse error response as JSON');
          }
          throw new Error(errorMessage);
        }

        const data = await res.json();
        console.log('Server response:', data);

        // Add small delay before redirect
        await new Promise((resolve) => setTimeout(resolve, 500));
        window.location.href = '/c/new';
      } catch (error) {
        console.error('Detailed Auth Error:', {
          name: error.name,
          message: error.message,
          code: error.code,
          stack: error.stack,
          raw: error,
          timestamp: new Date().toISOString(),
        });

        const errorMessage = `Auth Error: ${error.message || error.code || 'Unknown error'}`;
        window.location.href = `/login?error=${encodeURIComponent(errorMessage)}`;
      }
    } else {
      window.location.href = `${serverDomain}/oauth/${oauthPath}`;
    }
  };

  return (
    <div className="mt-2 flex gap-x-2">
      <button
        aria-label={`${label}`}
        className="flex w-full items-center space-x-3 rounded-2xl border border-border-light bg-surface-primary px-5 py-3 text-text-primary transition-colors duration-200 hover:bg-surface-tertiary"
        onClick={handleLogin}
        data-testid={id}
      >
        <Icon />
        <p>{label}</p>
      </button>
    </div>
  );
};

export default SocialButton;
