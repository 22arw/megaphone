const models = require('../../db/models');

module.exports = async (userId) => {
  const basesManaged = await models.BaseManager.findAll({
    where: {
      userId: userId
    }
  });

  return basesManaged.map(row => {
    return row.dataValues.baseId;
  });
}