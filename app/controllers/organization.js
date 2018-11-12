const dbInterface = require('./dbInterfaces');
const _ = require('lodash');
const utils = require('../utils');

module.exports = {
  createOrg: async (req, res) => {
    const baseId = _.toNumber(req.body.baseId);
    const newOrgOwnerEmail = _.toString(req.body.newOrgOwnerEmail).trim();
    const orgName = _.toString(req.body.orgName).trim();
    const subscriptionCode = _.toString(req.body.subscriptionCode).trim();

    try {
      if (
        isNaN(baseId) ||
        _.isEmpty(orgName) ||
        _.isEmpty(subscriptionCode) ||
        !utils.isValidEmail(newOrgOwnerEmail)
      ) {
        throw new Error('Invalid data on request');
      }

      const isSubscriptionCodeUnique = await dbInterface.isSubscriptionCodeUnique(
        subscriptionCode
      );
      if (!isSubscriptionCodeUnique) {
        throw new Error('Subscription code is not unique.');
      }

      const doesBaseExist = await dbInterface.doesBaseExist(baseId);
      if (!doesBaseExist) {
        throw new Error('Base does not exist.');
      }

      const doesUserExist = await dbInterface.doesUserExist(newOrgOwnerEmail);
      if (!doesUserExist) {
        const pass = utils.generateRandomPassword();
        await dbInterface.createUser(newOrgOwnerEmail, pass).then(user => {
          utils.sendEmail(
            user.email,
            'Welcome to Megaphone.',
            `You're invited to manage ${orgName} on Megaphone. Please log in using the following temporary password: ${pass}`,
            process.env.CLIENT_URL
          );
        });
      }

      const user = await dbInterface.getUserByEmail(newOrgOwnerEmail);

      const org = await dbInterface.createOrg(
        user.id,
        baseId,
        orgName,
        subscriptionCode
      );

      dbInterface.createOrgManager(user.id, org.id).then(() => {
        res.json({
          token: req.token,
          success: true
        });
      });
    } catch (error) {
      console.error(error);
      res.json({
        token: req.token,
        success: false,
        error: error.message
      });
    }
  },
  createOrgManager: async (req, res) => {
    const orgId = _.toNumber(req.body.orgId);
    const newOrgManagerEmail = _.toString(req.body.newOrgManagerEmail).trim();

    try {
      if (isNaN(orgId) || !utils.isValidEmail(newOrgManagerEmail)) {
        throw new Error('Invalid data on request.');
      }

      const doesOrgExist = await dbInterface.doesOrgExist(orgId);
      if (!doesOrgExist) {
        throw new Error('Org does not exist.');
      }

      const org = await dbInterface.getOrgById(orgId);

      const doesUserExist = await dbInterface.doesUserExist(newOrgManagerEmail);
      if (!doesUserExist) {
        const pass = utils.generateRandomPassword();
        await dbInterface.createUser(newOrgManagerEmail, pass).then(user => {
          utils.sendEmail(
            user.email,
            'Welcome to Megaphone.',
            `You're invited to manage ${
              org.orgName
            } on Megaphone. Please log in using the following temporary password: ${pass}`,
            process.env.CLIENT_URL
          );
        });
      }

      const user = await dbInterface.getUserByEmail(newOrgManagerEmail);

      const isOrgManager = await dbInterface.isOrgManager(user.id, org.id);
      if (isOrgManager) {
        throw new Error(
          'That user is already a manager for this organization.'
        );
      }

      dbInterface.createOrgManager(user.id, org.id).then(() => {
        res.json({
          token: req.token,
          success: true
        });
      });
    } catch (error) {
      console.error(error);
      res.json({
        token: req.token,
        success: false,
        error: error.message
      });
    }
  },
  isSubscriptionCodeUnique: async (req, res) => {
    const subscriptionCode = _.toString(req.body.subscriptionCode).trim();

    try {
      if (_.isEmpty(subscriptionCode)) {
        throw new Error('Invalid data on request.');
      }

      dbInterface.isSubscriptionCodeUnique(subscriptionCode).then(unique => {
        res.json({
          token: req.token,
          success: true,
          subscriptionCode: unique
        });
      });
    } catch (error) {
      console.error(error);
      res.json({
        token: req.token,
        success: false,
        error: error.message
      });
    }
  }
};

// const isSubscriptionCodeUnique = async subscriptionCode => {
// return await dbInterface
//   .isSubscriptionCodeUnique(subscriptionCode)
//   .catch(err => console.error(err));
// };

// const updateOrgOwner = async (userId, orgId, newOrgOwnerEmail) => {
//   const isAdmin = await dbInterface
//     .isAdmin(userId)
//     .catch(err => console.error(err));

//   const isOrgOwner = await dbInterface
//     .isOrgOwner(userId, orgId)
//     .catch(err => console.error(err));

//   if (!(isAdmin || isOrgOwner)) {
//     return 'You cannot transfer ownership of this organization.';
//   }

//   const doesOrgExist = await dbInterface
//     .doesOrgExist(orgId)
//     .catch(err => console.error(err));

//   if (!doesOrgExist) {
//     return 'That organization does not exist.';
//   }

//   const doesUserExist = await dbInterface
//     .doesUserExist(newOrgOwnerEmail)
//     .catch(err => console.error(err));

//   if (!doesUserExist) {
//     return 'That user does not exist.';
//   }

//   const user = await dbInterface
//     .getUserByEmail(newOrgOwnerEmail)
//     .catch(err => console.error(err));

//   const org = await dbInterface
//     .updateOrgOwner(user.id, orgId)
//     .catch(err => console.error(err));

//   const isOrgManager = await dbInterface
//     .isOrgManager(user.id, orgId)
//     .catch(err => console.error(err));

//   if (!isOrgManager) {
//     const orgManager = await dbInterface
//       .createOrgManager(user.id, orgId)
//       .catch(err => console.error(err));
//   }

//   return org === 1 ? true : 'An error occurred updating the org owner.';
// };

// const orgController = {
//   createOrg: createOrg,
//   createOrgManager: createOrgManager,
//   isSubscriptionCodeUnique: isSubscriptionCodeUnique,
//   updateOrgOwner: updateOrgOwner
// };

// module.exports = orgController;
