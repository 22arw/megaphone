const dbInterface = require('./dbInterfaces');
const _ = require('lodash');
const utils = require('../utils');
const Bandwidth = require('node-bandwidth');

module.exports = {
  incomingText: async (req, res) => {
    // message has been pre-validated via middleware.
    const text = req.body.text;
    const phoneNumber = req.body.from;
    const basePhoneNumber = req.body.to;

    subscriptionHandler(phoneNumber, text, basePhoneNumber);
    res.end();
  }
};

const subscriptionHandler = async (phoneNumber, text, basePhoneNumber) => {
  let message = '';

  const base = await dbInterface
    .getBaseByBasePhoneNumber(basePhoneNumber)
    .catch(err => console.error(err));

  const bandwidthConfig = {
    userId: base.bandwidthUserId,
    apiToken: base.bandwidthApiToken,
    apiSecret: base.bandwidthApiSecret
  };


  const org = await dbInterface
    .getOrgBySubscriptionCode(text)
    .catch(err => console.error(err));

  const isSubscribed = await dbInterface
    .isSubscribed(phoneNumber, org.id)
    .catch(err => console.error(err));

  if (isSubscribed) {
    const unsubscribe = await dbInterface
      .unsubscribe(org.id, phoneNumber)
      .catch(err => console.error(err));
    if (!unsubscribe) {
      message = 'Something went wrong, please try again.';
    } else {
      message = `You've been successfully unsubscribed from ${org.orgName}, ${
        base.baseName
      }.\n\nTo resubscribe, reply ${org.subscriptionCode.toUpperCase()}`;
    }
  } else {
    const subscribe = await dbInterface
      .subscribe(org.id, phoneNumber)
      .catch(err => console.error(err));

    if (subscribe.phoneNumber !== phoneNumber) {
      message = 'Something went wrong, please try again.';
    } else {
      message = `You've been successfully subscribed to ${org.orgName}, ${
        base.baseName
      }.\n\nTo unsubscribe, reply ${org.subscriptionCode.toUpperCase()}`;
    }
  }

  message += `\nFor more information, reply HELP`;

  sendMessage(message, phoneNumber, basePhoneNumber, bandwidthConfig);
};

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
      console.log(`Sent:\n`, `\x1b[1m\x1b[32m`, msg.text,`\x1b[0m`); // this may need some tweaking.
    })
    .catch(err => console.error(err));
}