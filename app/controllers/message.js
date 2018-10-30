const Bandwidth = require('node-bandwidth');
const dbInterface = require('./dbInterfaces');

const sendMessage = async (userId, orgId, message) => {
  /**
   * isAdmin
   * isOrgManager
   * doesOrgExist
   * getOrg
   * getSubscribers
   * getBase
   * sendMessage
   * return error or message if message sent okay.
   */

  const doesOrgExist = await dbInterface
    .doesOrgExist(orgId)
    .catch(err => console.error(err));

  if (!doesOrgExist) return new Error('You cannot send from this org.');

  const isAdmin = await dbInterface
    .isAdmin(userId)
    .catch(err => console.error(err));

  const isOrgManager = await dbInterface
    .isOrgManager(userId, orgId)
    .catch(err => console.error(err));

  if (!(isAdmin || isOrgManager)) {
    return new Error('You cannot send from this org.');
  }

  const org = await dbInterface
    .getOrgById(orgId)
    .catch(err => console.error(err));

  const subscribers = await dbInterface
    .getSubscribers(orgId)
    .catch(err => console.error(err));

  if (subscribers.length === 0) {
    return new Error('There are no subscribers to this organization');
  }

  const base = await dbInterface
    .getBaseById(org.baseId)
    .catch(err => console.error(err));

  const bandwidth = new Bandwidth({
    userId: base.bandwidthUserId,
    apiToken: base.bandwidthApiToken,
    apiSecret: base.bandwidthApiSecret
  });

  const messages = subscribers.map(subscriber => {
    return {
      text: message,
      to: subscriber,
      from: base.basePhoneNumber
    };
  });

  bandwidth.Message.sendMultiple(messages).then(response => {
    console.log(`Message sending result: ${response}`);
  });

  return true;
};

module.exports = {
  sendMessage: sendMessage
};
