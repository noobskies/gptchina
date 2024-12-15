const { Strategy: AppleStrategy } = require('passport-apple');
const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');
const axios = require('axios');
const socialLogin = require('./socialLogin');

// Initialize the JWKS client for Apple token verification
const client = jwksClient({
  jwksUri: 'https://appleid.apple.com/auth/keys',
});

const getClientSecret = () => {
  try {
    const privateKey = process.env.APPLE_PRIVATE_KEY;
    const time = new Date().getTime() / 1000;

    console.log('Generating client secret with params:', {
      keyIdLength: process.env.APPLE_KEY_ID?.length,
      teamIdLength: process.env.APPLE_TEAM_ID?.length,
      privateKeyLength: privateKey?.length,
      clientIdLength: process.env.APPLE_CLIENT_ID?.length,
      timestamp: time,
    });

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

    const token = jwt.sign(claims, privateKey, {
      algorithm: 'ES256',
      header: headers,
    });

    console.log('Client secret generated successfully');
    return token;
  } catch (error) {
    console.error('Error generating client secret:', error);
    throw error;
  }
};

const exchangeAuthorizationCode = async (authCode) => {
  try {
    console.log('Exchanging authorization code for tokens');
    const clientSecret = getClientSecret();

    const requestBody = {
      grant_type: 'authorization_code',
      code: authCode,
      client_id: process.env.APPLE_CLIENT_ID,
      client_secret: clientSecret,
      redirect_uri: process.env.APPLE_CALLBACK_URL,
    };

    console.log('Token exchange request body:', {
      ...requestBody,
      client_secret: 'REDACTED',
      code: authCode.substring(0, 10) + '...',
    });

    console.log('Environment variables check:', {
      hasClientId: !!process.env.APPLE_CLIENT_ID,
      hasTeamId: !!process.env.APPLE_TEAM_ID,
      hasKeyId: !!process.env.APPLE_KEY_ID,
      hasPrivateKey: !!process.env.APPLE_PRIVATE_KEY,
      callbackUrl: process.env.APPLE_CALLBACK_URL,
    });

    const response = await axios
      .post('https://appleid.apple.com/auth/token', new URLSearchParams(requestBody), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent': 'Node.js App',
        },
      })
      .catch((error) => {
        if (error.response) {
          console.error('Apple token exchange error response:', {
            status: error.response.status,
            data: error.response.data,
            headers: error.response.headers,
          });
        } else if (error.request) {
          console.error('No response received from Apple:', error.request);
        }
        throw error;
      });

    console.log('Token exchange successful');
    return response.data;
  } catch (error) {
    console.error('Error exchanging authorization code:', error.response?.data || error);
    console.error('Full error:', error);
    throw error;
  }
};

const verifyAppleToken = async (token) => {
  try {
    const decoded = jwt.decode(token, { complete: true });
    if (!decoded || !decoded.header || !decoded.header.kid) {
      console.error('Invalid token format');
      throw new Error('Invalid token format');
    }

    const key = await client.getSigningKey(decoded.header.kid);
    const publicKey = key.getPublicKey();

    const verified = jwt.verify(token, publicKey, {
      algorithms: ['RS256'],
      audience: process.env.APPLE_CLIENT_ID,
    });

    console.log('Apple token verified successfully:', {
      sub: verified.sub,
      email: verified.email,
      emailVerified: verified.email_verified,
    });

    return verified;
  } catch (error) {
    console.error('Apple token verification failed:', error);
    throw error;
  }
};

const getProfileDetails = (profile, idToken) => {
  console.log('getProfileDetails called with:', {
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

  console.log('Constructed profile details:', JSON.stringify(profileDetails, null, 2));
  return profileDetails;
};

const appleLogin = socialLogin('apple', getProfileDetails);

// Handle mobile token (used by the /oauth/apple/mobile endpoint)
const handleMobileToken = async (authCode, profile) => {
  try {
    console.log('Handling mobile Apple token:', { authCode, profile });

    // Exchange the auth code for tokens
    const tokens = await exchangeAuthorizationCode(authCode);
    console.log('Successfully exchanged authorization code for tokens');

    // Use profile data from the native SDK if available
    const userProfile = getProfileDetails(profile);

    console.log('Created user profile:', userProfile);

    // Use the existing social login flow
    const result = await socialLogin('apple', () => userProfile)(
      tokens.access_token,
      tokens.refresh_token,
      userProfile,
    );

    return result;
  } catch (error) {
    console.error('Error handling mobile token:', error);
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
        console.log('Apple OAuth Callback Data:', {
          hasAccessToken: !!accessToken,
          hasRefreshToken: !!refreshToken,
          hasIdToken: !!idToken,
          profile: JSON.stringify(profile, null, 2),
          body: JSON.stringify(req.body, null, 2),
        });

        const userProfile = getProfileDetails(profile, idToken);

        if (!userProfile.id) {
          console.error('No Apple ID found in token');
          throw new Error('No Apple ID found in token');
        }

        return appleLogin(accessToken, refreshToken, userProfile, cb);
      } catch (error) {
        console.error('Error in Apple Strategy:', error);
        console.error('Error Stack:', error.stack);
        return cb(error);
      }
    },
  );

module.exports.handleMobileToken = handleMobileToken;
