// api/server/controllers/PaymentController.js
const sendEmail = require('../utils/sendEmail');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const addTokensByUserId = require('../../../config/addTokens');
const User = require('~/models/User');

const PAYMENT_METHOD_CARD = 'card';
const PAYMENT_METHOD_ALIPAY = 'alipay';
const PAYMENT_METHOD_WECHAT_PAY = 'wechat_pay';
const PAYMENT_OPTION_GOOGLE_PAY = 'google_pay';
const PAYMENT_OPTION_APPLE_PAY = 'apple_pay';

const CHECKOUT_SESSION_COMPLETED = 'checkout.session.completed';
const PAYMENT_INTENT_PAYMENT_FAILED = 'payment_intent.payment_failed';
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

// Create a Set to store processed session IDs
const processedSessions = new Set();

exports.createPaymentIntent = async (req, res) => {
  try {
    const { priceId, userId, domain, email, paymentMethod, isNative } = req.body;
    console.log('Received payment intent request:', {
      priceId,
      userId,
      domain,
      email,
      paymentMethod,
      isNative,
    });

    // Validate price ID
    if (!Object.prototype.hasOwnProperty.call(priceDetailsConfig, priceId)) {
      console.error('Invalid price ID:', priceId);
      return res.status(400).json({ error: 'Invalid price ID' });
    }

    // Validate required fields
    if (!userId || !email || !domain) {
      console.error('Missing required fields:', { userId, email, domain });
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Validate payment method
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

    // Configure payment method options
    const paymentMethodOptions = {};
    if (paymentMethod === PAYMENT_METHOD_WECHAT_PAY) {
      paymentMethodOptions.wechat_pay = {
        client: 'web',
      };
    }

    // Determine payment method types
    const payment_method_types = [
      paymentMethod === PAYMENT_OPTION_GOOGLE_PAY || paymentMethod === PAYMENT_OPTION_APPLE_PAY
        ? PAYMENT_METHOD_CARD
        : paymentMethod,
    ];

    // Configure URLs
    const baseUrl = `https://${domain}`;
    const successUrl = isNative
      ? `${baseUrl}/stripe-success?user_id=${userId}&price_id=${priceId}`
      : `${baseUrl}?user_id=${userId}&price_id=${priceId}&status=success`;
    const cancelUrl = isNative
      ? `${baseUrl}/stripe-cancel?user_id=${userId}&price_id=${priceId}`
      : `${baseUrl}?user_id=${userId}&price_id=${priceId}&status=cancelled`;

    // Create session options
    const sessionOptions = {
      payment_method_types,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      payment_intent_data: {
        metadata: {
          userId: userId.toString(),
          email,
          priceId,
          domain,
          isNative: isNative ? 'true' : 'false',
        },
      },
      metadata: {
        userId: userId.toString(),
        priceId,
        isNative: isNative ? 'true' : 'false',
      },
      customer_email: email,
      payment_method_options: paymentMethodOptions,
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
    };

    console.log('Creating Stripe Checkout session with options:', sessionOptions);

    const session = await stripe.checkout.sessions.create(sessionOptions);
    console.log('Stripe Checkout session created:', session);

    res.status(200).json({
      sessionId: session.id,
      url: session.url,
    });
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

  const handleSuccessfulPayment = async (session) => {
    const { userId, priceId } = session.metadata;
    const amount = session.amount_total;

    if (!Object.prototype.hasOwnProperty.call(priceDetailsConfig, priceId)) {
      console.error('Invalid price ID:', priceId);
      return { success: false, error: 'Invalid price ID' };
    }

    // Check if this session has already been processed
    if (processedSessions.has(session.id)) {
      console.log(`Session ${session.id} already processed`);
      return { success: true, message: 'Payment already processed' };
    }

    const tokens = priceDetailsConfig[priceId].tokens;

    try {
      const newBalance = await addTokensByUserId(userId, tokens);
      console.log(`Payment succeeded. User ID: ${userId}, New balance: ${newBalance}`);

      // Mark this session as processed
      processedSessions.add(session.id);

      // Send payment confirmation email
      const user = await User.findById(userId);
      if (user && user.email) {
        const currentDate = new Date();
        const readableDate = currentDate.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });

        const region = priceDetailsConfig[priceId].region;
        const currencyCode = region === 'China' ? 'CNY' : 'USD';

        const formattedAmount = (amount / 100).toLocaleString('en-US', {
          style: 'currency',
          currency: currencyCode,
        });

        await sendEmail({
          email: user.email,
          subject: 'Payment Confirmation',
          payload: {
            appName: process.env.VITE_APP_AUTHOR || process.env.APP_TITLE || 'Novlisky',
            name: user.name,
            email: user.email,
            tokens: tokens.toLocaleString(),
            amount: formattedAmount,
            date: readableDate,
            year: new Date().getFullYear(),
          },
          template: 'paymentConfirmation.handlebars',
        });
      }

      return { success: true, newBalance };
    } catch (error) {
      console.error(`Error updating balance or sending email: ${error.message}`);
      return { success: false, error: error.message };
    }
  };

  // Declare session variable outside switch statement
  let session;
  let result;

  switch (event.type) {
    case CHECKOUT_SESSION_COMPLETED:
      session = event.data.object;
      console.log('Checkout session completed:', session);

      if (session.payment_status === 'paid') {
        result = await handleSuccessfulPayment(session);
      } else {
        console.log('Checkout session not paid, skipping token addition');
        return res.status(200).json({ message: 'Checkout session not paid' });
      }
      break;

    case PAYMENT_INTENT_PAYMENT_FAILED:
      console.error('Payment failed:', event.data.object);
      return res.status(200).json({ message: 'Payment failed' });

    case CHARGE_FAILED:
      console.error('Charge failed:', event.data.object);
      return res.status(200).json({ message: 'Charge failed' });

    default:
      console.log(`Skipping event type: ${event.type}`);
      return res.status(200).json({ message: `Skipped event type: ${event.type}` });
  }

  if (result) {
    if (result.success) {
      res.status(200).json({
        message: result.message || `Payment succeeded. New balance is ${result.newBalance}`,
      });
    } else {
      res.status(500).json({ error: `Error processing payment: ${result.error}` });
    }
  }
};
