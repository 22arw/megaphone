const models = require('../../db/models');

const doesBaseExist = async baseCode => {
  const base = await models.Base.findAll({
    where: {
      baseCode: baseCode
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
