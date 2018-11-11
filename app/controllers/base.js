const _ = require('lodash');
const dbInterface = require('./dbInterfaces');
const utils = require('../utils');

module.exports = {
  createBase: async (req, res) => {
    const basePhoneNumber = _.toString(req.body.basePhoneNumber).trim();
    const baseName = _.toString(req.body.baseName).trim();
    const bandwidthUserId = _.toString(req.body.bandwidthUserId).trim();
    const bandwidthApiToken = _.toString(req.body.bandwidthApiToken).trim();
    const bandwidthApiSecret = _.toString(req.body.bandwidthApiSecret).trim();

    try {
      if (
        _.isEmpty(basePhoneNumber) ||
        _.isEmpty(baseName) ||
        _.isEmpty(bandwidthUserId) ||
        _.isEmpty(bandwidthApiToken) ||
        _.isEmpty(bandwidthApiSecret)
      ) {
        throw new Error('Missing data on request.');
      }

      if (!utils.isValidPhoneNumber(basePhoneNumber)) {
        throw new Error(
          `${basePhoneNumber} is not a valid phone number. Please make sure it is in the format: "+12345678909"`
        );
      }

      const isBasePhoneNumberUnique = await dbInterface
        .isBasePhoneNumberUnique(basePhoneNumber)
        .catch(err => console.error(err));

      if (!isBasePhoneNumberUnique)
        throw new Error('Phone number is not unique.');

      const base = await dbInterface
        .createBase(
          basePhoneNumber,
          baseName,
          bandwidthUserId,
          bandwidthApiToken,
          bandwidthApiSecret
        )
        .catch(err => {
          console.error(err);
          throw new Error('Error creating base.');
        });

      return res.json({
        token: req.token,
        success: true
      });
    } catch (error) {
      return res.json({
        token: req.token,
        success: false,
        error: error.message
      });
    }
  },
  createBaseManager: async (req, res) => {
    const baseId = _.toString(req.body.baseId).trim();
    const newBaseManagerEmail = _.toString(req.body.newBaseManagerEmail).trim();

    try {
      if (_.isEmpty(baseId) || _.isEmpty(newBaseManagerEmail)) {
        throw new Error('Missing data on request.');
      }
      if (!utils.isValidEmail(newBaseManagerEmail)) {
        throw new Error('Email is not valid');
      }

      const doesBaseExist = await dbInterface.doesBaseExist(baseId);

      if (!doesBaseExist) throw new Error('Base does not exist.');

      const base = await dbInterface.getBaseById(baseId);

      const doesUserExist = await dbInterface.doesUserExist(
        newBaseManagerEmail
      );

      const password = utils.generateRandomPassword();
      let user;

      if (doesUserExist) {
        user = await dbInterface.getUserByEmail(newBaseManagerEmail);
      } else {
        user = await dbInterface.createUser(newBaseManagerEmail, password);
      }

      const isBaseManager = await dbInterface.isBaseManager(user.id, baseId);

      if (isBaseManager) {
        throw new Error(
          `${user.email} is already a base manager for ${base.baseName}`
        );
      }

      dbInterface.createBaseManager(user.id, baseId).then(() => {
        if (!doesUserExist) {
          utils.sendEmail(
            user.email,
            'Welcome to Megaphone!',
            `You've just been made a base manager for ${
              base.baseName
            }. Please sign in using the link below. Your temporary password is: ${password}`,
            process.env.CLIENT_URL
          );
        }

        return res.json({
          token: req.token,
          success: true
        });
      });
    } catch (error) {
      return res.json({
        token: req.token,
        success: false,
        error: error.message
      });
    }
  },
  deleteBaseManager: async (req, res) => {
    const baseId = _.toNumber(req.body.baseId);
    const userId = _.toNumber(req.body.userId);

    try {
      if (isNaN(baseId) || isNaN(userId)) {
        throw new Error('Invalid data on request.');
      }

      const doesBaseExist = await dbInterface.doesBaseExist(baseId);
      if (!doesBaseExist) {
        throw new Error('Base does not exist.');
      }

      const doesUserExist = await dbInterface.doesUserExistById(userId);
      if (!doesUserExist) {
        throw new Error('User does not exist.');
      }

      const isBaseManager = await dbInterface.isBaseManager(userId, baseId);
      if (!isBaseManager) {
        throw new Error('User is not a base manager.');
      }

      await dbInterface.deleteBaseManager(userId, baseId).then(() => {
        res.json({
          token: req.token,
          success: true
        });
      });
    } catch (error) {
      res.json({
        token: req.token,
        success: false,
        error: error.message
      });
    }
  },
  getAllBases: async (req, res) => {
    const userId = req.userId;

    try {
      const isAdmin = await dbInterface.isAdmin(userId);
      if (isAdmin) {
        const bases = await dbInterface.getAllBases();
        return res.json({
          token: req.token,
          success: true,
          bases: bases
        });
      }

      const bases = await dbInterface.getBasesByUserId(userId);
      return res.json({
        token: req.token,
        success: true,
        bases: bases
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
  getAllBaseManagersUnderBase: async (req, res) => {
    const baseId = _.toNumber(req.body.baseId);

    try {
      if (isNaN(baseId)) {
        throw new Error('Invalid data on request.');
      }

      const doesBaseExist = await dbInterface.doesBaseExist(baseId);
      if (!doesBaseExist) {
        throw new Error('Base does not exist.');
      }

      const baseManagers = await dbInterface.getAllBaseManagersUnderBase(
        baseId
      );

      if (baseManagers.length === 0) {
        console.log('No base managers found.');
        res.json({
          token: req.token,
          success: true,
          baseManagers: []
        });
      }

      const baseManagerIds = baseManagers.map(baseManager => {
        return baseManager.userId;
      });

      dbInterface.getUsersById(baseManagerIds).then(baseManagers => {
        const users = baseManagers.map(baseManager => {
          return {
            userId: baseManager.id,
            email: baseManager.email,
            isAdmin: baseManager.isAdmin
          };
        });
        res.json({
          token: req.token,
          success: true,
          baseManagers: users
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
  getAllMessagesSentByBase: async (req, res) => {
    const baseId = _.toNumber(req.body.baseId);

    try {
      if (isNaN(baseId)) {
        throw new Error('Invalid data on request.');
      }

      const doesBaseExist = await dbInterface.doesBaseExist(baseId);
      if (!doesBaseExist) {
        throw new Error('Base does not exist.');
      }

      const orgs = await dbInterface.getAllOrgsUnderBase(baseId);
      if (_.isEmpty(orgs)) {
        throw new Error(
          'There were no orgs found under this base, therefor no messages.'
        );
      }

      const orgIds = orgs.map(org => {
        return org.id;
      });

      const messages = await dbInterface.getMessagesByOrgIds(orgIds);

      if (_.isEmpty(messages)) {
        // send an empty array signifying no messages exist yet.
        return res.json({
          token: req.token,
          success: true,
          messages: []
        });
      }

      const filteredMessages = messages.map(message => {
        return {
          userId: message.userId,
          orgId: message.orgId,
          message: message.message,
          sent: message.createdAt
        };
      });

      res.json({
        token: req.token,
        success: true,
        messages: filteredMessages
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
  getAllOrgsUnderBase: async (req, res) => {
    const baseId = _.toNumber(req.body.baseId);

    try {
      if (isNaN(baseId)) {
        throw new Error('Invalid data on request.');
      }

      const doesBaseExist = await dbInterface.doesBaseExist(baseId);
      if (!doesBaseExist) {
        throw new Error('Base does not exist.');
      }

      dbInterface.getAllOrgsUnderBase(baseId).then(orgs => {
        res.json({
          token: req.token,
          success: true,
          orgs: orgs
        });
      });
    } catch (error) {
      res.json({
        token: req.token,
        success: false,
        error: error.message
      });
    }
  },
  getAllUsersUnderBase: async (req, res) => {
    const baseId = _.toNumber(req.body.baseId);
    try {
      if (isNaN(baseId)) {
        throw new Error('Invalid data on request.');
      }

      const doesBaseExist = await dbInterface.doesBaseExist(baseId);
      if (!doesBaseExist) {
        throw new Error('Base does not exist.');
      }

      const baseManagers = await dbInterface.getAllBaseManagersUnderBase(
        baseId
      );

      let baseManagerIds;
      if (baseManagers.length === 0) {
        baseManagerIds = [];
      } else {
        baseManagerIds = baseManagers.map(baseManager => {
          return baseManager.userId;
        });
      }

      // get all orgs under base
      const orgs = await dbInterface.getAllOrgsUnderBase(baseId);

      let orgManagerIds;
      if (orgs.length === 0) {
        orgManagerIds = [];
      } else {
        const orgIds = orgs.map(org => {
          return org.id;
        });
        const orgManagers = await dbInterface.getAllOrgManagersByOrgIds(orgIds);
        orgManagerIds = orgManagers.map(orgManager => {
          return orgManager.userId;
        });
      }

      const userIds = _.uniq(_.concat(baseManagerIds, orgManagerIds));

      if (userIds.length === 0) {
        return res.json({
          token: req.token,
          success: true,
          users: []
        });
      }

      dbInterface.getUsersById(userIds).then(users => {
        const usersFiltered = users.map(user => {
          return {
            userId: user.id,
            email: user.email,
            isAdmin: user.isAdmin
          };
        });
        res.json({
          token: req.token,
          success: true,
          users: usersFiltered
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
  isBasePhoneNumberUnique: async (req, res) => {
    const basePhoneNumber = _.toString(req.body.basePhoneNumber).trim();

    try {
      if (!utils.isValidPhoneNumber(basePhoneNumber)) {
        throw new Error(
          `${basePhoneNumber} is not a valid phone number. Format: "+11231231234"`
        );
      }
      dbInterface.isBasePhoneNumberUnique(basePhoneNumber).then(isUnique => {
        res.json({
          token: req.token,
          success: true,
          isBasePhoneNumberUnique: isUnique
        });
      });
    } catch (error) {
      res.json({
        token: req.token,
        success: false,
        error: error.message
      });
    }
  },
  updateBase: async (req, res) => {
    const baseId = _.toNumber(req.body.baseId);
    const basePhoneNumber = _.toString(req.body.basePhoneNumber).trim();
    const baseName = _.toString(req.body.baseName).trim();
    const bandwidthUserId = _.toString(req.body.bandwidthUserId).trim();
    const bandwidthApiToken = _.toString(req.body.bandwidthApiToken).trim();
    const bandwidthApiSecret = _.toString(req.body.bandwidthApiSecret).trim();

    try {
      if (
        isNaN(baseId) ||
        _.isEmpty(baseName) ||
        _.isEmpty(basePhoneNumber) ||
        _.isEmpty(bandwidthUserId) ||
        _.isEmpty(bandwidthApiToken) ||
        _.isEmpty(bandwidthApiSecret)
      ) {
        throw new Error('Missing data on request.');
      }
      if (!utils.isValidPhoneNumber(basePhoneNumber)) {
        throw new Error(
          `${basePhoneNumber} is not a valid phone number. Format: "+11231231234"`
        );
      }

      const doesBaseExist = await dbInterface.doesBaseExist(baseId);
      if (!doesBaseExist) {
        throw new Error('Base does not exist.');
      }

      const base = await dbInterface.getBaseById(baseId);

      if (
        base.baseName === baseName &&
        base.basePhoneNumber === basePhoneNumber &&
        base.bandwidthUserId === bandwidthUserId &&
        base.bandwidthApiToken === bandwidthApiToken &&
        base.bandwidthApiSecret === bandwidthApiSecret
      ) {
        throw new Error(
          'No values changed. Please change a value before submitting.'
        );
      }

      if (base.basePhoneNumber !== basePhoneNumber) {
        const isBasePhoneNumberUnique = await dbInterface.isBasePhoneNumberUnique(
          basePhoneNumber
        );
        if (!isBasePhoneNumberUnique) {
          throw new Error('Phone number is not unique.');
        }
      }

      // update base
      dbInterface
        .updateBase(
          baseId,
          basePhoneNumber,
          baseName,
          bandwidthUserId,
          bandwidthApiToken,
          bandwidthApiSecret
        )
        .then(recordsUpdated => {
          if (recordsUpdated !== 1) {
            throw new Error('Failed to update base.');
          }
          res.send({
            token: req.token,
            success: true
          });
        });
    } catch (error) {
      res.json({
        token: req.token,
        success: false,
        error: error.message
      });
    }
  }
};
