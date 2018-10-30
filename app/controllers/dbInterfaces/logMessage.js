const models = require('../../db/models');

module.exports = async (userId, orgId, message) => {
  const messageLog = await models.Message.create({
    orgId: orgId,
    userId: userId,
    message: message
  }).catch(err => console.error(err));

  return messageLog.dataValues;
};
