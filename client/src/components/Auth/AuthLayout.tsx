import { useEffect, useState, useContext } from 'react';
import { TranslationKeys, useLocalize, ThemeContext } from '~/hooks';
import { BlinkAnimation } from './BlinkAnimation';
import { TStartupConfig } from 'librechat-data-provider';
import SocialLoginRender from './SocialLoginRender';
import { ThemeSelector } from '~/components/ui';
import { Banner } from '../Banners';
import Footer from './Footer';
import { getDomainData } from '~/utils/domainUtils';
import { Capacitor } from '@capacitor/core';
import ParticlesBackground from './ParticlesBackground';
import WelcomeContent from './WelcomeContent';

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
  const { theme } = useContext(ThemeContext);
  const { logoText, logoLightPath, logoDarkPath } = getDomainData();
  const [init, setInit] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkPlatform = async () => {
      const platform = Capacitor.getPlatform();
      setIsMobile(platform === 'ios' || platform === 'android');
    };

    checkPlatform();
  }, []);

  const hasStartupConfigError = startupConfigError !== null && startupConfigError !== undefined;
  const DisplayError = () => {
    if (hasStartupConfigError) {
      return <ErrorRender>{localize('com_auth_error_login_server')}</ErrorRender>;
    } else if (error === 'com_auth_error_invalid_reset_token') {
      return (
        <ErrorRender>
          {localize('com_auth_error_invalid_reset_token')}{' '}
          <a className="font-semibold text-blue-600 hover:underline" href="/forgot-password">
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
    <section className="flex flex-col md:h-screen md:flex-row">
      <div className="relative z-10 flex w-full flex-col items-center justify-center bg-white dark:bg-gray-800 md:w-1/2">
        <div className="relative flex min-h-screen w-full flex-col bg-white dark:bg-gray-900">
          <Banner />
          <DisplayError />
          <div className="absolute bottom-0 left-0 md:m-4">
            <ThemeSelector />
          </div>

          <div className="flex flex-grow items-center justify-center">
            <div className="w-authPageWidth overflow-hidden bg-white px-6 py-4 dark:bg-gray-900 sm:max-w-md sm:rounded-lg">
              <BlinkAnimation active={isFetching}>
                <div className="mt-12 h-24 w-full bg-cover">
                  <img
                    src={theme === 'dark' ? logoDarkPath : logoLightPath}
                    className="h-full w-full object-contain"
                    alt={logoText}
                  />
                </div>
              </BlinkAnimation>
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
      <div className="relative flex w-full flex-col justify-center bg-blue-500 p-8 dark:bg-blue-600 sm:p-12 md:w-1/2 md:p-16 lg:p-24">
        <ParticlesBackground />
        <WelcomeContent logoText={logoText} />
      </div>
    </section>
  );
}

export default AuthLayout;
