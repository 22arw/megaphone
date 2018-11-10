const _ = require('lodash');

module.exports = (req, res, next) => {
  if (_.isEmpty(req.body)) return next();
  let token = req.body.token;
  let email = req.body.email;
  let password = req.body.password;
  let oldPassword = req.body.oldPassword;
  let confirmPassword = req.body.confirmPassword;
  let basePhoneNumber = req.body.basePhoneNumber;
  let baseName = req.body.baseName;
  let bandwidthUserId = req.body.bandwidthUserId;
  let bandwidthApiToken = req.body.bandwidthApiToken;
  let bandwidthApiSecret = req.body.bandwidthApiSecret;
};
