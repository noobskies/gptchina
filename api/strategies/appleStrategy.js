// api/strategies/appleStrategy.js
const { Strategy: AppleStrategy } = require('passport-apple');
const socialLogin = require('./socialLogin');
const { logger } = require('~/config');

const getProfileDetails = (profile) => {
  logger.info('Getting profile details from Apple response:', JSON.stringify(profile, null, 2));

  // Get the unique identifiers from the profile
  const appleId = profile.id || profile.sub; // 'sub' is Apple's unique identifier

  // Get email - might be a private relay email or undefined
  const email =
    profile.email ||
    (profile._json && profile._json.email) ||
    profile.privateEmail ||
    `private.${appleId}@privaterelay.appleid.com`; // Use appleId in the email

  // Handle name which might come in first login only
  let firstName = '';
  let lastName = '';

  if (profile.name) {
    firstName = profile.name.firstName || '';
    lastName = profile.name.lastName || '';
    logger.info('Name data received:', { firstName, lastName });
  } else {
    logger.info('No name data in profile');
  }

  const username = `apple_${appleId.substring(0, 8)}`; // Create a unique username using appleId

  const profileDetails = {
    email: email,
    id: appleId, // Ensure we're using the unique Apple ID
    avatarUrl: '',
    username: username, // Use the generated unique username
    name: firstName && lastName ? `${firstName} ${lastName}` : username,
    emailVerified: true,
  };

  logger.info('Constructed profile details:', JSON.stringify(profileDetails, null, 2));
  return profileDetails;
};

const appleLogin = socialLogin('apple', getProfileDetails);

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
      logger.info('Apple OAuth Callback Received with tokens:', {
        accessToken: !!accessToken,
        refreshToken: !!refreshToken,
        idToken: !!idToken,
      });
      logger.info('Profile:', JSON.stringify(profile, null, 2));
      logger.info('Request Body:', JSON.stringify(req.body, null, 2));

      try {
        // On first sign in, Apple sends user data in the request body
        const userFromBody = req.body && req.body.user ? JSON.parse(req.body.user) : null;

        const appleId = profile.id || profile.sub;
        if (!appleId) {
          throw new Error('No Apple ID provided');
        }

        const userProfile = {
          ...profile,
          id: appleId,
          name: userFromBody?.name || profile.name,
        };

        logger.info(
          'Final user profile being passed to socialLogin:',
          JSON.stringify(userProfile, null, 2),
        );

        return appleLogin(accessToken, refreshToken, userProfile, cb);
      } catch (error) {
        logger.error('Error in Apple Strategy:', error);
        logger.error('Error Stack:', error.stack);
        return cb(error);
      }
    },
  );
