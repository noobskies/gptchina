const { Strategy: GoogleStrategy } = require('passport-google-oauth20');
const { OAuth2Client } = require('google-auth-library');
const socialLogin = require('./socialLogin');

const getProfileDetails = (profile) => {
  console.log('Raw profile from Google:', JSON.stringify(profile, null, 2));

  const details = {
    email: profile.emails[0].value,
    id: profile.id,
    avatarUrl: profile.photos[0].value,
    username: profile.name.givenName,
    name: `${profile.name.givenName} ${profile.name.familyName}`,
    emailVerified: profile.emails[0].verified,
  };

  console.log('Processed profile details:', details);
  return details;
};

const googleLogin = socialLogin('google', getProfileDetails);

// Verify mobile token (iOS or Android)
const verifyMobileToken = async (token) => {
  console.log('Starting token verification for:', token.substring(0, 20) + '...');

  try {
    const client = new OAuth2Client();
    console.log('Configured client IDs:', [
      process.env.GOOGLE_CLIENT_ID,
      '397122273433-d4tjq5l65rr8552b1t2km42lpd6nolin.apps.googleusercontent.com',
      '397122273433-vh06gkk90ai18bj90nmfapm80udnrpso.apps.googleusercontent.com',
      '397122273433-r5aed9p71h30699rtp2qjgcp9gdta8mb.apps.googleusercontent.com',
    ]);

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: [
        process.env.GOOGLE_CLIENT_ID,
        // Android client IDs
        '397122273433-d4tjq5l65rr8552b1t2km42lpd6nolin.apps.googleusercontent.com',
        '397122273433-vh06gkk90ai18bj90nmfapm80udnrpso.apps.googleusercontent.com',
        // iOS client ID
        '397122273433-r5aed9p71h30699rtp2qjgcp9gdta8mb.apps.googleusercontent.com',
      ],
    });

    const payload = ticket.getPayload();
    console.log('Token payload received:', JSON.stringify(payload, null, 2));

    if (!payload) {
      console.error('Payload verification failed: Empty payload');
      throw new Error('Invalid token payload');
    }

    // Ensure we have all required fields
    const requiredFields = ['email', 'sub', 'given_name'];
    const missingFields = requiredFields.filter((field) => !payload[field]);
    if (missingFields.length > 0) {
      console.error('Missing required fields:', missingFields);
      throw new Error('Missing required profile information');
    }

    const profile = {
      emails: [{ value: payload.email, verified: payload.email_verified || false }],
      id: payload.sub,
      photos: [{ value: payload.picture || '' }],
      name: {
        givenName: payload.given_name,
        familyName: payload.family_name || '',
      },
      provider: 'google',
    };

    console.log('Constructed profile:', JSON.stringify(profile, null, 2));
    return profile;
  } catch (error) {
    console.error('Token verification error:', {
      message: error.message,
      stack: error.stack,
      code: error.code,
    });
    throw new Error(error.message || 'Invalid token');
  }
};

const handleMobileToken = async (token) => {
  console.log('Handling mobile token flow');

  try {
    const profile = await verifyMobileToken(token);
    console.log('Profile verified successfully, proceeding to social login');

    // Return a promise that wraps the callback-based socialLogin
    return new Promise((resolve, reject) => {
      googleLogin(
        null, // accessToken (not needed for this flow)
        null, // refreshToken (not needed for this flow)
        profile,
        (err, user) => {
          if (err) {
            console.error('Social login error:', {
              message: err.message,
              stack: err.stack,
              code: err.code,
            });
            reject(err);
          } else if (!user) {
            console.error('Social login returned no user');
            reject(new Error('No user returned from social login'));
          } else {
            console.log('Social login successful:', {
              userId: user._id,
              isNewUser: !user._id,
            });
            resolve({
              user,
              created: !user._id,
            });
          }
        },
      );
    });
  } catch (error) {
    console.error('Handle mobile token error:', {
      message: error.message,
      stack: error.stack,
      code: error.code,
    });
    throw error; // Re-throw to be caught by the route handler
  }
};

module.exports = {
  strategy: () => {
    console.log('Initializing Google Strategy with:', {
      clientID: process.env.GOOGLE_CLIENT_ID ? 'Set' : 'Missing',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ? 'Set' : 'Missing',
      callbackURL: `${process.env.DOMAIN_SERVER}${process.env.GOOGLE_CALLBACK_URL}`,
      proxy: true,
    });

    return new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: `${process.env.DOMAIN_SERVER}${process.env.GOOGLE_CALLBACK_URL}`,
        proxy: true,
      },
      googleLogin,
    );
  },
  handleMobileToken,
};
