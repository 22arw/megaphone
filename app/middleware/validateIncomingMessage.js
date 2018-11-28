const dbInterface = require('../controllers/dbInterfaces');
const _ = require('lodash');
const { inspect } = require('util');
const utils = require('../utils');
const Bandwidth = require('node-bandwidth');

const keywords = ['help', 'who'];

module.exports = async (req, res, next) => {
  logMessageToConsole(req);

  const text = _.toString(req.body.text)
    .trim()
    .toLowerCase();
  const phoneNumber = _.toString(req.body.from).trim();
  const basePhoneNumber = _.toString(req.body.to).trim();

  let message = '';

  if (
    _.isEmpty(text) ||
    !utils.isValidPhoneNumber(phoneNumber) ||
    !utils.isValidPhoneNumber(basePhoneNumber)
  ) {
    return res.end();
  }

  if (await dbInterface.isBasePhoneNumberUnique(basePhoneNumber)) {
    return res.end();
  }

  const base = await dbInterface.getBaseByBasePhoneNumber(basePhoneNumber);

  const bandwidthConfig = {
    userId: base.bandwidthUserId,
    apiToken: base.bandwidthApiToken,
    apiSecret: base.bandwidthApiSecret
  };

  // Handle keywords
  if (_.indexOf(keywords, text) > -1) {
    switch (text) {
      case 'help':
        sendMessage(
          getHelpMessage(),
          phoneNumber,
          basePhoneNumber,
          bandwidthConfig
        );
        break;
      case 'who':
        sendWhoMessage(phoneNumber, base, bandwidthConfig);
        break;
    }
    return res.end();
  }

  // Does that org exist?
  const doesOrgExist = await dbInterface.doesOrgExistBySubscriptionCode(text);
  if (!doesOrgExist) {
    message = 'That is an invalid command. Reply "HELP" for more info.';
    sendMessage(message, phoneNumber, basePhoneNumber, bandwidthConfig);
    return res.end();
  }

  const org = await dbInterface.getOrgBySubscriptionCode(text);

  console.log('Org: ', org);

  // Does this org belong to the base we're trying to access via the basePhoneNumber?
  const doesOrgBelongToBase = await dbInterface.doesOrgBelongToBase(
    org.id,
    base.id
  );
  if (!doesOrgBelongToBase) {
    message = 'That is an invalid command. Reply "HELP" for more info.';
    sendMessage(message, phoneNumber, basePhoneNumber, bandwidthConfig);
    return res.end();
  }

  // If it passes everything up till now, the incoming message has been validated and we can move on.
  console.log('Message passed all tests.');
  req.body.text = text;
  req.body.to = basePhoneNumber;
  req.body.from = phoneNumber;
  next();
};

function logMessageToConsole(req) {
  console.log(
    `\n\\/\\/\\/\\/\\/\\/\\/ Incoming Message \\/\\/\\/\\/\\/\\/\\/\n`
  );

  console.log('Message Summary:');
  console.log('From: ', req.body.from);
  console.log('To: ', req.body.to);
  console.log('Text: ', req.body.text);

  console.log('\n');

  console.log(`Headers: ${inspect(req.headers, false, 20, true)}\n`);
  console.log(`Body: ${inspect(req.body, false, 20, true)}\n`);

  console.log(`/\\/\\/\\/\\/\\/\\ End Message /\\/\\/\\/\\/\\/\\/\\/\\\n`);
}

// SEND MESSAGE FROM SYSTEM
function sendMessage(message, phoneNumber, basePhoneNumber, bandwidthConfig) {
  const bandwidth = new Bandwidth(bandwidthConfig);

  bandwidth.Message.send({
    from: basePhoneNumber,
    to: phoneNumber,
    text: message
  })
    .then(msg => {
      console.log(`Message Sent with ID: ${msg.id}`);
      console.log(`Sent: ${msg.text}`); // this may need some tweaking.
    })
    .catch(err => console.error(err));
}

function getHelpMessage() {
  return `The following commands are available on this service:

HELP - Returns this message.
WHO - Returns a message with all of your subscriptions.
    
To block this number and kill all subscriptions, reply 'stop'.

To SUBSCRIBE send subscription code.
To UNSUBSCRIBE send the same subscription code.`;
}

async function sendWhoMessage(phoneNumber, base, bandwidthConfig) {
  const allOrgsUnderBase = await dbInterface
    .getAllOrgsUnderBase(base.id)
    .catch(err => console.error(err));

  if (_.isEmpty(allOrgsUnderBase)) {
    return sendMessage(
      'You have no subscriptions',
      phoneNumber,
      base.basePhoneNumber,
      bandwidthConfig
    );
  }

  const allSubscriptionsByPhoneNumber = await dbInterface
    .getAllSubscriptionsByPhoneNumber(phoneNumber)
    .catch(err => console.error(err));

  if (_.isEmpty(allSubscriptionsByPhoneNumber)) {
    return sendMessage(
      'You have no subscriptions. Reply HELP for more info.',
      phoneNumber,
      base.basePhoneNumber,
      bandwidthConfig
    );
  }

  message = 'You are subscribed to the following organizations:\n';
  allSubscriptionsByPhoneNumber.map(sub => {
    for (let org = 0; org < allOrgsUnderBase.length; org++) {
      if (sub.orgId === allOrgsUnderBase[org].id) {
        message += `\n${allOrgsUnderBase[
          org
        ].subscriptionCode.toUpperCase()}: ${allOrgsUnderBase[org].orgName}`;
      }
    }
  });

  sendMessage(message, phoneNumber, base.basePhoneNumber, bandwidthConfig);
}
