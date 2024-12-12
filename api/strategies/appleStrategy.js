// api/strategies/appleStrategy.js
const { Strategy: AppleStrategy } = require('passport-apple');
const socialLogin = require('./socialLogin');
const { logger } = require('~/config'); // Assuming you have this logger

const getProfileDetails = (profile) => {
  console.log('Getting profile details from Apple response:', JSON.stringify(profile, null, 2));

  const email =
    profile.email ||
    (profile._json && profile._json.email) ||
    profile.privateEmail ||
    'private@privaterelay.appleid.com';

  let firstName = '';
  let lastName = '';

  if (profile.name) {
    firstName = profile.name.firstName || '';
    lastName = profile.name.lastName || '';
    console.log('Name data received:', { firstName, lastName });
  } else {
    console.log('No name data in profile');
  }

  const profileDetails = {
    email: email,
    id: profile.id || profile.sub,
    avatarUrl: '',
    username: firstName && lastName ? `${firstName}${lastName}` : undefined,
    name: firstName && lastName ? `${firstName} ${lastName}` : undefined,
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
      console.log('Apple OAuth Callback Received:');
      console.log('Access Token:', accessToken);
      console.log('Refresh Token:', refreshToken);
      console.log('ID Token:', idToken);
      console.log('Profile:', JSON.stringify(profile, null, 2));
      console.log('Request Body:', JSON.stringify(req.body, null, 2));

      try {
        const userEmail =
          profile.email || (req.body && req.body.email) || 'private@privaterelay.appleid.com';

        console.log('Extracted Email:', userEmail);

        // Log the user data from request body
        if (req.body && req.body.user) {
          console.log('User data from request body:', req.body.user);
          const userName = JSON.parse(req.body.user);
          console.log('Parsed user data:', userName);
        }

        const userProfile = {
          ...profile,
          email: userEmail,
          id: profile.id || profile.sub,
        };

        console.log(
          'Final user profile being passed to socialLogin:',
          JSON.stringify(userProfile, null, 2),
        );

        return appleLogin(accessToken, refreshToken, userProfile, cb);
      } catch (error) {
        console.log('Error in Apple Strategy:', error);
        console.log('Error Stack:', error.stack);
        return cb(error);
      }
    },
  );
