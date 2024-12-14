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

// Verify mobile token (iOS)
const verifyMobileToken = async (token) => {
  try {
    const decodedToken = jwt.decode(token);
    console.log('Decoded token:', JSON.stringify(decodedToken, null, 2));

    if (!decodedToken) {
      throw new Error('Invalid token format');
    }

    if (!decodedToken.sub) {
      throw new Error('Missing required profile information');
    }

    // Structure the profile to match Google's format
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
        givenName: decodedToken.name || `Apple_${decodedToken.sub.substring(0, 6)}`,
        familyName: '',
      },
      provider: 'apple',
    };
  } catch (error) {
    console.error('Apple token verification error:', error);
    throw new Error(error.message || 'Invalid token');
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

            // Structure the profile to match Google's format
            profile = {
              emails: [
                {
                  value: decodedToken.email,
                  verified: decodedToken.email_verified,
                },
              ],
              id: decodedToken.sub,
              photos: [{ value: '' }],
              name: {
                givenName: decodedToken.name || `Apple_${decodedToken.sub.substring(0, 6)}`,
                familyName: '',
              },
              provider: 'apple',
            };
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
