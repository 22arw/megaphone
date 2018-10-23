const models = require('../../db/models');

const subscriptionCodeIsUnique = async subscriptionCode => {
  const subCode = await models.Organization.findAll({
    where: {
      subscriptionCode: subscriptionCode
    }
  });
  return !Array.isArray(subCode) || !subCode.length;
};

module.exports = subscriptionCodeIsUnique;
