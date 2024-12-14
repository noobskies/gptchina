const { Strategy: AppleStrategy } = require('passport-apple');
const jwt = require('jsonwebtoken');
const socialLogin = require('./socialLogin');
const { logger } = require('~/config');

const getProfileDetails = (profile) => ({
  email: profile.email,
  id: profile.id || profile.sub,
  avatarUrl: '',
  username: profile.username || `apple_${(profile.id || profile.sub).substring(0, 8)}`,
  name: profile.name || profile.username || `Apple User`,
  emailVerified: true,
});

const appleLogin = socialLogin('apple', getProfileDetails);

const verifyMobileToken = async (token) => {
  try {
    const decodedToken = jwt.decode(token);
    if (!decodedToken) {
      throw new Error('Invalid token format');
    }

    if (!decodedToken.sub) {
      throw new Error('Missing required profile information');
    }

    return {
      id: decodedToken.sub,
      email: decodedToken.email || `private.${decodedToken.sub}@privaterelay.appleid.com`,
      sub: decodedToken.sub,
      provider: 'apple',
    };
  } catch (error) {
    logger.error('Apple token verification error:', error);
    throw new Error(error.message || 'Invalid token');
  }
};

const handleAppleToken = async (token) => {
  try {
    const profile = await verifyMobileToken(token);

    return new Promise((resolve, reject) => {
      appleLogin(null, null, profile, (err, user) => {
        if (err) {
          logger.error('Social login error:', err);
          reject(err);
        } else if (!user) {
          reject(new Error('No user returned from social login'));
        } else {
          resolve({
            user,
            created: !user._id,
          });
        }
      });
    });
  } catch (error) {
    logger.error('Handle Apple token error:', error);
    throw error;
  }
};

module.exports = () =>
  new AppleStrategy(
    {
      clientID: process.env.APPLE_CLIENT_ID,
      teamID: process.env.APPLE_TEAM_ID,
      keyID: process.env.APPLE_KEY_ID,
      privateKeyString: process.env.APPLE_PRIVATE_KEY,
      callbackURL: `${process.env.DOMAIN_SERVER}${process.env.APPLE_CALLBACK_URL}`,
      scope: ['name', 'email'],
      passReqToCallback: true,
    },
    (req, accessToken, refreshToken, idToken, profile, cb) => {
      try {
        logger.info('Apple OAuth Callback Data:', {
          hasAccessToken: !!accessToken,
          hasRefreshToken: !!refreshToken,
          hasIdToken: !!idToken,
          profile: JSON.stringify(profile),
        });

        // Merge profile data from idToken if available
        if (idToken) {
          const decodedToken = jwt.decode(idToken);
          profile = {
            ...profile,
            id: decodedToken.sub,
            email: decodedToken.email,
            sub: decodedToken.sub,
          };
        }

        return appleLogin(accessToken, refreshToken, profile, cb);
      } catch (error) {
        logger.error('Error in Apple Strategy:', error);
        return cb(error);
      }
    },
  );
