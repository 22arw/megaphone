const models = require('../../db/models');

module.exports = async orgIds => {
  const messages = await models.Message.findAll({
    where: {
      orgId: orgIds
    }
  });

  return messages.map(message => {
    return message.dataValues;
  });
};
