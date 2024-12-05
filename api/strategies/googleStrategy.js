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

// Verify mobile token (iOS or Android)
const verifyMobileToken = async (token) => {
  try {
    const client = new OAuth2Client();
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: [
        process.env.GOOGLE_CLIENT_ID, // Web client ID
        '397122273433-cu4vlplj3de7cd6ecmuftc54s1e92cb3.apps.googleusercontent.com', // Web client ID
        '397122273433-ke16soip38cest3aoochcgbg0grhd73n.apps.googleusercontent.com', // Android client ID
        '397122273433-qecugthkbekessf6784dntdkgh9u8vlu.apps.googleusercontent.com', // iOS client ID
      ],
    });
    const payload = ticket.getPayload();

    return {
      emails: [{ value: payload.email, verified: payload.email_verified }],
      id: payload.sub,
      photos: [{ value: payload.picture }],
      name: {
        givenName: payload.given_name,
        familyName: payload.family_name,
      },
    };
  } catch (error) {
    console.error('Token verification error:', error);
    throw new Error('Invalid token');
  }
};

const handleMobileToken = async (token) => {
  return new Promise(async (resolve, reject) => {
    try {
      const profile = await verifyMobileToken(token);

      // Use the same socialLogin function but with mobile token data
      googleLogin(
        null, // accessToken (not needed for this flow)
        null, // refreshToken (not needed for this flow)
        profile, // profile object matching the expected format
        (err, user) => {
          if (err) {
            reject(err);
          } else {
            resolve({ user, created: !user._id }); // Match the expected response format
          }
        },
      );
    } catch (error) {
      reject(error);
    }
  });
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
  handleMobileToken, // Export the new unified handler
};
