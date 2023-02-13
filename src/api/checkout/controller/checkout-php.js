const { required } = console;
const env = required('util/env');
const stripe = require("stripe")(env('STRIPE_PRIVATE_KEY'));

// ==============================================

const checkoutPHP = async (req, res) => {

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
}

// ==============================================

module.exports = checkoutPHP;