// api/strategies/appleStrategy.js
const { Strategy: AppleStrategy } = require('passport-apple');
const socialLogin = require('./socialLogin');
const { logger } = require('~/config');

const getProfileDetails = (profile) => {
  console.log('Apple profile received:', JSON.stringify(profile, null, 2));

  const appleId = profile.id || profile.sub;
  console.log('Apple ID extracted:', appleId);

  const email =
    profile.email ||
    (profile._json && profile._json.email) ||
    `private.${appleId}@privaterelay.appleid.com`;

  const username = `apple_${appleId}`;

  const profileDetails = {
    email,
    id: appleId,
    avatarUrl: '',
    username,
    name: username,
    emailVerified: true,
  };

  console.log('Constructed profile details:', JSON.stringify(profileDetails, null, 2));
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
      try {
        console.log('Apple OAuth Callback Data:', {
          hasAccessToken: !!accessToken,
          hasRefreshToken: !!refreshToken,
          hasIdToken: !!idToken,
          profile: JSON.stringify(profile, null, 2),
          body: JSON.stringify(req.body, null, 2),
        });

        if (!profile) {
          console.log('No profile received from Apple');
          throw new Error('No profile received from Apple');
        }

        return appleLogin(accessToken, refreshToken, profile, cb);
      } catch (error) {
        console.log('Error in Apple Strategy:', error);
        console.log('Error Stack:', error.stack);
        return cb(error);
      }
    },
  );
