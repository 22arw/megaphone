const dbInterface = require('../controllers/dbInterfaces');
const _ = require('lodash');

module.exports = async (req, res, next) => {
  console.log(`Message came in: ${JSON.stringify(req)}`)
  const text = _.toString(req.body.text).trim().toLowerCase();
  const phoneNumber = _.toString(req.body.from).trim();
  const basePhoneNumber = _.toString(req.body.to).trim();

  res.end();

  
}