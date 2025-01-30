import { useForm } from 'react-hook-form';
import React, { useState, useEffect } from 'react';
import { useGetStartupConfig } from 'librechat-data-provider/react-query';
import type { TLoginUser, TStartupConfig } from 'librechat-data-provider';
import type { TAuthContext } from '~/common';
import { useResendVerificationEmail } from '~/data-provider';
import { useLocalize } from '~/hooks';

type TLoginFormProps = {
  onSubmit: (data: TLoginUser) => void;
  startupConfig: TStartupConfig;
  error: Pick<TAuthContext, 'error'>['error'];
  setError: Pick<TAuthContext, 'setError'>['setError'];
};

const LoginForm: React.FC<TLoginFormProps> = ({ onSubmit, startupConfig, error, setError }) => {
  const localize = useLocalize();
  const {
    register,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm<TLoginUser>();
  const [showResendLink, setShowResendLink] = useState<boolean>(false);

  const { data: config } = useGetStartupConfig();
  const useUsernameLogin = config?.ldap?.username;

  useEffect(() => {
    if (error && error.includes('422') && !showResendLink) {
      setShowResendLink(true);
    }
  }, [error, showResendLink]);

  const resendLinkMutation = useResendVerificationEmail({
    onMutate: () => {
      setError(undefined);
      setShowResendLink(false);
    },
  });

  if (!startupConfig) {
    return null;
  }

  const renderError = (fieldName: string) => {
    const errorMessage = errors[fieldName]?.message;
    return errorMessage ? (
      <span role="alert" className="mt-1 text-sm text-red-500 dark:text-red-900">
        {String(errorMessage)}
      </span>
    ) : null;
  };

  const handleResendEmail = () => {
    const email = getValues('email');
    if (!email) {
      return setShowResendLink(false);
    }
    resendLinkMutation.mutate({ email });
  };

  return (
    <>
      <style jsx global>{`
        input:-webkit-autofill,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:focus,
        input:-webkit-autofill:active {
          -webkit-background-clip: text;
          -webkit-text-fill-color: #000000;
          transition: background-color 5000s ease-in-out 0s;
          box-shadow: inset 0 0 20px 20px #ffffff;
        }
        .dark input:-webkit-autofill,
        .dark input:-webkit-autofill:hover,
        .dark input:-webkit-autofill:focus,
        .dark input:-webkit-autofill:active {
          -webkit-text-fill-color: #ffffff;
          box-shadow: inset 0 0 20px 20px #000000;
        }
      `}</style>
      {showResendLink && (
        <div className="mt-2 rounded-md border border-blue-500 bg-blue-500/10 px-3 py-2 text-sm text-gray-600 dark:text-gray-200">
          {localize('com_auth_email_verification_resend_prompt')}
          <button
            type="button"
            className="ml-2 text-blue-600 hover:underline"
            onClick={handleResendEmail}
            disabled={resendLinkMutation.isLoading}
          >
            {localize('com_auth_email_resend_link')}
          </button>
        </div>
      )}
      <form
        className="mt-6"
        aria-label="Login form"
        method="POST"
        onSubmit={handleSubmit((data) => onSubmit(data))}
      >
        <div className="mb-4">
          <div className="relative">
            <input
              type="text"
              id="email"
              autoComplete={useUsernameLogin ? 'username' : 'email'}
              aria-label={localize('com_auth_email')}
              {...register('email', {
                required: localize('com_auth_email_required'),
                maxLength: { value: 120, message: localize('com_auth_email_max_length') },
                pattern: {
                  value: useUsernameLogin ? /\S+/ : /\S+@\S+\.\S+/,
                  message: localize('com_auth_email_pattern'),
                },
              })}
              aria-invalid={!!errors.email}
              className="
                webkit-dark-styles transition-color peer w-full rounded-2xl border border-border-light
                bg-surface-primary px-3.5 pb-2.5 pt-3 text-text-primary duration-200 
                focus:border-blue-500 focus:outline-none
              "
              placeholder=" "
            />
            <label
              htmlFor="email"
              className="
                absolute start-3 top-1.5 z-10 origin-[0] -translate-y-4 scale-75 transform bg-surface-primary px-2 text-sm text-text-secondary-alt duration-200
                peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100
                peer-focus:top-1.5 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 peer-focus:text-blue-600 dark:peer-focus:text-blue-500
                rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4
                "
            >
              {useUsernameLogin
                ? localize('com_auth_username').replace(/ \(.*$/, '')
                : localize('com_auth_email_address')}
            </label>
          </div>
          {renderError('email')}
        </div>
        <div className="mb-2">
          <div className="relative">
            <input
              type="password"
              id="password"
              autoComplete="current-password"
              aria-label={localize('com_auth_password')}
              {...register('password', {
                required: localize('com_auth_password_required'),
                minLength: { value: 8, message: localize('com_auth_password_min_length') },
                maxLength: { value: 128, message: localize('com_auth_password_max_length') },
              })}
              aria-invalid={!!errors.password}
              className="webkit-dark-styles peer block w-full appearance-none rounded-md border border-gray-300 bg-transparent px-3.5 pb-3.5 pt-4 text-sm text-text-primary focus:border-blue-500 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-white dark:focus:border-blue-500"
              placeholder=" "
            />
            <label
              htmlFor="password"
              className="
                absolute start-3 top-1.5 z-10 origin-[0] -translate-y-4 scale-75 transform bg-surface-primary px-2 text-sm text-text-secondary-alt duration-200
                peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100
                peer-focus:top-1.5 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 peer-focus:text-blue-600 dark:peer-focus:text-blue-500
                rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4
                "
            >
              {localize('com_auth_password')}
            </label>
          </div>
          {renderError('password')}
        </div>
        {startupConfig.passwordResetEnabled && (
          <a
            href="/forgot-password"
            className="inline-flex p-1 text-sm font-medium text-blue-600 transition-colors hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          >
            {localize('com_auth_password_forgot')}
          </a>
        )}
        <div className="mt-6">
          <button
            aria-label={localize('com_auth_continue')}
            data-testid="login-button"
            type="submit"
            className="
            w-full rounded-2xl bg-blue-600 px-4 py-3 text-sm font-medium text-white
            transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2
            focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50
            disabled:hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700
          "
          >
            {localize('com_auth_continue')}
          </button>
        </div>
      </form>
    </>
  );
};

export default LoginForm;
