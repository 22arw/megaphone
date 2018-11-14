const models = require('../../db/models');

module.exports = async (baseId, isActive) => {
  const base = await models.Base.update(
    {
      isActive: isActive
    },
    {
      where: {
        id: baseId
      }
    }
  );

  return base;
};
