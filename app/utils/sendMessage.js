const Bandwidth = require('node-bandwidth');
const logMessage = require('../controllers/dbInterfaces/logMessage');

module.exports = async (userId, subscribers, org, message, base) => {
  console.log(`\nSending message to ${org.orgName}...`)
  const bandwidth = new Bandwidth({
    userId: base.bandwidthUserId,
    apiToken: base.bandwidthApiToken,
    apiSecret: base.bandwidthApiSecret
  });

  const text = `${message}\n- ${org.subscriptionCode.toUpperCase()}`;

  const messages = subscribers.map(subscriber => {
    return {
      text: text,
      to: subscriber,
      from: base.basePhoneNumber
    };
  });

  await bandwidth.Message.sendMultiple(messages)
    .then(response => {
      console.log(
        `\nMessage sent: ${response.map(res => {
          return res.message.id;
        })}\n`
      );
    })
    .catch(err => {
      console.error(err);
      return new Error(
        'There was an error sending your message. Please try again.'
      );
    });

  logMessage(userId, org.id, message)
    .catch(err => console.error(err));
  return true;
};
