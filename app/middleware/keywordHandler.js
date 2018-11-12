const dbInterface = require('../controllers/dbInterfaces');
const _ = require('lodash');
const {inspect} = require('util');

module.exports = async (req, res, next) => {
  console.log(`\nMessage came in:\n`);
  console.log(`Headers: ${inspect(req.headers)}\n`);
  console.log(`Body: ${inspect(req.body)}\n`);

  const text = _.toString(req.body.text).trim().toLowerCase();
  const phoneNumber = _.toString(req.body.from).trim();
  const basePhoneNumber = _.toString(req.body.to).trim();

  res.end();

  
}