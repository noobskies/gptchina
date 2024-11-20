import React from 'react';
import { FirebaseAuthentication } from '@capacitor-firebase/authentication';
import { Capacitor } from '@capacitor/core';

const SocialButton = ({ id, enabled, serverDomain, oauthPath, Icon, label }) => {
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

        if (!result.user) {
          throw new Error('No user data received');
        }

        // Get the ID token
        const { token } = await FirebaseAuthentication.getIdToken({
          forceRefresh: true,
        });

        console.log('Token retrieved', {
          exists: !!token,
          length: token?.length,
          parts: token?.split('.').length,
          header: token ? JSON.parse(atob(token.split('.')[0])) : null,
          hasValidStructure: token?.split('.').length === 3,
        });

        if (!token) {
          throw new Error('Failed to get ID token');
        }

        console.log('Making server request to:', `${serverDomain}/oauth/google`);
        const res = await fetch(`${serverDomain}/oauth/google`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id_token: token,
            platform: Capacitor.getPlatform(),
            email: result.user.email,
            debug_info: {
              platform: Capacitor.getPlatform(),
              firebaseUser: {
                uid: result.user.uid,
                emailVerified: result.user.emailVerified,
                providerId: result.credential?.providerId,
              },
              tokenInfo: {
                length: token.length,
                structure: token.split('.').length === 3 ? 'valid' : 'invalid',
                header: JSON.parse(atob(token.split('.')[0])),
              },
            },
          }),
          credentials: 'include',
        });

        console.log('Server response status:', res.status);
        try {
          const data = await res.json();
          console.log('Server response:', data);
        } catch (e) {
          console.log('Could not parse server response as JSON');
        }

        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(errorText || 'Server authentication failed');
        }

        // Add a small delay before redirect
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
