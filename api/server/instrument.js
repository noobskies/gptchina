const Sentry = require('@sentry/node');

Sentry.init({
  dsn: 'https://a6f2def121a598f4c7dd7523ad18e981@o4507099226177536.ingest.us.sentry.io/4508212391182336',
  environment: process.env.NODE_ENV || 'development',
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.2 : 1.0,
  profilesSampleRate: process.env.NODE_ENV === 'production' ? 0.2 : 1.0,
  beforeSend(event) {
    if (process.env.NODE_ENV === 'development') {
      return null;
    }
    return event;
  },
});
