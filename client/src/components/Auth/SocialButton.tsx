import React from 'react';
import { Capacitor } from '@capacitor/core';
import { Browser } from '@capacitor/browser';

const SocialButton = ({ id, enabled, serverDomain, oauthPath, Icon, label }) => {
  if (!enabled) return null;

  const isMobile = Capacitor.isNativePlatform();

  const handleSignIn = async () => {
    const oauthUrl = `${serverDomain}/oauth/${oauthPath}`;

    if (isMobile) {
      // Open the OAuth URL in the system browser
      await Browser.open({ url: oauthUrl });
    } else {
      // For web, redirect as usual
      window.location.href = oauthUrl;
    }
  };

  return (
    <div className="mt-2 flex gap-x-2">
      <button
        aria-label={label}
        className="flex w-full items-center space-x-3 rounded-2xl border border-border-light bg-surface-primary px-5 py-3 text-text-primary transition-colors duration-200 hover:bg-surface-tertiary"
        onClick={handleSignIn}
        data-testid={id}
      >
        <Icon />
        <p>{label}</p>
      </button>
    </div>
  );
};

export default SocialButton;
