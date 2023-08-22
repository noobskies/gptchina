console.log('rateLimit middleware executed');

const UserActivity = require('../models/UserActivity');

const rateLimit = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const subscriptionStatus = req.user.subscriptionStatus; // Get user's subscription status
    const model = req.body.model;

    // Set rate limit based on subscription status and model
    let maxMessagesPerDay;
    if (subscriptionStatus === 'active') {
      if (model === 'gpt-4') {
        maxMessagesPerDay = 2; // Limit for 'gpt-4' model for subscribed users
      } else {
        maxMessagesPerDay = 100; // Limit for other models for subscribed users
      }
    } else {
      maxMessagesPerDay = 25; // Limit for non-subscribed users
      if (model === 'gpt-4') {
        // Use JSON format to return the error.
        return res.status(403).json({
          code: 'subscription_required',
          text: 'The gpt-4 model is only available to subscribed users.',
        });
      }
    }

    // Get today's date
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    console.log(`Checking messages for user: ${userId} for date: ${today}`);

    let userActivity = await UserActivity.findOne({
      userId,
      date: { $gte: today },
    });

    if (!userActivity) {
      console.log(`No messages found for user: ${userId} for date: ${today}`);
      userActivity = new UserActivity({ userId });
    }

    console.log(`User: ${userId} message count: ${userActivity.messageCount}`);

    if (userActivity.messageCount >= maxMessagesPerDay) {
      console.log(`Rate limit exceeded for user: ${userId}`);
      return res
        .status(429)
        .json({ text: `Rate limit exceeded. You can send ${maxMessagesPerDay} messages per day.` });
    }

    userActivity.messageCount += 1;
    await userActivity.save();

    console.log(
      `Message sent for user: ${userId}. Updated message count: ${userActivity.messageCount}`,
    );

    next();
  } catch (error) {
    console.error('Error in rateLimit middleware:', error);
    return res.status(500).json({ text: 'Internal Server Error', error: error.message });
  }
};

module.exports = rateLimit;
