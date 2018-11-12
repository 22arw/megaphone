const dbInterface = require('../controllers/dbInterfaces');
const _ = require('lodash');
const util = require('util');

module.exports = async (req, res, next) => {
  console.log(`\nMessage came in: `);
  console.log(util.inspect(req, false, 1, true));
  const text = _.toString(req.body.text).trim().toLowerCase();
  const phoneNumber = _.toString(req.body.from).trim();
  const basePhoneNumber = _.toString(req.body.to).trim();

  res.end();

  
}