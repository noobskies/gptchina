const { Strategy: AppleStrategy } = require('passport-apple');
const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');
const socialLogin = require('./socialLogin');
const { logger } = require('~/config');

// Initialize the JWKS client for Apple token verification
const client = jwksClient({
  jwksUri: 'https://appleid.apple.com/auth/keys',
});

const verifyAppleToken = async (token) => {
  try {
    // First, decode the token without verification to get the kid
    const decoded = jwt.decode(token, { complete: true });
    if (!decoded || !decoded.header || !decoded.header.kid) {
      logger.error('Invalid token format');
      throw new Error('Invalid token format');
    }

    // Get the public key from Apple's JWKS
    const key = await client.getSigningKey(decoded.header.kid);
    const publicKey = key.getPublicKey();

    // Verify the token
    const verified = jwt.verify(token, publicKey, {
      algorithms: ['RS256'],
      audience: process.env.APPLE_CLIENT_ID,
    });

    logger.info('Apple token verified successfully:', {
      sub: verified.sub,
      email: verified.email,
      emailVerified: verified.email_verified,
    });

    return verified;
  } catch (error) {
    logger.error('Apple token verification failed:', error);
    throw error;
  }
};

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
      username: profile.username || `apple_${profile.id.substring(0, 8)}`,
      name: profile.name?.firstName
        ? `${profile.name.firstName} ${profile.name.lastName || ''}`
        : profile.username || `apple_${profile.id.substring(0, 8)}`,
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
  const shortId = appleId ? appleId.substring(0, 8) : 'unknown';
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

// Handle mobile token (used by the /oauth/apple/mobile endpoint)
const handleMobileToken = async (token) => {
  try {
    logger.info('Handling mobile Apple token');

    // Verify the token with Apple
    const verifiedToken = await verifyAppleToken(token);

    // Construct a profile from the verified token
    const userProfile = {
      id: verifiedToken.sub,
      email: verifiedToken.email,
      emailVerified: verifiedToken.email_verified,
      // For mobile flows, we might not get the name, so we'll generate one
      username: `apple_${verifiedToken.sub.substring(0, 8)}`,
    };

    logger.info('Created user profile from mobile token:', userProfile);

    // Use the existing social login flow with the constructed profile
    const { user, created } = await socialLogin('apple', () => userProfile)(
      null,
      null,
      userProfile,
    );

    return { user, created };
  } catch (error) {
    logger.error('Error handling mobile token:', error);
    throw error;
  }
};

// Create and export the Apple Strategy for web authentication
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

        // Get user details from the profile or token
        const userProfile = getProfileDetails(profile, idToken);

        if (!userProfile.id) {
          logger.error('No Apple ID found in token');
          throw new Error('No Apple ID found in token');
        }

        // Use the standard social login flow
        return appleLogin(accessToken, refreshToken, userProfile, cb);
      } catch (error) {
        logger.error('Error in Apple Strategy:', error);
        logger.error('Error Stack:', error.stack);
        return cb(error);
      }
    },
  );

// Export the mobile token handler
module.exports.handleMobileToken = handleMobileToken;
