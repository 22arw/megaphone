const models = require('../../db/models');

const isBasePhoneNumberUnique = async basePhoneNumber => {
  const base = await models.Base.findAll({
    where: {
      basePhoneNumber: basePhoneNumber
    }
  }).catch(err => console.error(err));

  return !Array.isArray(base) || !base.length;
};

module.exports = isBasePhoneNumberUnique;
