const express = require('express');
const router = express.Router();
const userController = require('../../controllers/user');

router.get('/', async (req, res) => {
  // Get all of the user's data so that we can build the dashboard
  const userId = req.session.userId;
  const result = await userController
    .getUserData(userId)
    .catch(err => console.error(err));
  res.json(result);
});

router.get('/isAdmin', async (req, res) => {
  const userId = req.session.userId;
  const result = await userController
    .isAdmin(userId)
    .catch(err => console.error(err));
  res.json(result);
});

module.exports = router;
