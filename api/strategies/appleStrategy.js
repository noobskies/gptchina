const { Strategy: AppleStrategy } = require('passport-apple');
const jwt = require('jsonwebtoken');
const socialLogin = require('./socialLogin');
const { logger } = require('~/config');

const getProfileDetails = (profile) => {
  console.log('getProfileDetails called with:', {
    profile: JSON.stringify(profile, null, 2),
  });

  const profileData = {
    email: profile.emails[0].value,
    id: profile.id,
    avatarUrl: profile.photos?.[0]?.value || '',
    username: profile.name?.givenName || `apple_${profile.id.substring(0, 6)}`,
    name: profile.name?.givenName
      ? `${profile.name.givenName} ${profile.name.familyName || ''}`
      : `Apple User ${profile.id.substring(0, 6)}`,
    emailVerified: profile.emails[0].verified,
  };

  console.log('Constructed profile data:', JSON.stringify(profileData, null, 2));
  return profileData;
};

const appleLogin = socialLogin('apple', getProfileDetails);

const formatAppleProfile = (decodedToken) => {
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

const handleAppleToken = async (token) => {
  console.log('handleAppleToken called');
  try {
    const decodedToken = jwt.decode(token);
    console.log('Decoded token:', JSON.stringify(decodedToken, null, 2));

    if (!decodedToken || !decodedToken.sub) {
      throw new Error('Invalid token or missing sub');
    }

    const profile = formatAppleProfile(decodedToken);
    console.log('Profile after formatting:', JSON.stringify(profile, null, 2));

    return new Promise((resolve, reject) => {
      appleLogin(null, null, profile, (err, user) => {
        if (err) {
          console.error('Social login error:', err);
          reject(err);
        } else if (!user) {
          reject(new Error('No user returned from social login'));
        } else {
          console.log('Social login successful, user:', JSON.stringify(user, null, 2));
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

module.exports = {
  strategy: () =>
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
          console.log('Apple OAuth Callback Data:', {
            hasAccessToken: !!accessToken,
            hasRefreshToken: !!refreshToken,
            hasIdToken: !!idToken,
            profile: JSON.stringify(profile, null, 2),
          });

          if (idToken) {
            const decodedToken = jwt.decode(idToken);
            console.log('Decoded ID token:', JSON.stringify(decodedToken, null, 2));
            profile = formatAppleProfile(decodedToken);
          }

          console.log(
            'Final profile being passed to appleLogin:',
            JSON.stringify(profile, null, 2),
          );
          return appleLogin(accessToken, refreshToken, profile, cb);
        } catch (error) {
          console.error('Error in Apple Strategy:', error);
          return cb(error);
        }
      },
    ),
  handleAppleToken,
};
