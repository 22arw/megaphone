const utils = require('../utils');
const TOKEN = utils.tokenService;

module.exports = (req, res, next) => {
  process.stdout.write('Attempting to authenticate... ');
  let token =
    req.body.token || req.query.token || req.headers['x-access-token'];
  // console.log('TIME: ', new Date().toLocaleString());
  // console.log(`TOKEN BODY: ${req.body.token}`);
  // console.log(`TOKEN QUERY: ${req.query.token}`);
  // console.log(`TOKEN HEADER: ${req.headers['x-access-token']}`);

  if (req.path == '/auth/login') {
    return next();
  } else {
    if (token) {
      TOKEN.isValid(token, res, function(validToken) {
        if (validToken) {
          req.userId = JSON.parse(validToken.data);
          req.token = TOKEN.generate(validToken.data);
          console.log('authenticated!');
          return next();
        }
      });
    } else {
      console.log('\n');
      console.log('Token not valid');
      return res.sendStatus(401);
    }
  }
};
