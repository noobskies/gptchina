const { Strategy: AppleStrategy } = require('passport-apple');
const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');
const axios = require('axios');
const socialLogin = require('./socialLogin');
const { logger } = require('~/config');

// Initialize the JWKS client for Apple token verification
const client = jwksClient({
  jwksUri: 'https://appleid.apple.com/auth/keys',
});

const getClientSecret = () => {
  const privateKey = process.env.APPLE_PRIVATE_KEY;
  const time = new Date().getTime() / 1000;

  const headers = {
    kid: process.env.APPLE_KEY_ID,
    typ: undefined,
    alg: 'ES256',
  };

  const claims = {
    iss: process.env.APPLE_TEAM_ID,
    iat: time,
    exp: time + 86400 * 180,
    aud: 'https://appleid.apple.com',
    sub: process.env.APPLE_CLIENT_ID,
  };

  return jwt.sign(claims, privateKey, {
    algorithm: 'ES256',
    header: headers,
  });
};

const exchangeAuthorizationCode = async (authCode) => {
  try {
    logger.info('Exchanging authorization code for tokens');
    const clientSecret = getClientSecret();

    const requestBody = {
      grant_type: 'authorization_code',
      code: authCode,
      client_id: process.env.APPLE_CLIENT_ID,
      client_secret: clientSecret,
    };

    const response = await axios.post(
      'https://appleid.apple.com/auth/token',
      new URLSearchParams(requestBody),
      {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      },
    );

    logger.info('Token exchange successful');
    return response.data;
  } catch (error) {
    logger.error('Error exchanging authorization code:', error.response?.data || error);
    throw error;
  }
};

const verifyAppleToken = async (token) => {
  try {
    const decoded = jwt.decode(token, { complete: true });
    if (!decoded || !decoded.header || !decoded.header.kid) {
      logger.error('Invalid token format');
      throw new Error('Invalid token format');
    }

    const key = await client.getSigningKey(decoded.header.kid);
    const publicKey = key.getPublicKey();

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

  if (profile?.id || profile?.user) {
    // Handle both web profile and mobile profile formats
    return {
      email: profile.email,
      id: profile.id || profile.user,
      avatarUrl: '',
      username: `apple_${(profile.id || profile.user).substring(0, 8)}`,
      name: profile.name?.firstName
        ? `${profile.name.firstName} ${profile.name.lastName || ''}`
        : profile.givenName && profile.familyName
        ? `${profile.givenName} ${profile.familyName}`
        : `apple_${(profile.id || profile.user).substring(0, 8)}`,
      emailVerified: true,
    };
  }

  // Extract data from idToken which contains the user info
  const decodedIdToken = idToken
    ? JSON.parse(Buffer.from(idToken.split('.')[1], 'base64').toString())
    : {};

  const appleId = decodedIdToken.sub;
  const email = decodedIdToken.email || `private.${appleId}@privaterelay.appleid.com`;

  const profileDetails = {
    email,
    id: appleId,
    avatarUrl: '',
    username: `apple_${appleId?.substring(0, 8)}`,
    name: `apple_${appleId?.substring(0, 8)}`,
    emailVerified: true,
  };

  logger.info('Constructed profile details:', JSON.stringify(profileDetails, null, 2));
  return profileDetails;
};

const appleLogin = socialLogin('apple', getProfileDetails);

// Handle mobile token (used by the /oauth/apple/mobile endpoint)
const handleMobileToken = async (authCode, profile) => {
  try {
    logger.info('Handling mobile Apple auth code', { hasProfile: !!profile });

    // Exchange the auth code for tokens
    const tokens = await exchangeAuthorizationCode(authCode);
    logger.info('Successfully exchanged authorization code for tokens');

    // Use profile data from the native SDK if available
    const userProfile = getProfileDetails(profile);

    logger.info('Created user profile:', userProfile);

    // Use the existing social login flow
    const result = await socialLogin('apple', () => userProfile)(
      tokens.access_token,
      tokens.refresh_token,
      userProfile,
    );

    return result;
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

module.exports.handleMobileToken = handleMobileToken;
