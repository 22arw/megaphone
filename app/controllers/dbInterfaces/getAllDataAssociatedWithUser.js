const models = require('../../db/models');

const getAllDataAssociatedWithUser = async userId => {
  // Collect data from User table
  const userData = await models.User.findAll({
    where: {
      id: userId
    }
  }).catch(err => {
    console.error(err);
  });

  // Is the user an admin?
  if (userData[0].isAdmin) {
    // Do something to return all data from all databases
  }

  // Collect data from BaseManager table
  const baseManagerData = await models.BaseManager.findAll({
    where: {
      userId: userId
    }
  }).catch(err => {
    console.error(err);
  });

  // Collect data from Base table that the user manages
  baseIds = baseManagerData.map(base => {
    return Number(base.baseId);
  });

  const baseData = await models.Base.findAll({
    where: {
      id: baseIds
    }
  });

  //

  const result = {
    userData: userData,
    baseManagerData: baseManagerData,
    baseData: baseData
  };

  return result;
};

module.exports = getAllDataAssociatedWithUser;
