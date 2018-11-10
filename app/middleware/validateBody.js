/**
 * This file is currently unused. It's the beginning of writing validators for all potential inputs to the application, but there is probably a better way to do it. It needs to let undefined values through but if it's not undefined, to ensure that the value is the appropriate type. Each route will be responsible for ensuring that the correct params are actually present.
 *
 * ie. A number should be of type number OR undefined, nothing else.
 *
 * ie. An email should be a string AND a valid email AND .toLowerCase() OR undefined.
 *
 * ie. A phone number should be a string AND a bandwidth style phone number OR undefined.
 *
 * ie. A string should only be a string OR undefined.
 */

const _ = require('lodash');
const utils = require('../utils');

module.exports = (req, res, next) => {
  if (_.isEmpty(req.body)) return next();

  // Strings
  let password = req.body.password;
  let oldPassword = req.body.oldPassword;
  let confirmPassword = req.body.confirmPassword;
  let baseName = req.body.baseName;
  let orgName = req.body.orgName;
  let bandwidthUserId = req.body.bandwidthUserId;
  let bandwidthApiToken = req.body.bandwidthApiToken;
  let bandwidthApiSecret = req.body.bandwidthApiSecret;
  let message = req.body.message;
  let subscriptionCode = req.body.subscriptionCode;

  // String emails
  let email = req.body.email;
  let newOrgManagerEmail = req.body.newOrgManagerEmail;
  let newOrgOwnerEmail = req.body.newOrgOwnerEmail;
  let newBaseManagerEmail = req.body.newBaseManagerEmail;

  // String bandwidth phone number
  let basePhoneNumber = req.body.basePhoneNumber;

  // Numbers
  let baseId = req.body.baseId;
  let userId = req.body.userId;
  let orgId = req.body.orgId;
};
