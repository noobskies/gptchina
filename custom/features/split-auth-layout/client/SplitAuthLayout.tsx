/**
 * CUSTOM: gptchina fork
 * SplitAuthLayout Component
 * Main wrapper component that creates the split authentication layout
 * Drop-in replacement for AuthLayout with clean image-based split design
 */

import { ThemeSelector } from '@librechat/client';
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

  return (
    <div className="grid h-screen grid-cols-1 overflow-hidden md:grid-cols-2 lg:grid-cols-2">
      {/* Left Side - Features Panel */}
      <div className="flex items-center justify-center overflow-y-auto bg-blue-600 dark:bg-blue-700">
        <FeaturesPanel />
      </div>

      {/* Right Side - Auth Forms */}
      <div className="relative order-1 flex items-center justify-center p-6 md:order-2">
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
      </div>
    </div>
  );
}
