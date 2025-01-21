const { createSocialUser, handleExistingUser } = require('./process');
const { isEnabled } = require('~/server/utils');
const { findUser } = require('~/models');
const { logger } = require('~/config');

// Helper function to validate and format URL
const ensureAbsoluteUrl = (url) => {
  if (!url) return null;

  try {
    // Check if URL is already absolute
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }

    // If URL starts with //, add https:
    if (url.startsWith('//')) {
      return `https:${url}`;
    }

    // If URL starts with /, add your base URL
    if (url.startsWith('/')) {
      return `${process.env.DOMAIN_CLIENT || 'https://novlisky.io'}${url}`;
    }

    // If none of the above, assume https://
    return `https://${url}`;
  } catch (error) {
    logger.warn('Invalid avatar URL:', url);
    return null;
  }
};

const socialLogin =
  (provider, getProfileDetails) => async (accessToken, refreshToken, profile, cb) => {
    try {
      const { email, id, avatarUrl, username, name, emailVerified } = getProfileDetails(profile);

      // Format the avatar URL properly
      const formattedAvatarUrl = ensureAbsoluteUrl(avatarUrl);

      const oldUser = await findUser({ email: email.trim() });
      const ALLOW_SOCIAL_REGISTRATION = isEnabled(process.env.ALLOW_SOCIAL_REGISTRATION);

      if (oldUser) {
        // Pass the formatted avatar URL
        await handleExistingUser(oldUser, formattedAvatarUrl);
        return cb(null, oldUser);
      }

      if (ALLOW_SOCIAL_REGISTRATION) {
        const newUser = await createSocialUser({
          email,
          avatarUrl: formattedAvatarUrl, // Use the formatted URL
          provider,
          providerKey: `${provider}Id`,
          providerId: id,
          username,
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
