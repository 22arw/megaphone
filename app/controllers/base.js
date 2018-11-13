const _ = require('lodash');
const dbInterface = require('./dbInterfaces');
const utils = require('../utils');

module.exports = {
  createBase: async (req, res) => {
    process.stdout.write('Attempting to create a base... ');
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

      dbInterface
        .createBase(
          basePhoneNumber,
          baseName,
          bandwidthUserId,
          bandwidthApiToken,
          bandwidthApiSecret
        )
        .then(() => {
          console.log('Success!');
          res.json({
            token: req.token,
            success: true
          });
        })
        .catch(err => {
          console.error(err);
          throw new Error('Error creating base.');
        });
    } catch (error) {
      console.error(error);
      return res.json({
        token: req.token,
        success: false,
        error: error.message
      });
    }
  },
  createBaseManager: async (req, res) => {
    process.stdout.write('Attempting to create a base manager... ');
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
          console.log(
            'This is a new user. Sending them an email with login credentials.'
          );
          utils.sendEmail(
            user.email,
            'Welcome to Megaphone!',
            `You've just been made a base manager for ${
              base.baseName
            }. Please sign in using the link below. Your temporary password is: ${password}`,
            process.env.CLIENT_URL
          );
        }

        console.log('Success!');
        res.json({
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
    process.stdout.write('Attempting to delete a base manager... ');
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

      dbInterface.deleteBaseManager(userId, baseId).then(() => {
        console.log('Success!');
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
    process.stdout.write('Attempting to get all bases... ');
    const userId = req.userId;

    try {
      const isAdmin = await dbInterface.isAdmin(userId);
      if (isAdmin) {
        const bases = await dbInterface.getAllBases();
        console.log('Got all bases for admin.');
        return res.json({
          token: req.token,
          success: true,
          bases: bases
        });
      }

      const bases = await dbInterface.getBasesByUserId(userId);
      console.log('success!');
      res.json({
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
    process.stdout.write('Attempting to get all base managers under base... ');
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
        console.log('Success!');
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
    process.stdout.write('Attempting to get all messages sent by base... ');
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
        console.log('There are no messages.');
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

      console.log('Success!');
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
    process.stdout.write('Attempting to get all orgs under base... ');
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
        console.log('Success!');
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
    process.stdout.write('Attempting to get all users under base... ');
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
        console.log('No users exist.');
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
        console.log('Success!');
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
  isBaseManager: async (req, res) => {
    process.stdout.write('Attempting isBaseManager... ');
    const userId = req.userId;
    const baseId = _.toNumber(req.body.baseId);

    try {
      if (isNaN(baseId)) {
        throw new Error('Invalid data on request.');
      }

      const doesBaseExist = await dbInterface.doesBaseExist(baseId);
      if (!doesBaseExist) {
        throw new Error('Base does not exist.');
      }

      dbInterface.isBaseManager(userId, baseId).then(isBaseManager => {
        console.log(`is user a base manager: ${isBaseManager}`);
        res.json({
          token: req.token,
          success: true,
          isBaseManager: isBaseManager
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
    process.stdout.write('Attempting isBasePhoneNumberUnique... ');
    const basePhoneNumber = _.toString(req.body.basePhoneNumber).trim();

    try {
      if (!utils.isValidPhoneNumber(basePhoneNumber)) {
        throw new Error(
          `${basePhoneNumber} is not a valid phone number. Format: "+11231231234"`
        );
      }
      dbInterface.isBasePhoneNumberUnique(basePhoneNumber).then(isUnique => {
        console.log(`is base phone number unique: ${isUnique}`);
        res.json({
          token: req.token,
          success: true,
          isBasePhoneNumberUnique: isUnique
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
  updateBase: async (req, res) => {
    process.stdout.write('Attempting to update base... ');
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
          console.log('Success!');
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
