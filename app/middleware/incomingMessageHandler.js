const dbInterface = require('../controllers/dbInterfaces');
const _ = require('lodash');
const {inspect} = require('util');

module.exports = async (req, res, next) => {
  console.log(`\n\\/\\/\\/\\/\\/\\/\\/ Begin Message \\/\\/\\/\\/\\/\\/\\/\n`);

  console.log('\x1b[1m\x1b[34m%s\x1b[0m' ,'Message Summary:');
  console.log(`from: ${req.body.from}`);
  console.log(`to: ${req.body.to}`);
  console.log(`text: ${req.body.text}`);

  console.log('\n');
  
  console.log(`Headers: ${inspect(req.headers, false, 20, true)}\n`);
  console.log(`Body: ${inspect(req.body, false, 20, true)}\n`);

  console.log(chalk.blue(`/\\/\\/\\/\\/\\/\\ End Message /\\/\\/\\/\\/\\/\\/\\/\\\n`))

  const text = _.toString(req.body.text).trim().toLowerCase();
  const phoneNumber = _.toString(req.body.from).trim();
  const basePhoneNumber = _.toString(req.body.to).trim();

  res.end();

  
}