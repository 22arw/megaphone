const express = require('express');
const router = express.Router();

router
  .get('/', (req, res, next) => {
    res.send('This is the base api route.');
    // TODO: Eventually serve an api reference page at the root
  })
  .get('/register', (req, res, next) => {
    res.send(`Sent from ${req.url}`);
  });

module.exports = router;
