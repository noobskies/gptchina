const { Strategy: AppleStrategy } = require('passport-apple');
const jwksClient = require('jwks-rsa');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const socialLogin = require('./socialLogin');

console.log('Loading Apple auth strategy...');

const appleLogin = socialLogin('apple', (profile) => {
  console.log('Constructing appleLogin profile object from:', JSON.stringify(profile, null, 2));
  return {
    email: profile.emails && profile.emails[0] ? profile.emails[0].value : '',
    id: profile.id,
    avatarUrl: profile.photos && profile.photos[0] ? profile.photos[0].value : '',
    username:
      profile.name && profile.name.givenName
        ? profile.name.givenName
        : `apple_${(profile.id || '').substring(0, 6)}`,
    name:
      profile.name && profile.name.givenName
        ? `${profile.name.givenName} ${profile.name.familyName || ''}`
        : `Apple User ${(profile.id || '').substring(0, 6)}`,
    emailVerified: profile.emails && profile.emails[0] && profile.emails[0].verified,
  };
});

const createProfileFromToken = (decodedToken) => {
  console.log('Creating profile from token:', JSON.stringify(decodedToken, null, 2));
  const shortId = decodedToken.sub ? decodedToken.sub.substring(0, 6) : 'unknown';
  return {
    emails: [
      {
        value: decodedToken.email || '',
        verified: decodedToken.email_verified || false,
      },
    ],
    id: decodedToken.sub || '',
    photos: [{ value: '' }],
    name: {
      givenName: `Apple_${shortId}`,
      familyName: '',
    },
    provider: 'apple',
  };
};

const client = jwksClient({
  jwksUri: 'https://appleid.apple.com/auth/keys',
});
const getKey = promisify(client.getSigningKey).bind(client);

const verifyAppleToken = async (idToken) => {
  console.log('Verifying Apple token:', idToken);
  const decodedHeader = jwt.decode(idToken, { complete: true });
  console.log('Decoded header:', JSON.stringify(decodedHeader, null, 2));

  if (!decodedHeader || !decodedHeader.header || !decodedHeader.header.kid) {
    console.error('Invalid token header');
    throw new Error('Invalid token header');
  }

  const key = await getKey(decodedHeader.header.kid);
  const signingKey = key.getPublicKey();
  console.log('Got signing key for Apple token');

  const verified = jwt.verify(idToken, signingKey, {
    issuer: 'https://appleid.apple.com',
  });
  console.log('Verified Apple token:', JSON.stringify(verified, null, 2));
  return verified;
};

const verifyMobileToken = async (token) => {
  console.log('Verifying mobile Apple token:', token);
  const verifiedPayload = await verifyAppleToken(token);

  if (!verifiedPayload || !verifiedPayload.sub) {
    console.error('Invalid token payload');
    throw new Error('Invalid token payload');
  }

  const profile = createProfileFromToken(verifiedPayload);
  console.log('Profile created from verified payload:', JSON.stringify(profile, null, 2));
  return profile;
};

const handleAppleToken = async (token) => {
  console.log('Handling Apple token (mobile):', token);
  try {
    const profile = await verifyMobileToken(token);
    console.log('Profile after verification:', JSON.stringify(profile, null, 2));

    return new Promise((resolve, reject) => {
      appleLogin(null, null, profile, (err, user) => {
        if (err) {
          console.error('Social login error:', err);
          return reject(err);
        }
        if (!user) {
          console.error('No user returned from social login');
          return reject(new Error('No user returned from social login'));
        }
        console.log('Social login success, user:', JSON.stringify(user, null, 2));
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
      console.log('Apple Strategy callback triggered');
      console.log('Access Token:', accessToken);
      console.log('Refresh Token:', refreshToken);
      console.log('ID Token:', idToken);
      console.log('Profile:', JSON.stringify(profile, null, 2));

      try {
        if (!idToken) {
          console.error('No ID token provided');
          throw new Error('No ID token provided');
        }

        const verifiedPayload = await verifyAppleToken(idToken);
        const userProfile = createProfileFromToken(verifiedPayload);
        console.log('User profile from token:', JSON.stringify(userProfile, null, 2));

        return appleLogin(accessToken, refreshToken, userProfile, (err, user) => {
          if (err) {
            console.error('Error in appleLogin callback:', err);
          } else {
            console.log('Apple login user:', JSON.stringify(user, null, 2));
          }
          cb(err, user);
        });
      } catch (error) {
        console.error('Error in Apple Strategy:', error);
        return cb(error);
      }
    },
  );

module.exports = { strategy, handleAppleToken };
