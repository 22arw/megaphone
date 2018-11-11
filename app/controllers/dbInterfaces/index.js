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
  getAllBaseManagersUnderBase: require('./getAllBaseManagersUnderBase'),
  getAllUserData: require('./getAllDataAssociatedWithUser'),
  getAllOrgsUnderBase: require('./getAllOrgsUnderBase'),
  getAllSubscriptionsByPhoneNumber: require('./getAllSubscriptionsByPhoneNumber'),
  getBaseByBasePhoneNumber: require('./getBaseByBasePhoneNumber'),
  getBaseById: require('./getBaseById'),
  getBasesByUserId: require('./getBasesByUserId'),
  getOrgById: require('./getOrgById'),
  getOrgBySubscriptionCode: require('./getOrgBySubscriptionCode'),
  getSubscribers: require('./getSubcribers'),
  getUserByEmail: require('./getUserByEmail'),
  getUsersById: require('./getUsersById'),
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
  updateBase: require('./updateBase'),
  updateOrgOwner: require('./updateOrgOwner'),
  updateUser: require('./updateUser')
};
