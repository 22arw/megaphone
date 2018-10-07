const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
  res.send('This is sent from the register route.');
});

module.exports = router;
