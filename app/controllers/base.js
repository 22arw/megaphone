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
  }
};
