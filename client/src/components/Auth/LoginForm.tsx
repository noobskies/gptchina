import React from 'react';
import { useForm } from 'react-hook-form';
import { useLocalize } from '~/hooks';
import { TLoginUser } from 'librechat-data-provider';

type TLoginFormProps = {
  onSubmit: (data: TLoginUser) => void;
};

const LoginForm: React.FC<TLoginFormProps> = ({ onSubmit }) => {
  const localize = useLocalize();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TLoginUser>();

  const renderError = (fieldName: string) => {
    const errorMessage = errors[fieldName]?.message;
    return errorMessage ? (
      <span role="alert" className="mt-1 text-sm text-black dark:text-white">
        {String(errorMessage)}
      </span>
    ) : null;
  };

  return (
    <form
      className="mt-6"
      aria-label="Login form"
      method="POST"
      onSubmit={handleSubmit((data) => onSubmit(data))}
    >
      <div className="mb-2">
        <div className="relative">
          <input
            type="text"
            id="email"
            autoComplete="email"
            aria-label={localize('com_auth_email')}
            {...register('email', {
              required: localize('com_auth_email_required'),
              maxLength: { value: 120, message: localize('com_auth_email_max_length') },
              pattern: { value: /\S+@\S+\.\S+/, message: localize('com_auth_email_pattern') },
            })}
            aria-invalid={!!errors.email}
            className="webkit-dark-styles peer block w-full appearance-none rounded-md border border-black/10 bg-white px-2.5 pb-2.5 pt-5 text-sm text-gray-800 focus:border-blue-500 focus:outline-none dark:border-white/20 dark:bg-gray-900 dark:text-white dark:focus:border-blue-500"
            placeholder=" "
          />
          <label
            htmlFor="email"
            className="pointer-events-none absolute left-2.5 top-4 z-10 origin-[0] -translate-y-4 scale-75 transform text-sm text-gray-500 duration-100 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:text-blue-500 dark:text-gray-200"
          >
            {localize('com_auth_email_address')}
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
            className="webkit-dark-styles peer block w-full appearance-none rounded-md border border-black/10 bg-white px-2.5 pb-2.5 pt-5 text-sm text-gray-800 focus:border-blue-500 focus:outline-none dark:border-white/20 dark:bg-gray-900 dark:text-white dark:focus:border-blue-500"
            placeholder=" "
          />
          <label
            htmlFor="password"
            className="pointer-events-none absolute left-2.5 top-4 z-10 origin-[0] -translate-y-4 scale-75 transform text-sm text-gray-500 duration-100 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:text-blue-500 dark:text-gray-200"
          >
            {localize('com_auth_password')}
          </label>
        </div>
        {renderError('password')}
      </div>
      <a href="/forgot-password" className="text-sm font-medium text-blue-500">
        {localize('com_auth_password_forgot')}
      </a>
      <div className="mt-6">
        <button
          aria-label="Sign in"
          data-testid="login-button"
          type="submit"
          className="focus:bg-blue-650 w-full transform rounded-md bg-blue-600 px-4 py-3 tracking-wide text-white transition-colors duration-200 hover:bg-blue-700 focus:outline-none active:bg-blue-800 disabled:cursor-not-allowed disabled:bg-blue-500 disabled:hover:bg-blue-500"
        >
          {localize('com_auth_continue')}
        </button>
      </div>
    </form>
  );
};

export default LoginForm;
