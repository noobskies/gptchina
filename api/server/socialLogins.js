const Redis = require('ioredis');
const passport = require('passport');
const session = require('express-session');
const RedisStore = require('connect-redis').default;
const {
  setupOpenId,
  googleLogin,
  githubLogin,
  discordLogin,
  facebookLogin,
  appleLogin,
} = require('~/strategies');
const { isEnabled } = require('~/server/utils');
const { logger } = require('~/config');

/**
 *
 * @param {Express.Application} app
 */
const configureSocialLogins = (app) => {
  // Google OAuth Configuration
  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    passport.use(googleLogin());

    // Serialize user for session
    passport.serializeUser((user, done) => {
      done(null, user);
    });

    // Deserialize user from session
    passport.deserializeUser((user, done) => {
      done(null, user);
    });
  }

  // Other social login configurations remain unchanged
  if (process.env.FACEBOOK_CLIENT_ID && process.env.FACEBOOK_CLIENT_SECRET) {
    passport.use(facebookLogin());
  }
  if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
    passport.use(githubLogin());
  }
  if (process.env.DISCORD_CLIENT_ID && process.env.DISCORD_CLIENT_SECRET) {
    passport.use(discordLogin());
  }

  // Add Apple OAuth Configuration
  if (
    process.env.APPLE_CLIENT_ID &&
    process.env.APPLE_TEAM_ID &&
    process.env.APPLE_KEY_ID &&
    process.env.APPLE_PRIVATE_KEY_LOCATION
  ) {
    passport.use(appleLogin());
  }

  if (
    process.env.OPENID_CLIENT_ID &&
    process.env.OPENID_CLIENT_SECRET &&
    process.env.OPENID_ISSUER &&
    process.env.OPENID_SCOPE &&
    process.env.OPENID_SESSION_SECRET
  ) {
    const sessionOptions = {
      secret: process.env.OPENID_SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
    };
    if (isEnabled(process.env.USE_REDIS)) {
      const client = new Redis(process.env.REDIS_URI);
      client
        .on('error', (err) => logger.error('ioredis error:', err))
        .on('ready', () => logger.info('ioredis successfully initialized.'))
        .on('reconnecting', () => logger.info('ioredis reconnecting...'));
      sessionOptions.store = new RedisStore({ client, prefix: 'librechat' });
    }
    app.use(session(sessionOptions));
    app.use(passport.session());
    setupOpenId();
  }
};

module.exports = configureSocialLogins;
