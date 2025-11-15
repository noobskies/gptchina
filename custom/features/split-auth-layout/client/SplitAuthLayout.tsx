/**
 * CUSTOM: gptchina fork
 * SplitAuthLayout Component
 * Main wrapper component that creates the split authentication layout
 * Drop-in replacement for AuthLayout with clean image-based split design
 */

import { ThemeSelector } from '@librechat/client';
import { ChevronDown } from 'lucide-react';
import type { SplitAuthLayoutProps } from '../shared/types';
import { ErrorMessage } from '~/components/Auth/ErrorMessage';
import SocialLoginRender from '~/components/Auth/SocialLoginRender';
import { BlinkAnimation } from '~/components/Auth/BlinkAnimation';
import { useLocalize } from '~/hooks';
import Footer from '~/components/Auth/Footer';
import { FeaturesPanel } from './FeaturesPanel';

export function SplitAuthLayout({
  children,
  header,
  isFetching,
  startupConfig,
  startupConfigError,
  pathname,
  error,
}: SplitAuthLayoutProps) {
  const localize = useLocalize();

  const hasStartupConfigError = startupConfigError !== null && startupConfigError !== undefined;
  const DisplayError = () => {
    if (hasStartupConfigError) {
      return (
        <div className="mx-auto sm:max-w-sm">
          <ErrorMessage>{localize('com_auth_error_login_server')}</ErrorMessage>
        </div>
      );
    } else if (error === 'com_auth_error_invalid_reset_token') {
      return (
        <div className="mx-auto sm:max-w-sm">
          <ErrorMessage>
            {localize('com_auth_error_invalid_reset_token')}{' '}
            <a className="font-semibold text-green-600 hover:underline" href="/forgot-password">
              {localize('com_auth_click_here')}
            </a>{' '}
            {localize('com_auth_to_try_again')}
          </ErrorMessage>
        </div>
      );
    } else if (error != null && error) {
      return (
        <div className="mx-auto sm:max-w-sm">
          <ErrorMessage>{localize(error)}</ErrorMessage>
        </div>
      );
    }
    return null;
  };

  const handleScrollToFeatures = () => {
    document.getElementById('features-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="grid min-h-screen grid-cols-1 md:h-screen md:grid-cols-2 md:overflow-hidden">
      {/* Right Side - Auth Forms - Shows FIRST on mobile */}
      <div className="relative order-1 flex h-screen items-center justify-center p-6 md:order-2 md:min-h-0">
        <div className="mx-auto w-full max-w-md p-6">
          <BlinkAnimation active={isFetching}>
            <div className="mb-8 flex justify-center">
              <img
                src="assets/logo-china.png"
                className="h-12 object-contain"
                alt={localize('com_ui_logo', { 0: startupConfig?.appTitle ?? 'LibreChat' })}
              />
            </div>
          </BlinkAnimation>

          <DisplayError />

          <div className="mb-8">
            {!hasStartupConfigError && !isFetching && (
              <h1
                className="text-4xl font-bold text-slate-900 dark:text-white"
                style={{ userSelect: 'none' }}
              >
                {header}
              </h1>
            )}
          </div>

          <div className="space-y-6">
            {children}
            {!pathname.includes('2fa') &&
              (pathname.includes('login') || pathname.includes('register')) && (
                <SocialLoginRender startupConfig={startupConfig} />
              )}
          </div>

          <div className="mt-8">
            <Footer startupConfig={startupConfig} />
          </div>

          <div className="absolute bottom-4 left-4">
            <ThemeSelector />
          </div>
        </div>

        {/* Down Arrow - Only visible on mobile */}
        <button
          onClick={handleScrollToFeatures}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 transform animate-bounce md:hidden"
          aria-label="Scroll to features"
        >
          <ChevronDown className="h-8 w-8 text-gray-400 dark:text-gray-500" />
        </button>
      </div>

      {/* Left Side - Features Panel - Shows SECOND on mobile */}
      <div
        id="features-section"
        className="order-2 flex items-center justify-center bg-blue-600 py-8 dark:bg-blue-700 md:order-1 md:overflow-y-auto md:py-0"
      >
        <FeaturesPanel />
      </div>
    </div>
  );
}
