// api/strategies/googleStrategy.js
const { Strategy: GoogleStrategy } = require('passport-google-oauth20');
const { OAuth2Client } = require('google-auth-library');
const socialLogin = require('./socialLogin');

const getProfileDetails = (profile) => ({
  email: profile.emails[0].value,
  id: profile.id,
  avatarUrl: profile.photos[0].value,
  username: profile.name.givenName,
  name: `${profile.name.givenName} ${profile.name.familyName}`,
  emailVerified: profile.emails[0].verified,
});

const googleLogin = socialLogin('google', getProfileDetails);

// Verify Android token
const verifyAndroidToken = async (token) => {
  try {
    const client = new OAuth2Client();
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: [
        process.env.GOOGLE_CLIENT_ID,
        '397122273433-cu4vlplj3de7cd6ecmuftc54s1e92cb3.apps.googleusercontent.com', // Android client ID
      ],
    });
    const payload = ticket.getPayload();

    return {
      id: payload.sub,
      email: payload.email,
      avatarUrl: payload.picture,
      username: payload.given_name,
      name: `${payload.given_name} ${payload.family_name}`,
      emailVerified: payload.email_verified,
    };
  } catch (error) {
    throw new Error('Invalid token');
  }
};

const handleAndroidToken = async (token, done) => {
  try {
    const profile = await verifyAndroidToken(token);
    const { user, created } = await socialLogin('google', () => profile)();
    done(null, user, { created });
  } catch (error) {
    done(error);
  }
};

module.exports = {
  strategy: () =>
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: `${process.env.DOMAIN_SERVER}${process.env.GOOGLE_CALLBACK_URL}`,
        proxy: true,
      },
      googleLogin,
    ),
  handleAndroidToken,
};
