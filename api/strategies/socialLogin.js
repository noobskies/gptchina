const { createSocialUser, handleExistingUser } = require('./process');
const { isEnabled } = require('~/server/utils');
const { findUser } = require('~/models');
const { logger } = require('~/config');

// Default avatar URL - you can replace this with your preferred placeholder
const DEFAULT_AVATAR = 'https://www.gravatar.com/avatar/default?d=mp';

const getDefaultAvatar = (name) => {
  // Create avatar with user's initials if name exists
  if (name) {
    const encodedName = encodeURIComponent(name.replace(/\s+/g, '+'));
    return `${DEFAULT_AVATAR}${encodedName}`;
  }
  return `${DEFAULT_AVATAR}User`;
};

const socialLogin =
  (provider, getProfileDetails) => async (accessToken, refreshToken, profile, cb) => {
    try {
      const { email, id, avatarUrl, username, name, emailVerified } = getProfileDetails(profile);

      // For Apple login, use a default avatar
      const finalAvatarUrl = provider === 'apple' ? getDefaultAvatar(name) : avatarUrl;

      const oldUser = await findUser({ email: email.trim() });
      const ALLOW_SOCIAL_REGISTRATION = isEnabled(process.env.ALLOW_SOCIAL_REGISTRATION);

      if (oldUser) {
        // Only update avatar if one is provided or it's Apple login
        if (finalAvatarUrl) {
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
