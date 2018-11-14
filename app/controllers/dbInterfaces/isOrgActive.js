const models = require('../../db/models');
const _ = require('lodash');

module.exports = async orgId => {
  const org = await models.Organization.findAll({
    where: {
      id: orgId,
      isActive: true
    }
  }).catch(err => console.error(err));

  return !_.isEmpty(org);
};
