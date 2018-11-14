const dbInterface = require('./dbInterfaces');
const _ = require('lodash');
const utils = require('../utils');

module.exports = {
  createOrg: async (req, res) => {
    process.stdout.write('Attempting to create an org... ');
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
        console.log(
          'This is a new user, creating an account for them and sending them an email.'
        );
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

      if (!user.isActive) {
        throw new Error(
          'User is not active. Please activate their account before making changes.'
        );
      }

      const org = await dbInterface.createOrg(
        user.id,
        baseId,
        orgName,
        subscriptionCode
      );

      dbInterface.createOrgManager(user.id, org.id).then(() => {
        console.log('Success!');
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
    process.stdout.write('Attempting to create an org manager... ');
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

      const isOrgActive = await dbInterface.isOrgActive(orgId);
      if (!isOrgActive) {
        throw new Error('Org is not active. Please activate org before adding a org manager.');
      }

      const org = await dbInterface.getOrgById(orgId);

      const doesUserExist = await dbInterface.doesUserExist(newOrgManagerEmail);
      if (!doesUserExist) {
        console.log(
          'This is a new user, creating an account for them and sending them an email.'
        );
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

      if (!user.isActive) {
        throw new Error(
          'User is not active. Please activate their account before making changes.'
        );
      }

      const isOrgManager = await dbInterface.isOrgManager(user.id, org.id);
      if (isOrgManager) {
        throw new Error(
          'That user is already a manager for this organization.'
        );
      }

      dbInterface.createOrgManager(user.id, org.id).then(() => {
        console.log('Success!');
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
  deleteOrgManager: async (req, res) => {
    process.stdout.write('Attempting to delete org manager... ');
    const userId = _.toNumber(req.body.userId);
    const orgId = _.toNumber(req.body.orgId);

    try {
      if (isNaN(userId) || isNaN(orgId)) {
        throw new Error('Invalid data on request.');
      }

      const doesOrgExist = await dbInterface.doesOrgExist(orgId);
      if (!doesOrgExist) {
        throw new Error('Org does not exist.');
      }

      const doesUserExist = await dbInterface.doesUserExistById(userId);
      if (!doesUserExist) {
        throw new Error('User does not exist.');
      }

      const isOrgManager = await dbInterface.isOrgManager(userId, orgId);
      if (!isOrgManager) {
        throw new Error('This user is not an org manager for this org.');
      }

      dbInterface.deleteOrgManager(orgId, userId).then(() => {
        console.log('success!');
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
  getOrgs: async (req, res) => {
    process.stdout.write('Attempting to get orgs... ');
    const userId = req.userId;

    try {
      const isAdmin = await dbInterface.isAdmin(userId);
      if (isAdmin) {
        const allOrgs = await dbInterface.getAllOrgs();
        console.log('This user is an admin. Success!');
        return res.json({
          token: req.token,
          success: true,
          orgs: allOrgs
        });
      }

      const orgIds = await dbInterface.getOrgsManagedByUserId(userId);

      if (_.isEmpty(orgIds)) {
        console.log('No orgs exist.');
        return res.json({
          token: req.token,
          success: true,
          orgs: []
        });
      }

      const orgs = await dbInterface.getOrgById(orgIds);

      console.log('Success!');
      res.json({
        token: req.token,
        success: true,
        orgs: orgs
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
  getAllMessagesSentByOrg: async (req, res) => {
    process.stdout.write('Attempting to get all messages sent by org... ');
    const orgId = _.toNumber(req.body.orgId);

    try {
      if (isNaN(orgId)) {
        throw new Error('Invalid data on request.');
      }
      const doesOrgExist = await dbInterface.doesOrgExist(orgId);
      if (!doesOrgExist) {
        throw new Error('That org does not exist.');
      }

      dbInterface.getMessagesByOrgIds(orgId).then(msgs => {
        console.log('Success!');
        res.json({
          token: req.token,
          success: true,
          messages: msgs.map(msg => {
            return {
              userId: msg.userId,
              orgId: msg.orgId,
              message: msg.message,
              sent: msg.createdAt
            };
          })
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
  getNumberOfSubscribers: async (req, res) => {
    process.stdout.write('Attempting to get number of subscribers... ');
    const orgId = _.toNumber(req.body.orgId);

    try {
      if (isNaN(orgId)) {
        throw new Error('Invalid data on request.');
      }

      const doesOrgExist = await dbInterface.doesOrgExist(orgId);
      if (!doesOrgExist) {
        throw new Error('That org does not exist.');
      }

      const isOrgActive = await dbInterface.isOrgActive(orgId);
      if (!isOrgActive) {
        throw new Error('Org is not active, therefor, no subscribers.');
      }

      dbInterface.getSubscribers(orgId).then(subs => {
        console.log('Success!');
        res.json({
          token: req.token,
          success: true,
          numberOfSubscribers: subs.length
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
  getOrgManagers: async (req, res) => {
    process.stdout.write('Attempting to get org managers... ');
    const orgId = _.toNumber(req.body.orgId);

    try {
      if (isNaN(orgId)) {
        throw new Error('Invalid data on request.');
      }

      const doesOrgExist = await dbInterface.doesOrgExist(orgId);
      if (!doesOrgExist) {
        throw new Error('That org does not exist.');
      }

      const isOrgActive = await dbInterface.isOrgActive(orgId);
      if (!isOrgActive) {
        throw new Error('Org is not active, therefor, no org managers.');
      }

      const orgManagers = await dbInterface.getAllOrgManagersByOrgIds(orgId);
      if (_.isEmpty(orgManagers)) {
        console.log('There are none.');
        return res.json({
          token: req.token,
          success: true,
          orgManagers: []
        });
      }

      const userIds = orgManagers.map(row => {
        return row.userId;
      });

      dbInterface.getUsersById(userIds).then(users => {
        console.log('success!');
        res.json({
          token: req.token,
          success: true,
          orgManagers: users.map(user => {
            return {
              userId: user.id,
              email: user.email,
              isActive: user.isActive
            };
          })
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
  isOrgManager: async (req, res) => {
    process.stdout.write('Attempting isOrgManager... ');
    const userId = req.userId;
    const orgId = _.toNumber(req.body.orgId);

    try {
      if (isNaN(orgId)) {
        throw new Error('Invalid data on request.');
      }

      const doesOrgExist = await dbInterface.doesOrgExist(orgId);
      if (!doesOrgExist) {
        throw new Error('Org does not exist.');
      }

      dbInterface.isOrgManager(userId, orgId).then(isOrgManager => {
        console.log(`is org manager: ${isOrgManager}`);
        res.json({
          token: req.token,
          success: true,
          isOrgManager: isOrgManager
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
  isOrgOwner: async (req, res) => {
    process.stdout.write('Attempting isOrgOwner... ');
    const userId = req.userId;
    const orgId = _.toNumber(req.body.orgId);

    try {
      if (isNaN(orgId)) {
        throw new Error('Invalid data on request.');
      }

      const doesOrgExist = await dbInterface.doesOrgExist(orgId);
      if (!doesOrgExist) {
        throw new Error('Org does not exist.');
      }

      dbInterface.isOrgOwner(userId, orgId).then(status => {
        console.log(`is org owner: ${status}`);
        res.json({
          token: req.token,
          success: true,
          isOrgOwner: status
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
    process.stdout.write('Attempting isSubscriptionCodeUnique... ');
    const subscriptionCode = _.toString(req.body.subscriptionCode).trim();

    try {
      if (_.isEmpty(subscriptionCode)) {
        throw new Error('Invalid data on request.');
      }

      dbInterface.isSubscriptionCodeUnique(subscriptionCode).then(unique => {
        console.log(unique);
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
  },
  updateIsActive: async (req, res) => {
    process.stdout.write('Attempting to update isActive for organization... ');
    const isActive = _.toString(req.body.isActive)
      .trim()
      .toLowerCase();
    const orgId = _.toNumber(req.body.orgId);

    try {
      if (!(isActive === 'true' || isActive === 'false') || isNaN(orgId)) {
        throw new Error('Invalid data on request.');
      }

      const doesOrgExist = await dbInterface.doesOrgExist(orgId);
      if (!doesOrgExist) {
        throw new Error('Org does not exist.');
      }

      const org = await dbInterface.getOrgById(orgId);

      if (isActive === 'true') {
        process.stdout.write('activating org... ');
        await dbInterface.updateOrgIsActive(orgId, true); // Activates org.
        console.log('activated.');
      } else if (isActive === 'false') {
        process.stdout.write('deactivating org... ');
        await dbInterface.deleteOrgManagersByOrgId(orgId); // Removes all org managers
        await dbInterface.updateOrgOwner(null, orgId); // Removes org owner
        await dbInterface.updateOrg(orgId, org[0].orgName, null); // Releases subscription code.
        await dbInterface.updateOrgIsActive(orgId, false); // Deactivates org.
        await dbInterface.deleteSubscribersForOrgId(orgId); // Removes all subscriptions to org.
        console.log('deactivated.');
      }

      res.json({
        token: req.token,
        success: true
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
  updateOrg: async (req, res) => {
    process.stdout.write('Attempting to update org... ');
    const orgId = _.toNumber(req.body.orgId);
    const orgName = _.toString(req.body.orgName).trim();
    const subscriptionCode = _.toString(req.body.subscriptionCode).trim();

    try {
      if (_.isEmpty(orgName) || _.isEmpty(subscriptionCode) || isNaN(orgId)) {
        throw new Error('Invalid data on request.');
      }

      const doesOrgExist = await dbInterface.doesOrgExist(orgId);
      if (!doesOrgExist) {
        throw new Error('That org does not exist.');
      }

      const isOrgActive = await dbInterface.isOrgActive(orgId);
      if (!isOrgActive) {
        throw new Error('Org is not active, please activate before updating.');
      }

      const org = await dbInterface.getOrgById(orgId);

      if (org[0].subscriptionCode !== subscriptionCode) {
        const isSubscriptionCodeUnique = await dbInterface.isSubscriptionCodeUnique(
          subscriptionCode
        );
        if (!isSubscriptionCodeUnique) {
          throw new Error(
            'That subscription code is not unique. Please try another.'
          );
        }
      } else if (org[0].orgName === orgName) {
        throw new Error('Please change the data before sending.');
      }

      dbInterface.updateOrg(org[0].id, orgName, subscriptionCode).then(() => {
        console.log('success!');
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
  updateOrgOwner: async (req, res) => {
    process.stdout.write('Attempting to transfer org owner... ');
    const orgId = _.toNumber(req.body.orgId);
    const newOrgOwnerEmail = _.toString(req.body.newOrgOwnerEmail).trim();

    try {
      if (isNaN(orgId) || !utils.isValidEmail(newOrgOwnerEmail)) {
        throw new Error('Invalid data on request');
      }

      const doesOrgExist = await dbInterface.doesOrgExist(orgId);
      if (!doesOrgExist) {
        throw new Error('That org does not exist.');
      }

      const isOrgActive = await dbInterface.isOrgActive(orgId);
      if (!isOrgActive) {
        throw new Error('Org is not active, please activate before updating.');
      }

      const org = await dbInterface.getOrgById(orgId);

      const doesUserExist = await dbInterface.doesUserExist(newOrgOwnerEmail);
      if (!doesUserExist) {
        console.log(
          'That is a new user, creating an account and emailing them their credentials...'
        );
        const pass = utils.generateRandomPassword();
        await dbInterface.createUser(newOrgOwnerEmail, pass).then(user => {
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

      const user = await dbInterface.getUserByEmail(newOrgOwnerEmail);

      const isUserActive = await dbInterface.isUserActive(user.id);
      if (!isUserActive) {
        throw new Error('User is not active, please activate before making org owner. See admin.');
      }

      const isOrgOwner = await dbInterface.isOrgOwner(user.id, org.id);
      if (isOrgOwner) {
        throw new Error('This person is already the organization owner.');
      }

      dbInterface.updateOrgOwner(user.id, org.id).then(() => {
        console.log('success!');
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
  }
};
