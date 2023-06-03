const dotenv = require('dotenv');
dotenv.config();

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const User = require('../../models/User'); // Import your User Model

const createPaymentIntent = async (req, res) => {
  try {
    const { amount, userId } = req.body;
    const paymentIntent = await stripe.paymentIntents.create({ amount, currency: 'usd' });
    res.status(200).json({ client_secret: paymentIntent.client_secret });

    // Update user's freeMessages field upon successful payment
    const bonusMessages = 10; // Define the number of messages to add after payment

    const user = await User.findById(userId);
    user.freeMessages += bonusMessages;
    await user.save();

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createPaymentIntent };
