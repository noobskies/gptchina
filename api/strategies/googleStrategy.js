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
        process.env.GOOGLE_CLIENT_ID,
        '397122273433-dkp13np8tm8e5llur593tmupu05764rs.apps.googleusercontent.com', // Android
        '397122273433-r5aed9p71h30699rtp2qjgcp9gdta8mb.apps.googleusercontent.com', // iOS
      ],
    });

    const payload = ticket.getPayload();
    if (!payload) {
      throw new Error('Invalid token payload');
    }

    // Ensure we have all required fields
    if (!payload.email || !payload.sub || !payload.given_name) {
      throw new Error('Missing required profile information');
    }

    return {
      emails: [{ value: payload.email, verified: payload.email_verified || false }],
      id: payload.sub,
      photos: [{ value: payload.picture || '' }],
      name: {
        givenName: payload.given_name,
        familyName: payload.family_name || '',
      },
      provider: 'google',
    };
  } catch (error) {
    console.error('Token verification error:', error);
    throw new Error(error.message || 'Invalid token');
  }
};

const handleMobileToken = async (token) => {
  try {
    const profile = await verifyMobileToken(token);

    // Return a promise that wraps the callback-based socialLogin
    return new Promise((resolve, reject) => {
      googleLogin(
        null, // accessToken (not needed for this flow)
        null, // refreshToken (not needed for this flow)
        profile,
        (err, user) => {
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
        },
      );
    });
  } catch (error) {
    console.error('Handle mobile token error:', error);
    throw error; // Re-throw to be caught by the route handler
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
  handleMobileToken,
};
