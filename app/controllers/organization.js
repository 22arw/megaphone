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
  getOrgs: async (req, res) => {
    const userId = req.userId;

    // add: return everything for admin

    try {
      const isAdmin = await dbInterface.isAdmin(userId);
      if (isAdmin) {
        const allOrgs = await dbInterface.getAllOrgs();
        return res.json({
          token: req.token,
          success: true,
          orgs: allOrgs
        });
      }

      const orgIds = await dbInterface.getOrgsManagedByUserId(userId);

      if (_.isEmpty(orgIds)) {
        return res.json({
          token: req.token,
          success: true,
          orgs: []
        });
      }

      const orgs = await dbInterface.getOrgById(orgIds);

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
  getOrgManagers: async (req, res) => {
    const orgId = _.toNumber(req.body.orgId);

    try {
      if (isNaN(orgId)) {
        throw new Error('Invalid data on request.');
      }

      const doesOrgExist = await dbInterface.doesOrgExist(orgId);
      if (!doesOrgExist) {
        throw new Error('That org does not exist.');
      }

      const orgManagers = await dbInterface.getAllOrgManagersByOrgIds(orgId);
      if (_.isEmpty(orgManagers)) {
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
  },
  updateOrg: async (req, res) => {
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
        return res.json({
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
    const orgId = _.toNumber(req.body.orgId);
    const newOrgOwnerEmail = _.toString(req.body.newOrgOwnerEmail).trim();

    try {
      if (isNaN(orgId) || !utils.isValidEmail(newOrgOwnerEmail)) {
        throw new Error('Invalid data on request');
      }

      const org = await dbInterface.getOrgById(orgId);

      const doesUserExist = await dbInterface.doesUserExist(newOrgOwnerEmail);
      if (!doesUserExist) {
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

      const isOrgOwner = await dbInterface.isOrgOwner(user.id, org.id);
      if (isOrgOwner) {
        throw new Error('This person is already the organization owner.');
      }

      dbInterface.updateOrgOwner(user.id, org.id).then(() => {
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
