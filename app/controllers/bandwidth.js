const dbInterface = require('./dbInterfaces');

const keyword = async (phoneNumber, text, basePhoneNumber) => {
  let message = '';

  const base = await dbInterface
    .getBaseByBasePhoneNumber(basePhoneNumber)
    .catch(err => console.error(err));

  console.log(`After getting the Base info: ${JSON.stringify(base)}`);

  const bandwidthConfig = {
    userId: base.bandwidthUserId,
    apiToken: base.bandwidthApiToken,
    apiSecret: base.bandwidthApiSecret
  };

  // handle keywords
  switch (text) {
    case 'help':
    case 'who':
    default:
      break;
  }
};

const subscriptionHandler = async (phoneNumber, text, basePhoneNumber) => {
  let message = '';

  const base = await dbInterface
    .getBaseByBasePhoneNumber(basePhoneNumber)
    .catch(err => console.error(err));

  const bandwidthConfig = {
    userId: base.bandwidthUserId,
    apiToken: base.bandwidthApiToke,
    apiSecret: base.bandwidthApiSecret
  };

  const doesOrgExist = await dbInterface
    .doesOrgExistBySubscriptionCode(text)
    .catch(err => console.error(err));

  if (!doesOrgExist) {
    return {
      message: 'That organization code was incorrect.',
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
      message: 'That organization code was incorrect.',
      bandwidthConfig: bandwidthConfig
    };
  }

  const isSubscribed = await dbInterface
    .isSubscribed(phoneNumber, text)
    .catch(err => console.error(err));

  if (!isSubscribed) {
    const unsubscribe = await dbInterface
      .unsubscribe(org.id, phoneNumber)
      .catch(err => console.error(err));
    if (!unsubscribe) {
      message = 'Something went wrong, please try again.';
    } else {
      message = `You've been successfully unsubscribed from ${text}, ${
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
      message = `You've been successfully subscribed to ${text}, ${
        base.baseName
      }`;
    }
  }

  return { message: message, bandwidthConfig: bandwidthConfig };
};

module.exports = {
  keyword: keyword,
  subscriptionHandler: subscriptionHandler
};
