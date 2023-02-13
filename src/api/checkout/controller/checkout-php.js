const { required } = console;
const env = required('util/env');
const stripe = require("stripe")(env('STRIPE_PRIVATE_KEY'));

// ==============================================

const checkoutPHP = async (req, res) => {

  const frontend_url = env('FRONTEND_URL_LARAVEL');
  // const message = '[POST] /api/checkout/php';
  // console.log(message);
  // res.status(200).json({ 
  //   message,
  //   frontend_url,
  //   token_secret:       env('TOKEN_SECRET'),
  //   stripe_private_key: env('STRIPE_PRIVATE_KEY'),
  //   frontend_url_next:  env('FRONTEND_URL_NEXT'),
  //   frontend_url_wp:    env('FRONTEND_URL_WP'),
  // });

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


  // AFTER TEA:
  //  -1. test that this endpoint is working locally
  //  -2. test that this endpoint is working on the server


  const { cart, user } = req.body;

  // console.log('====================================');
  // console.log('cart: ', cart);
  // console.log('====================================')
  // console.log('user: ', user);
  // console.log('====================================')

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
    // console.log('line_items: ', line_items);

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

        const body = { cart, user, payment_intent_id };
        console.log('body: ', body);


        // fetch(`${process.env.FRONTEND_URL_LARAVEL}/api`)
        //   .then(res => {
        //     res.json();
        //   })
        //   .then(data => console.log('data: ', data))
        //   .catch(e => console.log(e.error));


        fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json", },
          body: JSON.stringify(body),
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
      
      res.status(500).json({ error: e.message })
    }
  } else {
    res.status(200).json({ message: 'empty cart', url: `${frontend_url}/checkout-fail` });
  }
}

// ==============================================

module.exports = checkoutPHP;