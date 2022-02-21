require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const app = express();

app.use(express.json());
app.use(cors());

// routes;

app.post('/payment', async (req, res) => {
  try {
    const { product, token } = req.body;
    console.log(token);
    const idempotencyKey = uuidv4();
    const customer = await stripe.customers.create({
      email: token.email,
      source: token.id,
    });
    const result = await stripe.charges.create(
      {
        amount: product.price * 100,
        currency: 'usd',
        customer: customer.id,
        receipt_email: token.email,
        description: `purchase products for ${product.name}`,

        shipping: {
          name: token.card.name,
          address: {
            country: token.card.address_country,
          },
        },
      },
      { idempotencyKey }
    );

    return res.status(200).json(result);
  } catch (error) {
    console.error(error);
  }
});

app.get('/stripeapi', async (req, res) => {
  res.json({
    stripeApiKey: process.env.STRIPE_API_KEY,
  });
});

const port = process.env.PORT || 5000;

app.listen(port, () => console.log('Server listening on port 5000'));
