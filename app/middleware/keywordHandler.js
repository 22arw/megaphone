const dbInterface = require('../controllers/dbInterfaces');
const _ = require('lodash');
const {inspect} = require('util');
const chalk = require('chalk');

module.exports = async (req, res, next) => {
  console.log(`\n\\/\\/\\/\\/\\/\\/\\/ Begin Message \\/\\/\\/\\/\\/\\/\\/\n`);

  console.log(chalk.bold('Message Summary:'));
  console.log(chalk`from: {blue ${req.body.from}}`);
  console.log(chalk`to: {blue ${req.body.to}}`);
  console.log(chalk`text: {cyanBright ${req.body.text}}`);

  console.log('\n');
  
  console.log(`Headers: ${inspect(req.headers, false, 20, true)}\n`);
  console.log(`Body: ${inspect(req.body, false, 20, true)}\n`);

  console.log(chalk.blue(`/\\/\\/\\/\\/\\/\\ End Message /\\/\\/\\/\\/\\/\\/\\/\\\n`))

  const text = _.toString(req.body.text).trim().toLowerCase();
  const phoneNumber = _.toString(req.body.from).trim();
  const basePhoneNumber = _.toString(req.body.to).trim();

  res.end();

  
}