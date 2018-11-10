const express = require('express');
const router = express.Router();
const userController = require('../../controllers/user');

router.get('/', async (req, res) => {
  console.log('accessing user route');
  const userId = req.userId;
  let result = await userController
    .getUserData(userId)
    .catch(err => console.error(err));
  result.token = req.token;
  res.json(result);
});

router.get('/isAdmin', async (req, res) => {
  const userId = req.userId;
  const isAdmin = await userController
    .isAdmin(userId)
    .catch(err => console.error(err));
  res.json({ token: req.token, isAdmin: isAdmin });
});

module.exports = router;
