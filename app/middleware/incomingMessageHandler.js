const dbInterface = require('../controllers/dbInterfaces');
const _ = require('lodash');
const {inspect} = require('util');

module.exports = async (req, res, next) => {
  console.log(`\n\\/\\/\\/\\/\\/\\/\\/ Begin Message \\/\\/\\/\\/\\/\\/\\/\n`);

  console.log('Message Summary:');
  console.log('From: ', '\x1b[1m\x1b[32m' , req.body.from, '\x1b[0m');
  console.log('To: ', '\x1b[1m\x1b[32m' ,req.body.to, '\x1b[0m');
  console.log('Text: ', '\x1b[1m\x1b[32m' ,req.body.text, '\x1b[0m');

  console.log('\n');
  
  console.log(`Headers: ${inspect(req.headers, false, 20, true)}\n`);
  console.log(`Body: ${inspect(req.body, false, 20, true)}\n`);

  console.log(`/\\/\\/\\/\\/\\/\\ End Message /\\/\\/\\/\\/\\/\\/\\/\\\n`)

  const text = _.toString(req.body.text).trim().toLowerCase();
  const phoneNumber = _.toString(req.body.from).trim();
  const basePhoneNumber = _.toString(req.body.to).trim();

  res.end();

  
}