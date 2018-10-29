const models = require('../../db/models');

module.exports = async subscriptionCode => {
  const org = await models.Organization.findAll({
    where: {
      subscriptionCode: subscriptionCode
    }
  }).catch(err => console.error(err));

  return org[0].dataValues;
};