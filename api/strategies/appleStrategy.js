const { Strategy: AppleStrategy } = require('passport-apple');
const socialLogin = require('./socialLogin');
const { logger } = require('~/config');

const getProfileDetails = (profile, idToken) => {
  console.log('getProfileDetails called with:', {
    profile: JSON.stringify(profile, null, 2),
    idToken: idToken ? 'present' : 'missing',
  });

  // Extract data from idToken which contains the user info
  const decodedIdToken = idToken
    ? JSON.parse(Buffer.from(idToken.split('.')[1], 'base64').toString())
    : {};
  console.log('Decoded ID token:', JSON.stringify(decodedIdToken, null, 2));

  const appleId = decodedIdToken.sub;
  const email = decodedIdToken.email || `private.${appleId}@privaterelay.appleid.com`;

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

        // We pass the idToken to getProfileDetails since the profile is empty
        const userProfile = getProfileDetails(profile, idToken);

        if (!userProfile.id) {
          console.log('No Apple ID found in token');
          throw new Error('No Apple ID found in token');
        }

        return appleLogin(accessToken, refreshToken, userProfile, cb);
      } catch (error) {
        console.log('Error in Apple Strategy:', error);
        console.log('Error Stack:', error.stack);
        return cb(error);
      }
    },
  );
