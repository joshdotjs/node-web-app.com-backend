const express = require('express');
const router = express.Router();
// const db = require('../../db/db-config');
const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);

// ==============================================

const response = (status, obj) => res.status(200).json(obj);

// ==============================================

router.get('/php', (req, res) => {
  const frontend_url = process.env.FRONTEND_URL_LARAVEL;
  const message = '[POST] /api/checkout/';
  console.log(message);
  res.status(200).json({ 
    message,
    frontend_url,
    josh: 'josh'
  });
});

// ==============================================

router.post('/php', (req, res) => {

  const frontend_url = process.env.FRONTEND_URL_LARAVEL;

  // --------------------------------------------

  // Checkout database flow:
  //  -Step 1. POST request is sent to NODE/api/checkout/stripe-checkout
  //  -Step 2. NODE/api/checkout/stripe-checkout creates a checkout session with Stripe
  //  -Step 3. Payment intent ID is grabbed from session.payment_intent
  //  -Step 4. POST request is made from NODE endpoint to LARAVEL/api/orders
  //    --POST request contains:
  //      ---cart
  //      ---session.payment_intent
  //  -Step 5. LARAVEL/api/orders creates a new order in the database and sets order status to 0
  //  -Step 6. Webook is hit with payload.type === 'payment_intent.created' and POST request is made to LARAVEL/api/orders/update-order/{payment_intent}
  //  -Step 7. LARAVEL/api/orders/update-order/{payment_intent} updates the order status to 1
  //  -Step 8. The other 4 stages of the payment intent are handled by the webhook in the same manner as (7).

  // --------------------------------------------

  const message = '[POST] /api/checkout/';
  console.log(message);
  res.status(200).json({ 
    message,
    frontend_url,
    josh: 'josh'
  });
});

// ==============================================

const stripeCheckout = ({ frontend_url }) => async (req, res) => {

  console.log('[POST] /api/checkout/stripe-checkout');

  // TODO: Look up the prices from the ID to ensure the prices have not been modified before being sent to backend!
  // TODO: Look up the prices from the ID to ensure the prices have not been modified before being sent to backend!
  // TODO: Look up the prices from the ID to ensure the prices have not been modified before being sent to backend!
  // TODO: Look up the prices from the ID to ensure the prices have not been modified before being sent to backend!



  const { cart, user } = req.body;

  console.log('====================================');
  console.log('cart: ', cart);
  console.log('====================================')
  console.log('user: ', user);
  console.log('====================================')

  if (cart && cart.length > 0) {

    console.log('endpoint hit!');
    


    const line_items = cart.map(({product: { title, price}, variant, qty}) => {
      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: title,
          },
          unit_amount: price, //storeItem.priceInCents,
        },
        quantity: qty, //item.quantity,
      }
    });

    console.log('line_items: ', line_items);

    // ------------------------------------------

    try {

      // Step 2:
      const session = await stripe.checkout.sessions.create({
        // payment_method_types: ["card", "afterpay_clearpay", "klarna"],
        payment_method_types: ["card", "klarna"],
        mode: "payment",
        line_items,
        success_url: `${frontend_url}/checkout-success`,
        cancel_url: `${frontend_url}/checkout-fail`,
        currency: 'USD',
      });
      // console.log('session: ', session);

      // Step 3:
      const payment_intent_id = session.payment_intent;
      console.log('payment_intent_id: ', payment_intent_id);

      // Step 4:
      const insertOrderInDB = () => {
        const url = `${process.env.FRONTEND_URL_LARAVEL}/api/orders`;
        console.log('url: ', url);
        console.blue('making request to LARAVEL/api/orders');

        fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json", },
          body: JSON.stringify({ cart, user, payment_intent_id }),
        })
          .then(res => res.json())
          .then((data) => {
            console.log("***********************************");
            console.log("response from LARAVEL/api/orders: ");
            console.log('data: ', data);
            console.log("***********************************");

            // Send response to fontend
            console.blue('sending response to frontend - which sends user to STRIPE checkout')
            res.json({ url: session.url })
          })
          .catch(e => console.log(e.error));  
      };
      insertOrderInDB();
      
    } catch (e) {
      console.red(e);
      res.status(500).json({ error: e.message })
    }
  } else {
    res.status(200).json({ message: 'empty cart', url: `${frontend_url}/checkout-fail` });
  }
};

// ==============================================

// router.get("/stripe-checkout-laravel",    (req, res) => {
//   console.log('[GET] /api/checkout/stripe-checkout-node');

//   const frontend_url_laravel = process.env.FRONTEND_URL_LARAVEL;


//   res.json({ message: "Hello from Stripe Checkout Node!", frontend_url_laravel });
// });

// ==============================================

router.post("/stripe-checkout-node",    stripeCheckout({ frontend_url: process.env.FRONTEND_URL_NEXT,    }));
router.post("/stripe-checkout-laravel", stripeCheckout({ frontend_url: process.env.FRONTEND_URL_LARAVEL, }));
// router.post("/stripe-checkout-wp",      stripeCheckout({ frontend_url: process.env.FRONTEND_URL_WP,      }));
router.post("/stripe-checkout-wp", async (req, res) => {
  
  const frontend_url = process.env.FRONTEND_URL_WP;

  console.log('[POST] /api/checkout/stripe-checkout');

  // TODO: Look up the prices from the ID to ensure the prices have not been modified before being sent to backend!
  // TODO: Look up the prices from the ID to ensure the prices have not been modified before being sent to backend!
  // TODO: Look up the prices from the ID to ensure the prices have not been modified before being sent to backend!
  // TODO: Look up the prices from the ID to ensure the prices have not been modified before being sent to backend!

  const { cart } = req.body;

  console.log('req.body: ', req.body);

  if (cart && cart.length > 0) {

    console.log('endpoint hit!');

    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card', 'klarna'],
        mode: "payment",
        line_items: cart.map(item => {

          
          return {
            price_data: {
              currency: "usd",
              product_data: {
                name: item.title,
              },
              unit_amount: item.price, //storeItem.priceInCents,
            },
            quantity: item.qty, //item.quantity,
          }
        }),
        success_url: `${frontend_url}/orders`,
        cancel_url: `${frontend_url}/checkout-fail`,
        currency: 'USD', // https://stripe.com/docs/currencies
      });

      console.log('session: ', session);

      res.json({ url: session.url })
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  } else {
    res.status(200).json({ message: 'empty cart', url: `${frontend_url}/checkout-fail` });
  }
});

// ==============================================

// Use body-parser to retrieve the raw body as a buffer
const bodyParser = require('body-parser');

// Official: https://youtu.be/Psq5N5C-FGo
// jank: https://youtu.be/NSY1lPzJzlE
router.post('/webhook', bodyParser.raw({type: 'application/json'}), (request, response) => {
  const payload = request.body;
  const { type } = payload;
  
  // payload type:  payment_intent.created
  // payload type:  customer.created
  // payload type:  payment_intent.succeeded
  // payload type:  charge.succeeded
  // payload type:  checkout.session.completed
  
  const updateOrderStatus = (status) => {
    const payload = request.body;
    const { type } = payload;
    // console.log('payload type: ', type);
    // console.log('payload: ', payload);


    // NOTE: This is only payment_intent ID for type === payment_intent.created & payment_intent.succeeded
    const payment_intent_id = payload.data.object.id;
    console.log('payment_intent_id: ', payment_intent_id);
    
    const url = `${process.env.FRONTEND_URL_LARAVEL}/api/orders/update-status`;
    console.log('url: ', url);
    console.blue('making POST request to LARAVEL/api/order/update-status');
    
    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", },
      body: JSON.stringify({ payment_intent_id, status }),
    })
      .then(res => res.json())
      .then((data) => {
        console.log("***********************************");
        console.log("response from LARAVEL/api/orders: ");
        console.log('data: ', data);
        console.log("***********************************");

        // Send response to fontend
        console.blue('sending response to frontend - which sends user to STRIPE checkout')
        res.json({ url: session.url })
      })
      .catch(e => console.error(e.error));  
  };


  if (type === 'payment_intent.created') {
    console.yellow('Stage 1');
  } else if (type === 'customer.created') {
    console.green('Stage 2');
  } else if (type === 'payment_intent.succeeded') {
    console.log("***********************************");
    console.magenta('Stage 3');
    updateOrderStatus(3);
    console.log("***********************************");
  } else if (type === 'charge.succeeded') {
    console.yellow('Stage 4');
  } else if (type === 'checkout.session.completed') {
    console.cyan('Stage 5');
  }

  response.status(200).end(); // https://stackoverflow.com/a/68440790 -- "Client.Timeout exceeded while awaiting headers"
});

// ==============================================

module.exports = router;