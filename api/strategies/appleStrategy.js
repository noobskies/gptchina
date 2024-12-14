const { Strategy: AppleStrategy } = require('passport-apple');
const jwt = require('jsonwebtoken');
const socialLogin = require('./socialLogin');
const { logger } = require('~/config');

const getProfileDetails = (profile) => {
  console.log('getProfileDetails called with:', {
    profile: JSON.stringify(profile, null, 2),
  });

  // Create base profile
  const profileData = {
    email: profile.email,
    id: profile.id || profile.sub,
    avatarUrl: '',
    username: '',
    name: '',
    emailVerified: true,
  };

  // Set username and name based on available data
  const shortId = profileData.id ? profileData.id.substring(0, 8) : 'unknown';
  profileData.username = profile.username || `apple_${shortId}`;
  profileData.name = profile.name || profileData.username;

  console.log('Constructed profile data:', JSON.stringify(profileData, null, 2));
  return profileData;
};

// Create the Apple login handler
const appleLogin = socialLogin('apple', getProfileDetails);

// Verify mobile token (iOS)
const verifyMobileToken = async (token) => {
  console.log('verifyMobileToken called with token:', token ? 'present' : 'missing');
  try {
    const decodedToken = jwt.decode(token);
    console.log('Decoded token:', JSON.stringify(decodedToken, null, 2));

    if (!decodedToken) {
      throw new Error('Invalid token format');
    }

    // Ensure we have required fields
    if (!decodedToken.sub) {
      throw new Error('Missing required profile information');
    }

    const profile = {
      id: decodedToken.sub,
      email: decodedToken.email || `private.${decodedToken.sub}@privaterelay.appleid.com`,
      sub: decodedToken.sub,
      provider: 'apple',
    };

    console.log('Created profile from token:', JSON.stringify(profile, null, 2));
    return profile;
  } catch (error) {
    console.error('Apple token verification error:', error);
    console.error('Error details:', error.stack);
    throw new Error(error.message || 'Invalid token');
  }
};

const handleAppleToken = async (token) => {
  console.log('handleAppleToken called');
  try {
    const profile = await verifyMobileToken(token);
    console.log('Profile after verification:', JSON.stringify(profile, null, 2));

    return new Promise((resolve, reject) => {
      appleLogin(null, null, profile, (err, user) => {
        if (err) {
          console.error('Social login error:', err);
          reject(err);
        } else if (!user) {
          console.error('No user returned from social login');
          reject(new Error('No user returned from social login'));
        } else {
          console.log('Social login successful, user:', JSON.stringify(user, null, 2));
          resolve({
            user,
            created: !user._id,
          });
        }
      });
    });
  } catch (error) {
    console.error('Handle Apple token error:', error);
    console.error('Error stack:', error.stack);
    throw error;
  }
};

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
    (req, accessToken, refreshToken, idToken, profile, cb) => {
      try {
        console.log('Apple OAuth Callback Data:', {
          req,
          hasAccessToken: !!accessToken,
          hasRefreshToken: !!refreshToken,
          hasIdToken: !!idToken,
          profile: JSON.stringify(profile, null, 2),
        });

        // Merge profile data from idToken if available
        if (idToken) {
          const decodedToken = jwt.decode(idToken);
          console.log('Decoded ID token:', JSON.stringify(decodedToken, null, 2));
          profile = {
            ...profile,
            id: decodedToken.sub,
            email: decodedToken.email,
            sub: decodedToken.sub,
          };
        }

        console.log('Final profile being passed to appleLogin:', JSON.stringify(profile, null, 2));
        return appleLogin(accessToken, refreshToken, profile, cb);
      } catch (error) {
        console.error('Error in Apple Strategy:', error);
        console.error('Error stack:', error.stack);
        return cb(error);
      }
    },
  );
