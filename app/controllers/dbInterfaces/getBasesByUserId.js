const models = require('../../db/models');
const _ = require('lodash');

module.exports = async userId => {
  // find baseIds of orgs managed
  const orgBaseIds = await getBaseIdsOfOrgsManaged(userId);

  // find baseIds of bases managed
  const managerBaseIds = await getBaseIdsOfBasesManaged(userId);

  // make the join
  const baseIds = _.uniq(_.concat(orgBaseIds, managerBaseIds));

  if (_.isEmpty(baseIds)) return [];

  // get all of the bases
  const bases = await models.Base.findAll({
    where: {
      id: baseIds
    }
  }).catch(err => console.error(err));

  // only show the appropriate level of information
  return bases.map(base => {
    // if they aren't a base manager
    if (_.indexOf(managerBaseIds, base.dataValues.id) === -1) {
      return {
        id: base.dataValues.id,
        baseName: base.dataValues.baseName,
        basePhoneNumber: base.dataValues.basePhoneNumber
      };
    } else {
      // otherwise, display all of the information
      return base.dataValues;
    }
  });
};

async function getBaseIdsOfOrgsManaged(userId) {
  const orgsManaged = await models.OrganizationManager.findAll({
    where: {
      userId: userId
    }
  }).catch(err => console.error(err));

  if (_.isEmpty(orgsManaged)) {
    return [];
  }

  const orgIds = orgsManaged.map(row => {
    return row.dataValues.orgId;
  });

  const orgs = await models.Organization.findAll({
    where: {
      id: orgIds
    }
  }).catch(err => console.error(err));

  return orgs.map(org => {
    return org.dataValues.baseId;
  });
}

async function getBaseIdsOfBasesManaged(userId) {
  const basesManaged = await models.BaseManager.findAll({
    where: {
      userId: userId
    }
  }).catch(err => console.error(err));

  if (_.isEmpty(basesManaged)) return [];

  return basesManaged.map(row => {
    return row.dataValues.baseId;
  });
}
