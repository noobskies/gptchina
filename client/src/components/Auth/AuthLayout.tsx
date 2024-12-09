import { useEffect, useMemo, useState, useContext } from 'react';
import { useLocalize } from '~/hooks';
import { ThemeContext } from '~/hooks';
import { BlinkAnimation } from './BlinkAnimation';
import { TStartupConfig } from 'librechat-data-provider';
import SocialLoginRender from './SocialLoginRender';
import { ThemeSelector } from '~/components/ui';
import { Banner } from '../Banners';
import Footer from './Footer';
import Particles, { initParticlesEngine } from '@tsparticles/react';
import { type Container, type ISourceOptions, MoveDirection, OutMode } from '@tsparticles/engine';
import { loadSlim } from '@tsparticles/slim';
import { TypeAnimation } from 'react-type-animation';
import { getDomainData } from '~/utils/domainUtils';
import { Capacitor } from '@capacitor/core';

const ErrorRender = ({ children }: { children: React.ReactNode }) => (
  <div className="mt-16 flex justify-center">
    <div
      className="rounded-md border border-red-500 bg-red-500/10 px-3 py-2 text-sm text-gray-600 dark:text-gray-200"
      role="alert"
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
  error: string | null;
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

  const DisplayError = () => {
    if (startupConfigError !== null && startupConfigError !== undefined) {
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
    } else if (error) {
      return <ErrorRender>{localize(error)}</ErrorRender>;
    }
    return null;
  };

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const particlesLoaded = async (container?: Container): Promise<void> => {
    console.log(container);
  };

  const options: ISourceOptions = useMemo(
    () => ({
      background: {
        color: {
          value: '#2563eb',
        },
      },
      fpsLimit: 120,
      interactivity: {
        events: {
          onClick: {
            enable: true,
            mode: 'push',
          },
        },
        modes: {
          push: {
            quantity: 1,
          },
          repulse: {
            distance: 100,
            duration: 0.5,
          },
        },
      },
      particles: {
        color: {
          value: '#ffffff',
        },
        links: {
          color: '#ffffff',
          distance: 250,
          enable: true,
          opacity: 0.6,
          width: 0.5,
        },
        number: {
          density: {
            enable: true,
          },
          value: 130,
        },
        shape: {
          type: 'line',
        },
        size: {
          value: { min: 1, max: 5 },
        },
        move: {
          direction: 'none',
          random: true,
          enable: true,
          speed: 1.5,
          straight: false,
        },
      },
      detectRetina: false,
    }),
    [],
  );

  return (
    <section className="flex flex-col md:h-screen md:flex-row">
      <div className="relative z-10 flex w-full flex-col items-center justify-center bg-white dark:bg-gray-800 md:w-1/2">
        <div className="relative flex min-h-screen w-full flex-col bg-white dark:bg-gray-900">
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
              {children}
              <SocialLoginRender startupConfig={startupConfig} />
            </div>
          </div>
          <Footer startupConfig={startupConfig} />
        </div>
      </div>
      <div className="relative flex w-full flex-col justify-center bg-blue-500 p-8 dark:bg-blue-600 sm:p-12 md:w-1/2 md:p-16 lg:p-24">
        {init && (
          <Particles
            id="tsparticles"
            particlesLoaded={particlesLoaded}
            options={options}
            className="absolute inset-0"
          />
        )}
        <div className="z-10 text-left">
          <div className="z-10 text-left">
            <TypeAnimation
              sequence={[`${localize('home_welcome_to')} ${logoText}`, 1000]}
              speed={50}
              repeat={Infinity}
              cursor={true}
              className="mb-4 text-3xl font-bold text-white sm:text-4xl lg:text-5xl"
            />
          </div>
          <p className="mb-4 text-base text-white sm:text-lg">{localize('home_intro_text_1')}</p>
          <p className="mb-4 text-base text-white sm:text-lg">{localize('home_intro_text_2')}</p>
          <ul className="mb-4 text-base text-white sm:text-lg">
            <li className="mb-3 sm:mb-0">{localize('home_feature_1')}</li>
            <li className="mb-3 sm:mb-0">{localize('home_feature_2')}</li>
            <li className="mb-3 sm:mb-0">{localize('home_feature_3')}</li>
            <li className="mb-3 sm:mb-0">{localize('home_feature_4')}</li>
            <li className="mb-3 sm:mb-0">{localize('home_feature_5')}</li>
            <li>{localize('home_feature_6')}</li>
          </ul>
        </div>
      </div>
    </section>
  );
}

export default AuthLayout;
