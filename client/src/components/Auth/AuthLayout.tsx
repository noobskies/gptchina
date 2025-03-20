import { TranslationKeys, useLocalize } from '~/hooks';
import { BlinkAnimation } from './BlinkAnimation';
import { TStartupConfig } from 'librechat-data-provider';
import SocialLoginRender from './SocialLoginRender';
import { ThemeSelector } from '~/components/ui';
import { Banner } from '../Banners';
import Footer from './Footer';

const ErrorRender = ({ children }: { children: React.ReactNode }) => (
  <div className="mt-16 flex justify-center">
    <div
      role="alert"
      aria-live="assertive"
      className="rounded-md border border-red-500 bg-red-500/10 px-3 py-2 text-sm text-gray-600 dark:text-gray-200"
    >
      {children}
    </div>
  </div>
);

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
      return <ErrorRender>{localize('com_auth_error_login_server')}</ErrorRender>;
    } else if (error === 'com_auth_error_invalid_reset_token') {
      return (
        <ErrorRender>
          {localize('com_auth_error_invalid_reset_token')}{' '}
          <a className="font-semibold text-green-600 hover:underline" href="/forgot-password">
            {localize('com_auth_click_here')}
          </a>{' '}
          {localize('com_auth_to_try_again')}
        </ErrorRender>
      );
    } else if (error != null && error) {
      return <ErrorRender>{localize(error)}</ErrorRender>;
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
            <img
              src="/assets/logo.svg"
              className="h-full w-full object-contain"
              alt={localize('com_ui_logo', { 0: startupConfig?.appTitle ?? 'Novlisky' })}
            />
          </div>
        </BlinkAnimation>
        {!isFetching && (
          <div className="max-w-md text-center">
            <h2 className="mb-6 text-3xl font-bold text-white">
              {startupConfig?.appTitle ?? localize('com_auth_welcome_title')}
            </h2>
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
                  {localize('com_auth_feature_privacy')}
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
                  {localize('com_auth_feature_models')}
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
                  {localize('com_auth_feature_security')}
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
              <img
                src="/assets/logo.svg"
                className="h-full w-full object-contain"
                alt={localize('com_ui_logo', { 0: startupConfig?.appTitle ?? 'Novlisky' })}
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
