module.exports = {
  addOrgManager: require('./addOrgManager'),
  createBaseManager: require('./createBaseManager'),
  createOrg: require('./createOrg'),
  createOrgManager: require('./createOrgManager'),
  createUser: require('./createUser'),
  deleteBaseManager: require('./deleteBaseManager'),
  doesBaseExist: require('./doesBaseExist'),
  doesBaseExistByBaseCode: require('./doesBaseExistByBaseCode'),
  doesOrgExist: require('./doesOrgExist'),
  doesUserExist: require('./doesUserExist'),
  getAdminData: require('./getAdminData'),
  getAllUserData: require('./getAllDataAssociatedWithUser'),
  getBaseByBaseCode: require('./getBaseByBaseCode'),
  getBaseById: require('./getBaseById'),
  getUserByEmail: require('./getUserByEmail'),
  getUserById: require('./getUserById'),
  isAdmin: require('./isAdmin'),
  isBaseCodeUnique: require('./isBaseCodeUnique'),
  isBaseManager: require('./isBaseManager'),
  isBaseNameUnique: require('./isBaseNameUnique'),
  isBasePhoneNumberUnique: require('./isBasePhoneNumberUnique'),
  isOrgManager: require('./isOrgManager'),
  isOrgOwner: require('./isOrgOwner'),
  isSubscribed: require('./isSubscribed'),
  isSubscriptionCodeUnique: require('./isSubscriptionCodeUnique'),
  isUserEmailUnique: require('./isUserEmailUnique'),
  updateOrgOwner: require('./updateOrgOwner')
};
