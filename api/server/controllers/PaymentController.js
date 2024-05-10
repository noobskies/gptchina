const sendEmail = require('../utils/sendEmail');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const addTokensByUserId = require('../../../config/addTokens');
const User = require('~/models/User');

const PAYMENT_METHOD_CARD = 'card';
const PAYMENT_METHOD_ALIPAY = 'alipay';
const PAYMENT_METHOD_WECHAT_PAY = 'wechat_pay';
const PAYMENT_OPTION_GOOGLE_PAY = 'card';
const PAYMENT_OPTION_APPLE_PAY = 'card';

const PAYMENT_INTENT_SUCCEEDED = 'payment_intent.succeeded';
const PAYMENT_INTENT_PAYMENT_FAILED = 'payment_intent.payment_failed';
const PAYMENT_INTENT_CREATED = 'payment_intent.created';
const CHECKOUT_SESSION_COMPLETED = 'checkout.session.completed';
const CHARGE_SUCCEEDED = 'charge.succeeded';
const CHARGE_FAILED = 'charge.failed';

const priceDetailsConfig = {
  price_1ORgzMHKD0byXXClDCm5PkwO: { tokens: 10000000, region: 'China' },
  price_1ORgyiHKD0byXXClHetdaI3W: { tokens: 1000000, region: 'China' },
  price_1ORgyJHKD0byXXClfvOyCbp7: { tokens: 500000, region: 'China' },
  price_1ORgxoHKD0byXXClx3u1yLa0: { tokens: 100000, region: 'China' },
  price_1P6dqBHKD0byXXClWuA2RGY2: { tokens: 100000, region: 'global' },
  price_1P6dqdHKD0byXXClcboa06Tu: { tokens: 500000, region: 'global' },
  price_1P6drEHKD0byXXClOjmSkPKm: { tokens: 1000000, region: 'global' },
  price_1P6drxHKD0byXXClVVLokkLh: { tokens: 10000000, region: 'global' },
};

exports.createPaymentIntent = async (req, res) => {
  try {
    const { priceId, userId, domain, email, paymentMethod } = req.body;
    console.log('Received payment intent request:', {
      priceId,
      userId,
      domain,
      email,
      paymentMethod,
    });

    if (!Object.prototype.hasOwnProperty.call(priceDetailsConfig, priceId)) {
      console.error('Invalid price ID:', priceId);
      return res.status(400).json({ error: 'Invalid price ID' });
    }

    if (!userId || !email || !domain) {
      console.error('Missing required fields:', { userId, email, domain });
      return res.status(400).json({ error: 'Missing required fields' });
    }

    let isValidPaymentMethod = false;
    switch (paymentMethod) {
      case PAYMENT_METHOD_CARD:
      case PAYMENT_OPTION_GOOGLE_PAY:
      case PAYMENT_OPTION_APPLE_PAY:
      case PAYMENT_METHOD_ALIPAY:
      case PAYMENT_METHOD_WECHAT_PAY:
        isValidPaymentMethod = true;
        break;
      default:
        isValidPaymentMethod = false;
    }

    if (!isValidPaymentMethod) {
      console.error('Invalid payment method:', paymentMethod);
      return res.status(400).json({ error: 'Invalid payment method' });
    }

    const paymentMethodOptions = {};

    if (paymentMethod === PAYMENT_METHOD_WECHAT_PAY) {
      paymentMethodOptions.wechat_pay = {
        client: 'web',
      };
    }

    console.log('Creating Stripe Checkout session with options:', {
      payment_method_types: [paymentMethod],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      payment_intent_data: {
        metadata: {
          userId: userId.toString(),
          email: email,
          priceId: priceId,
          domain: domain,
        },
      },
      customer_email: email,
      payment_method_options: paymentMethodOptions,
      mode: 'payment',
      success_url: `${process.env.DOMAIN_CLIENT}`,
      cancel_url: `${process.env.DOMAIN_CLIENT}`,
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: [paymentMethod],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      payment_intent_data: {
        metadata: {
          userId: userId.toString(),
          email: email,
          priceId: priceId,
          domain: domain,
        },
      },
      customer_email: email,
      payment_method_options: paymentMethodOptions,
      mode: 'payment',
      success_url: `${process.env.DOMAIN_CLIENT}`,
      cancel_url: `${process.env.DOMAIN_CLIENT}`,
    });

    console.log('Stripe Checkout session created:', session);

    res.status(200).json({ sessionId: session.id });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({ error: 'An error occurred while creating the payment intent' });
  }
};

exports.handleWebhook = async (req, res) => {
  const sigHeader = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.rawBody,
      sigHeader,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (err) {
    console.error(`Webhook Error: ${err.message}`);
    return res.status(400).json({ error: `Webhook Error: ${err.message}` });
  }

  console.log('Received Stripe webhook event:', event.type);

  let paymentIntent;
  let userId;
  let priceId;
  let tokens;

  switch (event.type) {
    case PAYMENT_INTENT_SUCCEEDED:
      paymentIntent = event.data.object;
      userId = paymentIntent.metadata.userId;
      priceId = paymentIntent.metadata.priceId;
      console.log('Payment intent succeeded:', {
        userId,
        priceId,
        email: paymentIntent.metadata.email,
      });

      if (!Object.prototype.hasOwnProperty.call(priceDetailsConfig, priceId)) {
        console.error('Invalid price ID:', priceId);
        return res.status(400).json({ error: 'Invalid price ID' });
      }

      tokens = priceDetailsConfig[priceId].tokens;

      try {
        const newBalance = await addTokensByUserId(userId, tokens);
        console.log(`Payment succeeded. User ID: ${userId}, New balance: ${newBalance}`);
        res.status(200).json({ message: `Payment succeeded. New balance is ${newBalance}` });

        // Send payment confirmation email
        const user = await User.findById(userId);
        console.log('User object:', user);
        if (user && user.email) {
          console.log('User email:', user.email);
          // Validate the email address if needed
          const currentDate = new Date();
          const readableDate = currentDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          });

          const region = priceDetailsConfig[priceId].region;
          const currencyCode = region === 'China' ? 'CNY' : 'USD';

          const formattedAmount = (paymentIntent.amount / 100).toLocaleString('en-US', {
            style: 'currency',
            currency: currencyCode,
          });

          await sendEmail(
            user.email, // Pass the user's email address as the first argument
            'Payment Confirmation',
            {
              appName: process.env.APP_TITLE || 'Novlisk',
              name: user.name,
              email: user.email,
              tokens: tokens.toLocaleString(),
              amount: formattedAmount,
              date: readableDate,
            },
            'paymentConfirmation.handlebars',
          );
        } else {
          console.warn('User not found or user email not provided');
        }
      } catch (error) {
        console.error(`Error updating balance or sending email: ${error.message}`);
        res
          .status(500)
          .json({ error: `Error updating balance or sending email: ${error.message}` });
      }
      break;
    case PAYMENT_INTENT_PAYMENT_FAILED:
      console.error('Payment failed:', event.data.object);
      // Handle payment failure, e.g., send notifications or retry payment
      res.status(200).json({ message: 'Payment failed' });
      break;
    case PAYMENT_INTENT_CREATED:
      console.log('Payment intent created:', event.data.object);
      res.status(200).json({ message: 'Payment intent created' });
      break;
    case CHECKOUT_SESSION_COMPLETED:
      console.log('Checkout session completed:', event.data.object);
      res.status(200).json({ message: 'Checkout session completed' });
      break;
    case CHARGE_SUCCEEDED:
      console.log('Charge succeeded:', event.data.object);
      res.status(200).json({ message: 'Charge succeeded' });
      break;
    case CHARGE_FAILED:
      console.error('Charge failed:', event.data.object);
      res.status(200).json({ message: 'Charge failed' });
      break;
    default:
      console.warn(`Unhandled event type: ${event.type}`);
      res.status(200).json({ message: `Unhandled event type: ${event.type}` });
  }
};
