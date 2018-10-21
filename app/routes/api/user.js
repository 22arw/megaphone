const express = require('express');
const router = express.Router();
const userController = require('../../controllers/user');

router.get('/', async (req, res) => {
  // Get all of the user's data so that we can build the dashboard
  const result = await userController.getUserData(req);
  res.json(result);
});

router.get('/admin', async (req, res) => {
  const result = await userController.getAdminData(req);
  res.json(result);
});

module.exports = router;
