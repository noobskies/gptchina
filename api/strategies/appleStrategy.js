const { Strategy: AppleStrategy } = require('passport-apple');
const jwt = require('jsonwebtoken');
const socialLogin = require('./socialLogin');
const { logger } = require('~/config');

const getProfileDetails = (profile) => ({
  email: profile.emails[0].value,
  id: profile.id,
  avatarUrl: profile.photos?.[0]?.value || '',
  username: profile.name?.givenName || `apple_${profile.id.substring(0, 6)}`,
  name: profile.name?.givenName
    ? `${profile.name.givenName} ${profile.name.familyName || ''}`
    : `Apple User ${profile.id.substring(0, 6)}`,
  emailVerified: profile.emails[0].verified,
});

const appleLogin = socialLogin('apple', getProfileDetails);

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

const verifyMobileToken = async (token) => {
  try {
    const decodedToken = jwt.decode(token);
    console.log('Decoded token:', JSON.stringify(decodedToken, null, 2));

    if (!decodedToken || !decodedToken.sub) {
      throw new Error('Invalid token or missing sub');
    }

    return createProfileFromToken(decodedToken);
  } catch (error) {
    console.error('Apple token verification error:', error);
    throw error;
  }
};

const handleAppleToken = async (token) => {
  try {
    const profile = await verifyMobileToken(token);
    console.log('Profile after verification:', JSON.stringify(profile, null, 2));

    return new Promise((resolve, reject) => {
      appleLogin(null, null, profile, (err, user) => {
        if (err) {
          console.error('Social login error:', err);
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
        console.log('Apple callback called with profile:', JSON.stringify(profile, null, 2));
        console.log('Apple callback called with idToken:', idToken);
        console.log('Apple callback called with accessToken:', accessToken);

        let userProfile;
        if (idToken) {
          const decodedToken = jwt.decode(idToken);
          console.log('Decoded ID token:', JSON.stringify(decodedToken, null, 2));
          userProfile = createProfileFromToken(decodedToken);
          console.log('Created profile from token:', JSON.stringify(userProfile, null, 2));
        } else {
          throw new Error('No ID token provided');
        }

        return appleLogin(accessToken, refreshToken, userProfile, cb);
      } catch (error) {
        console.error('Error in Apple Strategy:', error);
        return cb(error);
      }
    },
  );

module.exports = { strategy, handleAppleToken };
