const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const addTokensByUserId = require('../../../config/addTokens');

const priceConfig = {
  price_1ORgzMHKD0byXXClDCm5PkwO: { tokens: 10000000, region: 'China' },
  price_1ORgyiHKD0byXXClHetdaI3W: { tokens: 1000000, region: 'China' },
  price_1ORgyJHKD0byXXClfvOyCbp7: { tokens: 500000, region: 'China' },
  price_1ORgxoHKD0byXXClx3u1yLa0: { tokens: 100000, region: 'China' },
  price_1P6dqBHKD0byXXClWuA2RGY2: { tokens: 100000, region: 'global' },
  price_1P6dqdHKD0byXXClcboa06Tu: { tokens: 500000, region: 'global' },
  price_1P6drEHKD0byXXClOjmSkPKm: { tokens: 1000000, region: 'global' },
  price_1P6drxHKD0byXXClVVLokkLh: { tokens: 10000000, region: 'global' },
};

const validPaymentMethods = ['card', 'alipay', 'wechat_pay'];

exports.createPaymentIntent = async (req, res) => {
  try {
    const { priceId, userId, domain, email, paymentMethod } = req.body;

    if (!Object.hasOwn(priceConfig, priceId)) {
      res.status(400).json({ error: 'Invalid price ID' });
      return;
    }

    if (!validPaymentMethods.includes(paymentMethod)) {
      res.status(400).json({ error: 'Invalid payment method' });
      return;
    }

    const paymentMethodOptions = {};

    if (paymentMethod === 'wechat_pay') {
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
    console.error(error);
    res.status(500).json({ error: error.message });
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

  if (event['type'] === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object;
    const userId = paymentIntent.metadata.userId;
    const priceId = paymentIntent.metadata.priceId;

    if (!(priceId in priceConfig)) {
      console.error('Invalid price ID:', priceId);
      res.status(400).send({ error: 'Invalid price ID' });
      return;
    }

    const { tokens } = priceConfig[priceId];

    try {
      const newBalance = await addTokensByUserId(userId, tokens);
      res.status(200).send(`Success! New balance is ${newBalance}`);
    } catch (error) {
      console.error(`Error updating balance: ${error.message}`);
      res.status(500).send({ error: `Error updating balance: ${error.message}` });
    }
  } else {
    console.log('Unhandled event type:', event.type);
    res.status(200).send();
  }
};
