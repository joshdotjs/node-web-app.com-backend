const jwt = require('jsonwebtoken');
// import jwt from 'jsonwebtoken';


// ==============================================

const restricted = (req, res, next) => {
  // the server expects to find the token in the request header Authorization
  const token = req.headers.authorization; // req.headers.authorization is set even though Authorization:abcdef is sent as header when making request.

  console.log('(middleware restricted() - req.headers.authorization: ', req.headers.authorization);


  if (token) {
    
    const token_secret = process.env.TOKEN_SECRET;

    // async verify (with old-school node async callback style)
    // -callback is used to handle success or failure
    jwt.verify(
      token,
      token_secret,
      (err, decoded_token) => {
        if (err) {
          // next(new HttpError('Invalid JWT!', 401));
          next({ message: 'Error 401: Unauthorized access. Invalid JWT!', status: 401});
        } else {
          // -Token is valid => move along!
          res.locals.decoded_token = decoded_token;
          next();
        }
      }
    );
  } else {
    // next(new HttpError('JWT required!', 401));
    // next({ message: 'Error 401: Unauthorized access. JWT required!', status: 401 });
    res.status(401).json({ message: 'ERROR 401: Unauthorized - must be logged in!'});
  }
};

// ==============================================

const admin = (req, res, next) => {
  console.log('(middleware) admin() - res.locals.decoded_token: ', res.locals.decoded_token);

  // console.log('req.decoded_token: ', req.decoded_token);
  if (res.locals.decoded_token.is_admin) {
    next();
  } else {
    // next(new HttpError('Admin role required!', 401));
    // next({ message: 'Error 401: Unauthorized access. Admin role required!', status: 401 });
    res.status(401).json({ message: 'ERROR 401: Unauthorized - Admin only!'});
  }
};

// ==============================================

const checkAuthPayload = (req, res, next) => {
  const { username, password } = req.body;
  const valid = Boolean(username && password && typeof password === 'string');

  if (valid) {
    next();
  } else {
    next({
      status: 422,
      message:
        'Error 422: Unprocessable Entity. Please provide username and password and the password shoud be alphanumeric',
    });
  }
};

// ==============================================

module.exports =  { checkAuthPayload, restricted, admin };
// export default { checkAuthPayload, restricted, admin_only };
