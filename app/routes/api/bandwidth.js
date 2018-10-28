const Bandwidth = require('node-bandwidth');
const express = require('express');
const router = express.Router();
const bandwidthController = require('../../controllers/bandwidth');

router.post('/', async (req, res) => {
  const text = req.body.text.toLowerCase();
  const phoneNumber = req.body.from;
  const basePhoneNumber = req.body.to;

  if (text === 'help' || text === 'who') {
    // handle keywords
  }

  const {
    message,
    bandwidthConfig
  } = await bandwidthController
    .subscriptionHandler(phoneNumber, text, basePhoneNumber)
    .catch(err => console.error(err));

  const bandwidth = new Bandwidth(bandwidthConfig);

  bandwidth.Message.send({
    from: basePhoneNumber,
    to: phoneNumber,
    text: message
  })
    .then(message => {
      console.log(`Message sent: ${JSON.stringify(message)}
    messageId: ${message.id}`);
    })
    .catch(err => console.error(err));

  res.end();
});

module.exports = router;
