const { Strategy: AppleStrategy } = require('passport-apple');
const socialLogin = require('./socialLogin');
const { logger } = require('~/config');

/**
 * Extracts and normalizes profile information from Apple authentication
 * @param {Object} profile - The profile object from Apple
 * @param {string} idToken - The ID token from Apple (optional)
 * @returns {Object} Normalized user profile information
 */
const getProfileDetails = (profile, idToken) => {
  logger.debug('getProfileDetails called with:', {
    profile: JSON.stringify(profile, null, 2),
    idToken: idToken ? 'present' : 'missing',
  });

  // If profile already has an id, use that instead of decoding token again
  if (profile?.id) {
    return {
      email: profile.email,
      id: profile.id,
      avatarUrl: '',
      username: profile.username || `apple_${profile.id.split('.')[0]}`,
      name: profile.name || `apple_${profile.id.split('.')[0]}`,
      emailVerified: true,
    };
  }

  // Extract data from idToken which contains the user info
  const decodedIdToken = idToken
    ? JSON.parse(Buffer.from(idToken.split('.')[1], 'base64').toString())
    : {};
  logger.debug('Decoded ID token:', JSON.stringify(decodedIdToken, null, 2));

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

  logger.debug('Constructed profile details:', JSON.stringify(profileDetails, null, 2));
  return profileDetails;
};

/**
 * Handles Apple mobile token verification and user creation/lookup
 * @param {string} token - The ID token from Apple mobile login
 * @returns {Promise<Object>} Object containing the user
 */
const handleAppleMobileToken = async (token) => {
  try {
    if (!token) {
      throw new Error('Token is required');
    }

    // Verify and decode the Apple ID token
    const decodedToken = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
    logger.debug('Decoded mobile token:', JSON.stringify(decodedToken, null, 2));

    const appleId = decodedToken.sub;
    if (!appleId) {
      throw new Error('No Apple ID found in token');
    }

    // Create profile using existing function
    const userProfile = getProfileDetails(
      {
        id: appleId,
        email: decodedToken.email,
        name: decodedToken.name,
      },
      token,
    );

    // Use the existing socialLogin handler
    const user = await new Promise((resolve, reject) => {
      appleLogin(null, null, userProfile, (err, user) => {
        if (err) reject(err);
        else resolve(user);
      });
    });

    return { user };
  } catch (error) {
    logger.error('Error handling Apple mobile token:', error);
    throw error;
  }
};

// Create the social login handler using our common socialLogin factory
const appleLogin = socialLogin('apple', getProfileDetails);

/**
 * Creates and configures the Apple authentication strategy
 * @returns {AppleStrategy} Configured Apple authentication strategy
 */
const createAppleStrategy = () =>
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
        logger.debug('Apple OAuth Callback Data:', {
          hasAccessToken: !!accessToken,
          hasRefreshToken: !!refreshToken,
          hasIdToken: !!idToken,
          profile: JSON.stringify(profile, null, 2),
          body: JSON.stringify(req.body, null, 2),
        });

        // Get profile details from token
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

module.exports = {
  createAppleStrategy,
  handleAppleMobileToken,
};
