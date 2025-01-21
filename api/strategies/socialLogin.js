const { createSocialUser, handleExistingUser } = require('./process');
const { isEnabled } = require('~/server/utils');
const { findUser } = require('~/models');
const { logger } = require('~/config');

// Use your local asset as the default avatar
const DEFAULT_AVATAR = '/assets/logo-novlisky-small.png';

const socialLogin =
  (provider, getProfileDetails) => async (accessToken, refreshToken, profile, cb) => {
    try {
      const { email, id, avatarUrl, username, name, emailVerified } = getProfileDetails(profile);

      // For Apple login, use your local logo
      const finalAvatarUrl = provider === 'apple' ? DEFAULT_AVATAR : avatarUrl;

      const oldUser = await findUser({ email: email.trim() });
      const ALLOW_SOCIAL_REGISTRATION = isEnabled(process.env.ALLOW_SOCIAL_REGISTRATION);

      if (oldUser) {
        // Only update avatar if one is provided and it's not Apple login
        if (finalAvatarUrl && provider !== 'apple') {
          await handleExistingUser(oldUser, finalAvatarUrl);
        }
        return cb(null, oldUser);
      }

      if (ALLOW_SOCIAL_REGISTRATION) {
        const newUser = await createSocialUser({
          email,
          avatarUrl: finalAvatarUrl,
          provider,
          providerKey: `${provider}Id`,
          providerId: id,
          username: username || `${provider}_${id.substring(0, 10)}`,
          name,
          emailVerified,
        });
        return cb(null, newUser);
      }

      const error = new Error('Social registration is not enabled');
      error.code = 'REGISTRATION_DISABLED';
      return cb(error);
    } catch (err) {
      logger.error(`[${provider}Login]`, err);
      return cb(err);
    }
  };

module.exports = socialLogin;
