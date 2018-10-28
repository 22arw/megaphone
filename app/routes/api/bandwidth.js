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

  bandwidthController
    .subscriptionHandler(phoneNumber, text, basePhoneNumber)
    .then(subscriptionHandler => {
      const bandwidth = new Bandwidth(subscriptionHandler.bandwidthConfig);

      bandwidth.Message.send({
        from: basePhoneNumber,
        to: phoneNumber,
        text: subscriptionHandler.message
      })
        .then(message => {
          console.log(`Message sent: ${JSON.stringify(message)}
        messageId: ${message.id}`);
        })
        .catch(err => console.error(err));
    })
    .catch(err => console.error(err));

  res.end();
});

module.exports = router;
