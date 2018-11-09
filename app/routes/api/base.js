const express = require('express');
const router = express.Router();
const baseController = require('../../controllers/base');

router.get('/getAllBases', async (req, res) => {
  try {
    const bases = await baseController
      .getAllBases()
      .catch(err => console.error(err));
    if (bases instanceof Error) throw bases;
    res.json({ success: true, token: req.token, bases: bases });
  } catch (error) {
    res.json({ token: req.token, success: false, error: error.message });
  }
});

module.exports = router;
