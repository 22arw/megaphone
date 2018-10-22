const express = require('express');
const router = express.Router();
const adminController = require('../../controllers/admin');

router.get('/', async (req, res) => {
  res.send('hello');
});

module.exports = router;
