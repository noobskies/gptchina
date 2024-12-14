const { Strategy: AppleStrategy } = require('passport-apple');
const socialLogin = require('./socialLogin');

const getProfileDetails = (profile) => ({
  email: profile.emails[0].value,
  id: profile.id,
  avatarUrl: profile.photos?.[0]?.value || '',
  username: profile.name?.givenName || `apple_${profile.id.split('.')[0]}`,
  name: profile.name?.fullName || `apple_${profile.id.split('.')[0]}`,
  emailVerified: profile.emails[0].verified,
});

const appleLogin = socialLogin('apple', getProfileDetails);

// Verify mobile token
const verifyMobileToken = async (token) => {
  try {
    const decodedToken = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());

    if (!decodedToken.sub || !decodedToken.email) {
      throw new Error('Missing required profile information');
    }

    // Convert Apple's token format to match our profile structure
    return {
      emails: [
        {
          value: decodedToken.email,
          verified: decodedToken.email_verified || false,
        },
      ],
      id: decodedToken.sub,
      photos: [{ value: '' }],
      name: {
        givenName: decodedToken.name?.firstName || `apple_${decodedToken.sub.split('.')[0]}`,
        familyName: decodedToken.name?.lastName || '',
        fullName: decodedToken.name?.firstName
          ? `${decodedToken.name.firstName} ${decodedToken.name.lastName || ''}`
          : `apple_${decodedToken.sub.split('.')[0]}`,
      },
      provider: 'apple',
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
      appleLogin(
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
          // Parse the ID token to get email and user info
          const decodedToken = JSON.parse(Buffer.from(idToken.split('.')[1], 'base64').toString());

          // Construct profile object to match our expected format
          const enhancedProfile = {
            emails: [
              {
                value: decodedToken.email,
                verified: decodedToken.email_verified || false,
              },
            ],
            id: decodedToken.sub,
            photos: [{ value: '' }],
            name: {
              givenName:
                req.body?.user?.name?.firstName || `apple_${decodedToken.sub.split('.')[0]}`,
              familyName: req.body?.user?.name?.lastName || '',
              fullName: req.body?.user?.name?.firstName
                ? `${req.body.user.name.firstName} ${req.body.user.name.lastName || ''}`
                : `apple_${decodedToken.sub.split('.')[0]}`,
            },
            provider: 'apple',
          };

          return appleLogin(accessToken, refreshToken, enhancedProfile, cb);
        } catch (error) {
          console.error('Error in Apple Strategy:', error);
          return cb(error);
        }
      },
    ),
  handleMobileToken,
};
