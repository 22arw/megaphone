const models = require('../../db/models');
const _ = require('lodash');

module.exports = async baseId => {
  const base = await models.Base.findAll({
    where: {
      id: baseId,
      isActive: true
    }
  }).catch(err => console.error(err));

  return !_.isEmpty(base);
};
