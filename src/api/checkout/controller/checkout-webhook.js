// ==============================================

const checkoutWebhook = (request, response) => {
  const payload = request.body;
  const { type } = payload;

  
  // payload type:  payment_intent.created
  // payload type:  customer.created
  // payload type:  payment_intent.succeeded
  // payload type:  charge.succeeded
  // payload type:  checkout.session.completed
  
  const updateOrderStatus = ({ status, payment_intent_id, card_brand, card_exp_month, card_exp_year, card_last4 }) => {   
    const url = `${process.env.FRONTEND_URL_LARAVEL}/api/orders/update-status`;
    console.log('url: ', url);
    console.blue('making POST request to LARAVEL/api/order/update-status');
    
    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", },
      body: JSON.stringify({ 
        status, 
        payment_intent_id, 
        card_brand,
        card_exp_month,
        card_exp_year,
        card_last4,
      }),
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


  // if (type === 'payment_intent.created') {
  //   console.yellow('Stage 1');
  // }  else if (type === 'customer.created') {
  //   console.green('Stage 2');
  // } else
   if (type === 'payment_intent.succeeded') {
    console.log("***********************************");
    console.magenta('Stage 3');
    console.log('payload: ', payload);
    
    
    // NOTE: This is only payment_intent ID for type === payment_intent.created & payment_intent.succeeded
    const payment_intent_id = payload.data.object.id;
    console.log('payment_intent_id: ', payment_intent_id);
    
    
    const card = payload.data.object.charges.data[0].payment_method_details.card;
    const { brand, exp_month, exp_year, last4 } = card;
    console.log('brand', brand);
    console.log('exp_month', exp_month);
    console.log('exp_year', exp_year);
    console.log('last4', last4);
    updateOrderStatus({ 
      status: 3,
      payment_intent_id,
      card_brand: brand,
      card_exp_month: exp_month,
      card_exp_year: exp_year,
      card_last4: last4,
    });

    // payload:  {id: 'evt_3Md26JJvji1paQvf1HczLkEB', object: 'event', api_version: '2019-09-09', created: 1676771668, data: {…}, …}
    // arg1:
    // {id: 'evt_3Md26JJvji1paQvf1HczLkEB', object: 'event', api_version: '2019-09-09', created: 1676771668, data: {…}, …}
    // api_version:
    // '2019-09-09'
    // created:
    // 1676771668
    // data:
    // {object: {…}}
    // object:
    // {id: 'pi_3Md26JJvji1paQvf13rjbpGV', object: 'payment_intent', amount: 56697, amount_capturable: 0, amount_details: {…}, …}
    // amount:
    // 56697
    // amount_capturable:
    // 0
    // amount_details:
    // {tip: {…}}
    // amount_received:
    // 56697
    // application:
    // null
    // application_fee_amount:
    // null
    // automatic_payment_methods:
    // null
    // canceled_at:
    // null
    // cancellation_reason:
    // null
    // capture_method:
    // 'automatic'
    // charges:
    // {object: 'list', data: Array(1), has_more: false, total_count: 1, url: '/v1/charges?payment_intent=pi_3Md26JJvji1paQvf13rjbpGV'}
    // data:
    // (1) [{…}]
    // 0:
    // {id: 'ch_3Md26JJvji1paQvf1jKfZj26', object: 'charge', amount: 56697, amount_captured: 56697, amount_refunded: 0, …}
    // amount:
    // 56697
    // amount_captured:
    // 56697
    // amount_refunded:
    // 0
    // application:
    // null
    // application_fee:
    // null
    // application_fee_amount:
    // null
    // balance_transaction:
    // 'txn_3Md26JJvji1paQvf1A2Cdm4Q'
    // billing_details:
    // {address: {…}, email: 'josh@josh.com', name: 'josh', phone: null}
    // address:
    // {city: null, country: 'US', line1: null, line2: null, postal_code: '77777', …}
    // email:
    // 'josh@josh.com'
    


    console.log("***********************************");
  } 
  else if (type === 'charge.succeeded') {
    console.yellow('Stage 4');
    console.log('payload: ', payload);
  } 
  else if (type === 'checkout.session.completed') {
    console.cyan('Stage 5');
    console.log('payload: ', payload);
  }

  response.status(200).end(); // https://stackoverflow.com/a/68440790 -- "Client.Timeout exceeded while awaiting headers"
}

// ==============================================

module.exports = checkoutWebhook;