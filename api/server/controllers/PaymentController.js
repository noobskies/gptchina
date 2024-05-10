const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const addTokensByUserId = require('../../../config/addTokens');

const PAYMENT_METHOD_CARD = 'card';
const PAYMENT_METHOD_ALIPAY = 'alipay';
const PAYMENT_METHOD_WECHAT_PAY = 'wechat_pay';

const PAYMENT_INTENT_SUCCEEDED = 'payment_intent.succeeded';

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

    if (!Object.prototype.hasOwnProperty.call(priceDetailsConfig, priceId)) {
      return res.status(400).json({ error: 'Invalid price ID' });
    }

    if (!userId || !email || !domain) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    let isValidPaymentMethod = false;
    switch (paymentMethod) {
      case PAYMENT_METHOD_CARD:
      case PAYMENT_METHOD_ALIPAY:
      case PAYMENT_METHOD_WECHAT_PAY:
        isValidPaymentMethod = true;
        break;
      default:
        isValidPaymentMethod = false;
    }

    if (!isValidPaymentMethod) {
      return res.status(400).json({ error: 'Invalid payment method' });
    }

    const paymentMethodOptions = {};

    if (paymentMethod === PAYMENT_METHOD_WECHAT_PAY) {
      paymentMethodOptions.wechat_pay = {
        client: 'web',
      };
    }

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
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === PAYMENT_INTENT_SUCCEEDED) {
    const paymentIntent = event.data.object;
    const userId = paymentIntent.metadata.userId;
    const priceId = paymentIntent.metadata.priceId;

    if (!Object.prototype.hasOwnProperty.call(priceDetailsConfig, priceId)) {
      console.error('Invalid price ID:', priceId);
      return res.status(400).send('Invalid price ID');
    }

    const tokens = priceDetailsConfig[priceId].tokens;

    try {
      const newBalance = await addTokensByUserId(userId, tokens);
      console.log(`Payment succeeded. User ID: ${userId}, New balance: ${newBalance}`);
      res.status(200).send(`Payment succeeded. New balance: ${newBalance}`);
    } catch (error) {
      console.error(`Error updating balance: ${error.message}`);
      res.status(500).send(`Error updating balance: ${error.message}`);
    }
  } else {
    res.status(400).send(`Unexpected event type: ${event.type}`);
  }
};
