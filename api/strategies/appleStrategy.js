const { Strategy: AppleStrategy } = require('passport-apple');
const socialLogin = require('./socialLogin');
const { logger } = require('~/config');

const getProfileDetails = (profile, idToken) => {
  logger.info('getProfileDetails called with:', {
    profile: JSON.stringify(profile, null, 2),
    idToken: idToken ? 'present' : 'missing',
  });

  // If profile already has an id, use that instead of decoding token again
  if (profile?.id) {
    return {
      email: profile.email,
      id: profile.id,
      avatarUrl: '',
      username: profile.username,
      name: profile.name,
      emailVerified: true,
    };
  }

  // Extract data from idToken which contains the user info
  const decodedIdToken = idToken
    ? JSON.parse(Buffer.from(idToken.split('.')[1], 'base64').toString())
    : {};
  logger.info('Decoded ID token:', JSON.stringify(decodedIdToken, null, 2));

  const appleId = decodedIdToken.sub;
  const email = decodedIdToken.email || `private.${appleId}@privaterelay.appleid.com`;

  // Create shorter username using first part of the sub
  const shortId = appleId ? appleId.split('.')[0] : 'unknown';
  const username = `apple_${shortId}`;

  const profileDetails = {
    email,
    id: appleId,
    avatarUrl: '',
    username,
    name: username,
    emailVerified: true,
  };

  logger.info('Constructed profile details:', JSON.stringify(profileDetails, null, 2));
  return profileDetails;
};

const appleLogin = socialLogin('apple', getProfileDetails);

const handleAppleMobileToken = async (token) => {
  const userProfile = getProfileDetails({}, token);
  return await socialLogin('apple', () => userProfile)(null, null, userProfile);
};

// Default export for the strategy
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
    async (req, accessToken, refreshToken, idToken, profile, cb) => {
      try {
        logger.info('Apple OAuth Callback Data:', {
          hasAccessToken: !!accessToken,
          hasRefreshToken: !!refreshToken,
          hasIdToken: !!idToken,
          profile: JSON.stringify(profile, null, 2),
          body: JSON.stringify(req.body, null, 2),
        });

        const userProfile = getProfileDetails(profile, idToken);

        if (!userProfile.id) {
          logger.error('No Apple ID found in token');
          throw new Error('No Apple ID found in token');
        }

        return appleLogin(accessToken, refreshToken, userProfile, cb);
      } catch (error) {
        logger.error('Error in Apple Strategy:', error);
        logger.error('Error Stack:', error.stack);
        return cb(error);
      }
    },
  );

// Named export for the mobile token handler
module.exports.handleAppleMobileToken = handleAppleMobileToken;
