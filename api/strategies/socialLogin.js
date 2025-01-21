const { createSocialUser } = require('./process');
const { isEnabled } = require('~/server/utils');
const { findUser } = require('~/models');
const { logger } = require('~/config');

const socialLogin =
  (provider, getProfileDetails) => async (accessToken, refreshToken, profile, cb) => {
    try {
      const { email, id, username, name, emailVerified } = getProfileDetails(profile);

      const oldUser = await findUser({ email: email.trim() });
      const ALLOW_SOCIAL_REGISTRATION = isEnabled(process.env.ALLOW_SOCIAL_REGISTRATION);

      // If user exists, just return them
      if (oldUser) {
        return cb(null, oldUser);
      }

      // If social registration is allowed, create new user without avatar
      if (ALLOW_SOCIAL_REGISTRATION) {
        const newUser = await createSocialUser({
          email,
          avatarUrl: null, // Skip avatar handling completely
          provider,
          providerKey: `${provider}Id`,
          providerId: id,
          username: username || `${provider}_${id.substring(0, 10)}`,
          name,
          emailVerified,
        });
        return cb(null, newUser);
      }

      // If social registration is not allowed
      const error = new Error('Social registration is not enabled');
      error.code = 'REGISTRATION_DISABLED';
      return cb(error);
    } catch (err) {
      logger.error(`[${provider}Login]`, err);
      return cb(err);
    }
  };

module.exports = socialLogin;
