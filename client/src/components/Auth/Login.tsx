import React from 'react';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetStartupConfig } from 'librechat-data-provider/react-query';
import { GoogleIcon, FacebookIcon, OpenIDIcon, GithubIcon, DiscordIcon } from '~/components';
import { useAuthContext } from '~/hooks/AuthContext';
import { ThemeSelector } from '~/components/ui';
import SocialButton from './SocialButton';
import { getLoginError } from '~/utils';
import { useLocalize } from '~/hooks';
import LoginForm from './LoginForm';
import Particles, { initParticlesEngine } from '@tsparticles/react';
import { type Container, type ISourceOptions, MoveDirection, OutMode } from '@tsparticles/engine';
import { loadSlim } from '@tsparticles/slim';
import { TypeAnimation } from 'react-type-animation';

const apiUrl = process.env.REACT_APP_API_URL;

function Login() {
  const { login, error, isAuthenticated } = useAuthContext();
  const { data: startupConfig } = useGetStartupConfig();
  const localize = useLocalize();
  const navigate = useNavigate();
  const [init, setInit] = useState(false);

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

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/c/new', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  if (!startupConfig) {
    return null;
  }

  const socialLogins = startupConfig.socialLogins ?? [];

  const providerComponents = {
    discord: (
      <SocialButton
        key="discord"
        enabled={startupConfig.discordLoginEnabled}
        serverDomain={startupConfig.serverDomain}
        oauthPath="discord"
        Icon={DiscordIcon}
        label={localize('com_auth_discord_login')}
        id="discord"
      />
    ),
    facebook: (
      <SocialButton
        key="facebook"
        enabled={startupConfig.facebookLoginEnabled}
        serverDomain={startupConfig.serverDomain}
        oauthPath="facebook"
        Icon={FacebookIcon}
        label={localize('com_auth_facebook_login')}
        id="facebook"
      />
    ),
    github: (
      <SocialButton
        key="github"
        enabled={startupConfig.githubLoginEnabled}
        serverDomain={startupConfig.serverDomain}
        oauthPath="github"
        Icon={GithubIcon}
        label={localize('com_auth_github_login')}
        id="github"
      />
    ),
    google: (
      <SocialButton
        key="google"
        enabled={startupConfig.googleLoginEnabled}
        serverDomain={startupConfig.serverDomain}
        oauthPath="google"
        Icon={GoogleIcon}
        label={localize('com_auth_google_login')}
        id="google"
      />
    ),
    openid: (
      <SocialButton
        key="openid"
        enabled={startupConfig.openidLoginEnabled}
        serverDomain={startupConfig.serverDomain}
        oauthPath="openid"
        Icon={() =>
          startupConfig.openidImageUrl ? (
            <img src={startupConfig.openidImageUrl} alt="OpenID Logo" className="h-5 w-5" />
          ) : (
            <OpenIDIcon />
          )
        }
        label={startupConfig.openidLabel}
        id="openid"
      />
    ),
  };

  const privacyPolicy = startupConfig.interface?.privacyPolicy;
  const termsOfService = startupConfig.interface?.termsOfService;

  const privacyPolicyRender = (
    <a
      className="text-xs font-medium text-blue-500"
      href={privacyPolicy?.externalUrl || 'privacy-policy'}
      target="_blank"
      rel="noreferrer"
    >
      {privacyPolicy?.externalUrl ? localize('com_ui_privacy_policy') : 'Privacy Policy'}
    </a>
  );

  const termsOfServiceRender = (
    <a
      className="text-xs font-medium text-blue-500"
      href={termsOfService?.externalUrl || 'terms-of-service'}
      target="_blank"
      rel="noreferrer"
    >
      {termsOfService?.externalUrl ? localize('com_ui_terms_of_service') : 'Terms of Service'}
    </a>
  );

  const domainLogos = {
    'gptchina.io': 'logo-china.png',
    'gptafrica.io': 'logo-africa.png',
    'gptglobal.io': 'logo-global.png',
    'gptiran.io': 'logo-iran.png',
    'gptitaly.io': 'logo-italy.png',
    'gptrussia.io': 'logo-russia.png',
    'gptusa.io': 'logo-usa.png',
    'novlisky.io': 'logo-novlisky.png',
  };

  const domainTitles = {
    'gptchina.io': 'GPT China',
    'gptafrica.io': 'GPT Africa',
    'gptglobal.io': 'GPT Global',
    'gptiran.io': 'GPT Iran',
    'gptitaly.io': 'GPT Italy',
    'gptrussia.io': 'GPT Russia',
    'gptusa.io': 'GPT USA',
    'novlisky.io': 'Novlisky',
  };

  const currentDomain = window.location.hostname;
  const logoImageFilename = domainLogos[currentDomain] || 'logo-novlisky.png';
  const domainTitle = domainTitles[currentDomain] || 'Novlisky';

  return (
    <section className="flex flex-col md:h-screen md:flex-row">
      <div className="fixed bottom-0 left-0 z-50 m-4">
        <ThemeSelector />
      </div>
      <div className="relative z-10 flex w-full flex-col items-center justify-center bg-white dark:bg-gray-800 md:w-1/2">
        <div className="w-full overflow-hidden bg-white px-6 py-4 dark:bg-gray-800 sm:max-w-md sm:rounded-lg">
          <img
            src={`/assets/${logoImageFilename}`}
            className="mx-auto mb-10 h-16 w-auto"
            alt="Logo"
          />
          {error && (
            <div
              className="rounded-md border border-red-500 bg-red-500/10 px-3 py-2 text-sm text-gray-600 dark:text-gray-200"
              role="alert"
            >
              {localize(getLoginError(error))}
            </div>
          )}
          {startupConfig.emailLoginEnabled && <LoginForm onSubmit={login} />}
          {startupConfig.registrationEnabled && (
            <p className="my-4 text-center text-sm font-light text-gray-700 dark:text-white">
              {' '}
              {localize('com_auth_no_account')}{' '}
              <a href="/register" className="p-1 font-medium text-blue-500">
                {localize('com_auth_sign_up')}
              </a>
            </p>
          )}
          {startupConfig.socialLoginEnabled && (
            <>
              {startupConfig.emailLoginEnabled && (
                <>
                  <div className="relative mt-6 flex w-full items-center justify-center border border-t uppercase">
                    <div className="absolute bg-white px-3 text-xs text-black dark:bg-gray-900 dark:text-white">
                      Or
                    </div>
                  </div>
                  <div className="mt-8" />
                </>
              )}
              <div className="mt-2">
                {socialLogins.map((provider) => providerComponents[provider] || null)}
              </div>
            </>
          )}
          <div className="mt-4 flex justify-center gap-4 align-middle">
            {privacyPolicyRender}
            {privacyPolicyRender && termsOfServiceRender && (
              <div className="border-r-[1px] border-gray-300" />
            )}
            {termsOfServiceRender}
          </div>
        </div>
      </div>
      <div className="relative flex w-full flex-col justify-center bg-blue-500 p-24 dark:bg-blue-600 md:w-1/2">
        <Particles
          id="tsparticles"
          particlesLoaded={particlesLoaded}
          options={options}
          className="absolute inset-0"
        />
        <div className="z-10 text-left">
          <div className="z-10 text-left">
            <TypeAnimation
              sequence={[
                // Same substring at the start will only be typed once, initially
                `${localize('home_welcome_to')} ${domainTitle}`,
                1000,
              ]}
              speed={50}
              repeat={Infinity}
              cursor={true}
              className="mb-4 text-5xl font-bold text-white"
            />
          </div>
          <p className="mb-4 text-lg text-white">{localize('home_intro_text_1')}</p>
          <p className="mb-4 text-lg text-white">{localize('home_intro_text_2')}</p>
          <ul className="mb-4 text-lg text-white">
            <li>{localize('home_feature_1')}</li>
            <li>{localize('home_feature_2')}</li>
            <li>{localize('home_feature_3')}</li>
            <li>{localize('home_feature_4')}</li>
            <li>{localize('home_feature_5')}</li>
            <li>{localize('home_feature_6')}</li>
          </ul>
        </div>
      </div>
    </section>
  );
}

export default Login;
