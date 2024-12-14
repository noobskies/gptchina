const { Strategy: AppleStrategy } = require('passport-apple');
const jwksClient = require('jwks-rsa');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const socialLogin = require('./socialLogin');

const appleLogin = socialLogin('apple', (profile) => ({
  email: profile.emails[0].value,
  id: profile.id,
  avatarUrl: profile.photos?.[0]?.value || '',
  username: profile.name?.givenName || `apple_${profile.id.substring(0, 6)}`,
  name: profile.name?.givenName
    ? `${profile.name.givenName} ${profile.name.familyName || ''}`
    : `Apple User ${profile.id.substring(0, 6)}`,
  emailVerified: profile.emails[0].verified,
}));

const createProfileFromToken = (decodedToken) => {
  const shortId = decodedToken.sub.substring(0, 6);
  return {
    emails: [
      {
        value: decodedToken.email,
        verified: decodedToken.email_verified,
      },
    ],
    id: decodedToken.sub,
    photos: [{ value: '' }],
    name: {
      givenName: `Apple_${shortId}`,
      familyName: '',
    },
    provider: 'apple',
  };
};

// Apple JWT verification
const client = jwksClient({
  jwksUri: 'https://appleid.apple.com/auth/keys',
});
const getKey = promisify(client.getSigningKey).bind(client);

const verifyAppleToken = async (idToken) => {
  const decodedHeader = jwt.decode(idToken, { complete: true });
  if (!decodedHeader || !decodedHeader.header || !decodedHeader.header.kid) {
    throw new Error('Invalid token header');
  }

  const key = await getKey(decodedHeader.header.kid);
  const signingKey = key.getPublicKey();

  return jwt.verify(idToken, signingKey, {
    issuer: 'https://appleid.apple.com',
  });
};

const verifyMobileToken = async (token) => {
  const verifiedPayload = await verifyAppleToken(token);
  if (!verifiedPayload || !verifiedPayload.sub) {
    throw new Error('Invalid token payload');
  }
  return createProfileFromToken(verifiedPayload);
};

const handleAppleToken = async (token) => {
  try {
    const profile = await verifyMobileToken(token);
    return new Promise((resolve, reject) => {
      appleLogin(null, null, profile, (err, user) => {
        if (err) return reject(err);
        if (!user) return reject(new Error('No user returned from social login'));
        resolve({ user, created: !user._id });
      });
    });
  } catch (error) {
    console.error('Handle Apple token error:', error);
    throw error;
  }
};

const strategy = () =>
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
        if (!idToken) {
          throw new Error('No ID token provided');
        }

        const verifiedPayload = await verifyAppleToken(idToken);
        const userProfile = createProfileFromToken(verifiedPayload);
        return appleLogin(accessToken, refreshToken, userProfile, cb);
      } catch (error) {
        console.error('Error in Apple Strategy:', error);
        return cb(error);
      }
    },
  );

module.exports = { strategy, handleAppleToken };
