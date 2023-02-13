// ==============================================

const checkoutWebhook = (request, response) => {
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


  // if (type === 'payment_intent.created') {
  //   console.yellow('Stage 1');
  // }  else if (type === 'customer.created') {
  //   console.green('Stage 2');
  // } else
   if (type === 'payment_intent.succeeded') {
    console.log("***********************************");
    console.magenta('Stage 3');
    updateOrderStatus(3);
    console.log("***********************************");
  } 
  // else if (type === 'charge.succeeded') {
  //   console.yellow('Stage 4');
  // } 
  // else if (type === 'checkout.session.completed') {
  //   console.cyan('Stage 5');
  // }

  response.status(200).end(); // https://stackoverflow.com/a/68440790 -- "Client.Timeout exceeded while awaiting headers"
}

// ==============================================

module.exports = checkoutWebhook;