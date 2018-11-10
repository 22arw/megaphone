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
    dbInterface
      .getAllBases()
      .then(bases => {
        if (bases.length === 0) {
          return res.json({
            token: req.token,
            success: false,
            error: 'There are no bases.'
          });
        } else {
          return res.json({
            token: req.token,
            success: true,
            bases: bases
          });
        }
      })
      .catch(err => console.error(err));
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

      dbInterface.getAllBaseManagersUnderBase(baseId).then(baseManagers => {
        res.json({
          token: req.token,
          success: true,
          baseManagers: baseManagers
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
