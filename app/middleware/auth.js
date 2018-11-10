const utils = require('../utils');
const TOKEN = utils.tokenService;

module.exports = (req, res, next) => {
  let token =
    req.body.token || req.query.token || req.headers['x-access-token'];
  console.log('TIME: ', new Date().toLocaleString());

  if (req.path == '/auth/login') {
    return next();
  } else {
    if (token) {
      TOKEN.isValid(token, res, function(validToken) {
        if (validToken) {
          req.userId = JSON.parse(validToken.data);
          req.token = TOKEN.generate(validToken.data);
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
