const models = require('../../db/models');

module.exports = async basePhoneNumber => {
  const base = await models.Base.findAll({
    where: {
      basePhoneNumber: basePhoneNumber
    }
  }).catch(err => console.error(err));

  return base[0].dataValues;
};
