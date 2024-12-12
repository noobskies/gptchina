const { Strategy: AppleStrategy } = require('passport-apple');
const socialLogin = require('./socialLogin');

const getProfileDetails = (profile) => ({
  email: profile.email,
  id: profile.id,
  avatarUrl: '',
  username: profile.name ? `${profile.name.firstName}${profile.name.lastName}` : undefined,
  name: profile.name ? `${profile.name.firstName} ${profile.name.lastName}` : undefined,
  emailVerified: true,
});

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
    },
    appleLogin,
  );
