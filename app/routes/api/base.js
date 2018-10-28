const express = require('express');
const router = express.Router();
const baseController = require('../../controllers/base');

router.post('/createBaseManager', async (req, res) => {
  const userId = req.session.userId;
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
