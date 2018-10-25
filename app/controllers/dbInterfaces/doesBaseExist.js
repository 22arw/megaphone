const models = require('../../db/models');

const doesBaseExist = async baseId => {
  if (isNaN(baseId)) {
    return false;
  }

  const base = await models.Base.findAll({
    where: {
      id: baseId
    }
  }).catch(err => console.error(err));

  // console.log(` - - - - - -
  // doesBaseExist
  // base: ${JSON.stringify(base)}
  // return: ${Array.isArray(base) && base.length === 1}
  // - - - - - -`);

  return Array.isArray(base) && base.length === 1;
};

module.exports = doesBaseExist;
