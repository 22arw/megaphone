const express = require('express');
const router = express.Router();
const messageController = require('../../controllers/message');

router.get('/', async (req, res) => {
  res.send('route not configured');
});

module.exports = router;
