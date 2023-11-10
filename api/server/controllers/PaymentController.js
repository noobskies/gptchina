const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const addTokensByUserId = require('../../../config/addTokens'); // Adjust the import path

exports.createPaymentIntent = async (req, res) => {
  try {
    let { amount, userId } = req.body;
    amount = parseInt(amount, 10) * 100 * 0.7;

    if (isNaN(amount) || amount <= 0) {
      res.status(400).json({ error: `Invalid amount: ${amount}` });
      return;
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'wechat_pay', 'alipay'],
      line_items: [
        {
          price_data: {
            currency: 'cny', // Changed to Chinese Yuan
            product_data: {
              name: 'Tokens',
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      payment_intent_data: {
        metadata: {
          userId: userId.toString(),
        },
      },
      payment_method_options: {
        wechat_pay: {
          client: 'web',
        },
      },
      mode: 'payment',
      success_url: 'https://gptchina.io',
      cancel_url: 'https://gptchina.io',
    });

    res.status(200).json({ sessionId: session.id });
  } catch (error) {
    console.error(error); // Log the error to the console
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
    console.log('Webhook Event:', event);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event['type'] === 'payment_intent.succeeded') {
    console.log('Payment Intent Succeeded:', event);
    const paymentIntent = event.data.object;
    const { metadata } = paymentIntent;
    const userId = metadata.userId;
    const amountInRMB = paymentIntent.amount_received / 100;

    console.log('Metadata:', event.data.object.metadata);

    let tokens;
    switch (amountInRMB) {
      case 7: // 70% of 10
        tokens = 100000;
        break;
      case 24.5: // 70% of 35
        tokens = 500000;
        break;
      case 35: // 70% of 50
        tokens = 1000000;
        break;
      case 175: // 70% of 250
        tokens = 10000000;
        break;
      default:
        console.error('Invalid amount:', amountInRMB);
        res.status(400).send({ error: `Invalid amount: ${amountInRMB}` });
        return;
    }

    try {
      const newBalance = await addTokensByUserId(userId, tokens); // Pass tokens instead of amount
      res.status(200).send(`Success! New balance is ${newBalance}`);
    } catch (error) {
      res.status(500).send({ error: `Error updating balance: ${error.message}` });
    }
  } else {
    res.status(200).send();
  }
};
