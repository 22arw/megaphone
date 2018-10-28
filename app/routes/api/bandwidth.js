const express = require('express');
const router = express.Router();
const bandwidthController = require('../../controllers/bandwidth');

router.post('/', async (req, res) => {
  const text = req.body.text;
  const from = req.body.from;

  console.log(` - - - - - - - -
  from: ${from}
  body: ${text}
  req.body: ${req.body}
  - - - - - - - - - `);
  res.send('route not configured');
});

module.exports = router;
