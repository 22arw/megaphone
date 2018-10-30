const dbInterface = require('./dbInterfaces');

const help = `The following commands are available on this service:
  HELP - Returns this message.
  WHO - Returns a message with all of your subscriptions.
  
To subscribe to or unsubscribe from an organization, just reply with the subscription code you used to subscribe.
  
To block all messages from this number, reply STOP.`;

const keyword = async (phoneNumber, text, basePhoneNumber) => {
  let message = '';

  const base = await dbInterface
    .getBaseByBasePhoneNumber(basePhoneNumber)
    .catch(err => console.error(err));

  const bandwidthConfig = {
    userId: base.bandwidthUserId,
    apiToken: base.bandwidthApiToken,
    apiSecret: base.bandwidthApiSecret
  };

  // handle keywords
  switch (text) {
    case 'help':
      message = help;
      break;
    case 'who':
      const allOrgsUnderBase = await dbInterface
        .getAllOrgsUnderBase(base.id)
        .catch(err => console.error(err));
      if (allOrgsUnderBase.length === 0) {
        message = 'You have no subscriptions.';
        break;
      }
      const allSubscriptionsByPhoneNumber = await dbInterface
        .getAllSubscriptionsByPhoneNumber(phoneNumber)
        .catch(err => console.error(err));
      if (allSubscriptionsByPhoneNumber.length === 0) {
        message = 'You have no subscriptions.';
        break;
      }
      message = 'You are subscribed to the following organizations:\n';
      allSubscriptionsByPhoneNumber.map(sub => {
        for (let org = 0; org < allOrgsUnderBase.length; org++) {
          if (sub.orgId === allOrgsUnderBase[org].id) {
            message += `\n${allOrgsUnderBase[
              org
            ].subscriptionCode.toUpperCase()}: ${
              allOrgsUnderBase[org].orgName
            }`;
          }
        }
      });
      break;
    default:
      break;
  }

  return { message: message, bandwidthConfig: bandwidthConfig };
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

  const doesOrgExist = await dbInterface
    .doesOrgExistBySubscriptionCode(text)
    .catch(err => console.error(err));

  if (!doesOrgExist) {
    return {
      message: 'That is an invalid command. Reply HELP for more info.',
      bandwidthConfig: bandwidthConfig
    };
  }

  const org = await dbInterface
    .getOrgBySubscriptionCode(text)
    .catch(err => console.error(err));

  const doesOrgBelongToBase = await dbInterface
    .doesOrgBelongToBase(org.id, base.id)
    .catch(err => console.error(err));

  if (!doesOrgBelongToBase) {
    return {
      message: 'That is an invalid command. Reply HELP for more info.',
      bandwidthConfig: bandwidthConfig
    };
  }

  const isSubscribed = await dbInterface
    .isSubscribed(phoneNumber, org.id)
    .catch(err => console.error(err));

  console.log(`isSubscribed: ${isSubscribed}`);

  if (isSubscribed) {
    const unsubscribe = await dbInterface
      .unsubscribe(org.id, phoneNumber)
      .catch(err => console.error(err));
    if (!unsubscribe) {
      message = 'Something went wrong, please try again.';
    } else {
      message = `You've been successfully unsubscribed from ${text.toUpperCase()}, ${
        base.baseName
      }`;
    }
  } else {
    const subscribe = await dbInterface
      .subscribe(org.id, phoneNumber)
      .catch(err => console.error(err));

    if (subscribe.phoneNumber !== phoneNumber) {
      message = 'Something went wrong, please try again.';
    } else {
      message = `You've been successfully subscribed to ${text.toUpperCase()}, ${
        base.baseName
      }`;
    }
  }

  message += `\n\n${help}`;

  return { message: message, bandwidthConfig: bandwidthConfig };
};

module.exports = {
  keyword: keyword,
  subscriptionHandler: subscriptionHandler
};
