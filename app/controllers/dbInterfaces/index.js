module.exports = {
  createBase: require('./createBase'),
  createBaseManager: require('./createBaseManager'),
  createOrg: require('./createOrg'),
  createOrgManager: require('./createOrgManager'),
  createUser: require('./createUser'),
  deleteBaseManager: require('./deleteBaseManager'),
  doesBaseExist: require('./doesBaseExist'),
  doesOrgBelongToBase: require('./doesOrgBelongToBase'),
  doesOrgExist: require('./doesOrgExist'),
  doesOrgExistBySubscriptionCode: require('./doesOrgExistBySubscriptionCode'),
  doesUserExist: require('./doesUserExist'),
  doesUserExistById: require('./doesUserExistById'),
  getAdminData: require('./getAdminData'),
  getAllBases: require('./getAllBases'),
  getAllUserData: require('./getAllDataAssociatedWithUser'),
  getAllOrgsUnderBase: require('./getAllOrgsUnderBase'),
  getAllSubscriptionsByPhoneNumber: require('./getAllSubscriptionsByPhoneNumber'),
  getBaseByBasePhoneNumber: require('./getBaseByBasePhoneNumber'),
  getBaseById: require('./getBaseById'),
  getOrgById: require('./getOrgById'),
  getOrgBySubscriptionCode: require('./getOrgBySubscriptionCode'),
  getSubscribers: require('./getSubcribers'),
  getUserByEmail: require('./getUserByEmail'),
  getUserById: require('./getUserById'),
  isAdmin: require('./isAdmin'),
  isBaseManager: require('./isBaseManager'),
  isBaseNameUnique: require('./isBaseNameUnique'),
  isBasePhoneNumberUnique: require('./isBasePhoneNumberUnique'),
  isOrgManager: require('./isOrgManager'),
  isOrgOwner: require('./isOrgOwner'),
  isSubscribed: require('./isSubscribed'),
  isSubscriptionCodeUnique: require('./isSubscriptionCodeUnique'),
  isUserEmailUnique: require('./isUserEmailUnique'),
  logMessage: require('./logMessage'),
  subscribe: require('./subscribe'),
  unsubscribe: require('./unsubscribe'),
  updateOrgOwner: require('./updateOrgOwner'),
  updateUser: require('./updateUser')
};
