const User = require('../../models/User');
const Message = require('../../models/schema/messageSchema');

module.exports = async (req, res, next) => {
  const userId = req.user.id;
  const messageId = req.body.messageId;
  console.log(`Searching for message with ID: ${messageId}`); // Debugging log

  // Retrieve the message
  const message = await Message.findOne({ messageId: messageId });
  if (!message) {
    console.error(`Message not found for messageId: ${messageId}`);
    return res.status(404).json({ message: 'Message not found.' });
  }

  console.log('Found message:', message); // Debugging log

  const tokenCountFromRequest = message.tokenCount;

  // Define the rate limit
  const maxTokens = 100000;

  // Retrieve the user
  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ message: 'User not found.' });
  }

  // Update the user's token usage
  await user.updateTokenUsage(tokenCountFromRequest);

  if (user.tokenUsage > maxTokens) {
    // Token limit exceeded
    return res.status(429).json({ message: 'Too many tokens used, please try again later.' });
  }

  // Continue to the next middleware
  next();
};
