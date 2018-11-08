const express = require('express');
const router = express.Router();
const adminController = require('../../controllers/admin');
const baseController = require('../../controllers/base');

router.post('/', async (req, res) => {
  let adminData = await adminController
    .getAdminData()
    .catch(err => console.error(err));
  adminData.token = req.token;
  res.json(adminData);
});

// ADMIN ONLY
router.post('/createBase', async (req, res) => {
  const basePhoneNumber = req.body.basePhoneNumber;
  const baseName = req.body.baseName;
  const baseCode = req.body.baseCode;
  const bandwidthUserId = req.body.bandwidthUserId;
  const bandwidthApiToken = req.body.bandwidthApiToken;
  const bandwidthApiSecret = req.body.bandwidthApiSecret;

  try {
    if (
      !(
        basePhoneNumber &&
        basePhoneNumber !== '' &&
        baseName &&
        baseName !== '' &&
        baseCode &&
        baseCode !== '' &&
        bandwidthUserId &&
        bandwidthUserId !== '' &&
        bandwidthApiToken &&
        bandwidthApiToken !== '' &&
        bandwidthApiSecret &&
        bandwidthApiSecret !== ''
      )
    ) {
      throw new Error('Missing information on request.');
    }

    const base = await baseController
      .createBase(
        basePhoneNumber,
        baseName,
        baseCode,
        bandwidthUserId,
        bandwidthApiToken,
        bandwidthApiSecret
      )
      .catch(err => console.error(err));

    if (base instanceof Error) throw base;

    res.json({ token: req.token, success: true });
  } catch (error) {
    res.json({ token: req.token, success: false, error: error.message });
  }
});

router.post('/createBaseManager', async (req, res) => {
  const newBaseManagerEmail = req.body.newBaseManagerEmail;
  const baseId = req.body.baseId;

  try {
    if (!(newBaseManagerEmail && baseId)) {
      throw new Error('Missing data in request.');
    }
    const baseManager = await adminController.createBaseManager(
      baseId,
      newBaseManagerEmail
    );
    if (baseManager instanceof Error) throw baseManager;
    res.json({ token: req.token, success: true });
  } catch (error) {
    res.json({ token: req.token, success: false, error: error.message });
  }
});

router.post('/deleteBaseManager', async (req, res) => {
  const email = req.body.deleteBaseManagerEmail;
  const baseId = req.body.baseId;

  try {
    if (!(baseId && email)) {
      throw new Error('Missing data in request.');
    }
    const baseManager = await adminController.deleteBaseManager(baseId, email);
    if (baseManager instanceof Error) throw baseManager;
    res.json({ token: req.token, success: true });
  } catch (error) {
    res.json({ token: req.token, success: false, error: error.message });
  }
});

module.exports = router;
