const express = require('express');
const router = express.Router();
const baseController = require('../../controllers/base');

router.post('/createBaseManager', async (req, res) => {
  const userId = req.userId;
  const baseCode = req.body.baseCode;

  try {
    if (!baseCode) {
      throw new Error('Missing data in request.');
    }
    const baseManager = await baseController.createBaseManager(
      userId,
      baseCode
    );
    if (baseManager instanceof Error) throw baseManager;
    res.json({ token: req.token, success: true });
  } catch (error) {
    res.json({ token: req.token, success: false, error: error.message });
  }
});

router.post('/deleteBaseManager', async (req, res) => {
  const userId = req.userId;
  const baseId = req.body.baseId;

  try {
    if (!baseId) {
      throw new Error('Missing data in request.');
    }
    const baseManager = await baseController.deleteBaseManager(userId, baseId);
    if (baseManager instanceof Error) throw baseManager;
    res.json({ token: req.token, success: true });
  } catch (error) {
    res.json({ token: req.token, success: false, error: error.message });
  }
});

module.exports = router;
