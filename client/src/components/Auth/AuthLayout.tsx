import { ThemeSelector } from '@librechat/client';
import { TStartupConfig } from 'librechat-data-provider';
import { ErrorMessage } from '~/components/Auth/ErrorMessage';
import { TranslationKeys, useLocalize } from '~/hooks';
import SocialLoginRender from './SocialLoginRender';
import { BlinkAnimation } from './BlinkAnimation';
import DynamicLogo from '~/components/ui/DynamicLogo';
import { Banner } from '../Banners';
import Footer from './Footer';

function AuthLayout({
  children,
  header,
  isFetching,
  startupConfig,
  startupConfigError,
  pathname,
  error,
}: {
  children: React.ReactNode;
  header: React.ReactNode;
  isFetching: boolean;
  startupConfig: TStartupConfig | null | undefined;
  startupConfigError: unknown | null | undefined;
  pathname: string;
  error: TranslationKeys | null;
}) {
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
    <div className="relative flex min-h-screen bg-white dark:bg-gray-900">
      <Banner />
      {/* Left Column - Site Information */}
      <div className="hidden flex-col items-center justify-center bg-gradient-to-br from-blue-500 to-blue-600 p-8 dark:from-blue-700 dark:to-blue-800 md:flex md:w-1/2">
        <BlinkAnimation active={isFetching}>
          <div className="mb-8 h-16 w-full bg-cover">
            <DynamicLogo
              alt={localize('com_ui_logo', { 0: startupConfig?.appTitle ?? 'Novlisky' })}
              className="h-full w-full object-contain"
            />
          </div>
        </BlinkAnimation>
        {!isFetching && (
          <div className="max-w-md text-center">
            <p className="mb-8 text-lg text-white text-opacity-90">
              {localize('com_auth_platform_description')}
            </p>
            <div className="space-y-4 text-left">
              <div className="flex items-start">
                <div className="h-6 w-6 flex-shrink-0 text-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <p className="ml-3 text-white text-opacity-90">
                  {localize('com_auth_feature_no_subscriptions')}
                </p>
              </div>
              <div className="flex items-start">
                <div className="h-6 w-6 flex-shrink-0 text-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <p className="ml-3 text-white text-opacity-90">
                  {localize('com_auth_feature_free_tokens')}
                </p>
              </div>
              <div className="flex items-start">
                <div className="h-6 w-6 flex-shrink-0 text-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <p className="ml-3 text-white text-opacity-90">
                  {localize('com_auth_feature_top_models')}
                </p>
              </div>
              <div className="flex items-start">
                <div className="h-6 w-6 flex-shrink-0 text-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <p className="ml-3 text-white text-opacity-90">
                  {localize('com_auth_feature_all_models')}
                </p>
              </div>
              <div className="flex items-start">
                <div className="h-6 w-6 flex-shrink-0 text-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <p className="ml-3 text-white text-opacity-90">
                  {localize('com_auth_feature_purchase_tokens')}
                </p>
              </div>
              <div className="flex items-start">
                <div className="h-6 w-6 flex-shrink-0 text-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <p className="ml-3 text-white text-opacity-90">
                  {localize('com_auth_feature_user_friendly')}
                </p>
              </div>
            </div>
          </div>
        )}
        <div className="absolute bottom-0 left-0 m-4">
          <ThemeSelector />
        </div>
      </div>
      {/* Right Column - Auth Form */}
      <div className="flex w-full flex-col md:w-1/2">
        <DisplayError />
        <div className="flex flex-grow items-center justify-center p-4">
          <div className="w-full max-w-md overflow-hidden bg-white px-6 py-4 dark:bg-gray-900 sm:rounded-lg">
            {/* Mobile Logo (visible only on small screens) */}
            <div className="mb-8 mt-6 h-10 w-full bg-cover md:hidden">
              <DynamicLogo
                alt={localize('com_ui_logo', { 0: startupConfig?.appTitle ?? 'Novlisky' })}
                className="h-full w-full object-contain"
              />
            </div>
            {!hasStartupConfigError && !isFetching && (
              <h1
                className="mb-4 text-center text-3xl font-semibold text-black dark:text-white"
                style={{ userSelect: 'none' }}
              >
                {header}
              </h1>
            )}
            {children}
            {!pathname.includes('2fa') &&
              (pathname.includes('login') || pathname.includes('register')) && (
                <SocialLoginRender startupConfig={startupConfig} />
              )}
          </div>
        </div>
        <Footer startupConfig={startupConfig} />
      </div>
    </div>
  );
}

export default AuthLayout;
