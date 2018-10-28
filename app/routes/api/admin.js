const express = require('express');
const router = express.Router();
const adminController = require('../../controllers/admin');

router.get('/', async (req, res) => {
  const adminData = await adminController
    .getAdminData(req)
    .catch(err => console.error(err));
  res.json(adminData);
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
    res.json({
      success: true
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
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
    res.json({
      success: true
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
