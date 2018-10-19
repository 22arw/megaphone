const Sequelize = require('sequelize');
const models = require('../../db/models');

const Op = Sequelize.Op;

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
    // Do something to return all data from all tables
    // return await getAllAdminData();
  }

  // Collect data from BaseManager table
  const baseManagerData = await models.BaseManager.findAll({
    where: {
      userId: userId
    }
  }).catch(err => {
    console.error(err);
  });

  // Collect data from OrganizationManager table
  const organizationManagerData = await models.OrganizationManager.findAll({
    where: {
      userId: userId
    }
  }).catch(err => {
    console.error(err);
  });

  // Collect data from Organization table that the user manages
  const organizationManagerIds = organizationManagerData.map(org => {
    return Number(org.orgId);
  });

  const organizationData = await models.Organization.findAll({
    where: {
      id: organizationManagerIds
    }
  }).catch(err => {
    console.error(err);
  });

  // Collect data from what Bases these organizations are a part of AND
  // Collect data from Base table that the user manages or has organizations that they are a part of
  const organizationsBaseIds = organizationData.map(org => {
    return Number(org.baseId);
  });
  const baseIds = baseManagerData.map(base => {
    return Number(base.baseId);
  });

  const baseData = await models.Base.findAll({
    where: {
      id: [...new Set(baseIds.concat(organizationsBaseIds))]
    }
  }).catch(err => {
    console.error(err);
  });

  // TODO:
  // Collect the number of subscribers for each organization the user manages
  // Collect all of the messages for each organization that the user manages. This is really a low priority. They didn't ask for this functionality and it's going to require requerying all the tables again.
  // Format the data so it's much easier to read on the front end.

  const result = {
    userData: userData,
    baseManagerData: baseManagerData,
    baseData: baseData,
    organizationManagerData: organizationManagerData,
    organizationData: organizationData
  };

  return result;
};

module.exports = getAllDataAssociatedWithUser;
