const { required } = console;
const env = required('util/env');

// ==============================================

const checkoutPHP = (req, res) => {
  const frontend_url = env('FRONTEND_URL_LARAVEL');
  const message = '[POST] /api/checkout/php';
  console.log(message);
  res.status(200).json({ 
    message,
    frontend_url,
    token_secret:       env('TOKEN_SECRET'),
    stripe_private_key: env('STRIPE_PRIVATE_KEY'),
    frontend_url_next:  env('FRONTEND_URL_NEXT'),
    frontend_url_wp:    env('FRONTEND_URL_WP'),
  });
};

// ==============================================

module.exports = checkoutPHP;