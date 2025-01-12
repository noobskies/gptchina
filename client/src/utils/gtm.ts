// src/utils/gtm.ts
import TagManager from 'react-gtm-module';

interface SignUpEventProps {
  method: string;
  status: 'success' | 'failure';
  error?: string;
  userId?: string | null;
}

export const trackSignUpEvent = (method: string = 'email') => {
  TagManager.dataLayer({
    dataLayer: {
      event: 'sign_up',
      method,
      status: 'success',
      timestamp: new Date().toISOString(),
    },
  });
};

export const trackPageView = (page: string) => {
  TagManager.dataLayer({
    dataLayer: {
      event: 'page_view',
      page_path: page,
      timestamp: new Date().toISOString(),
    },
  });
};

export const trackEvent = ({
  event,
  category,
  action,
  label,
  value,
  ...rest
}: {
  event: string;
  category?: string;
  action?: string;
  label?: string;
  value?: number;
  [key: string]: any;
}) => {
  TagManager.dataLayer({
    dataLayer: {
      event,
      category,
      action,
      label,
      value,
      timestamp: new Date().toISOString(),
      ...rest,
    },
  });
};
