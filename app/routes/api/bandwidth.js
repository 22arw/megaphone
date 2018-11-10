const Bandwidth = require('node-bandwidth');
const express = require('express');
const router = express.Router();
const bandwidthController = require('../../controllers/bandwidth');

// TODO: Put a route guard on here that only allows access from the bandwidth api.
router.post('/', async (req, res) => {
  if (req.body.text === undefined) res.end();
  const text = req.body.text.toLowerCase().trim();
  const phoneNumber = req.body.from;
  const basePhoneNumber = req.body.to;
  if (!(text && phoneNumber && basePhoneNumber)) return res.end();
  if (text == 'unstop' || text == 'stop') return res.end();

  let message = '';
  let bandwidthConfig = {};
  if (text === 'help' || text === 'who') {
    ({ message, bandwidthConfig } = await bandwidthController
      .keyword(phoneNumber, text, basePhoneNumber)
      .catch(err => console.error(err)));
  } else {
    ({
      message,
      bandwidthConfig
    } = await bandwidthController
      .subscriptionHandler(phoneNumber, text, basePhoneNumber)
      .catch(err => console.error(err)));
  }

  const bandwidth = new Bandwidth(bandwidthConfig);

  bandwidth.Message.send({
    from: basePhoneNumber,
    to: phoneNumber,
    text: message
  })
    .then(msg => {
      console.log(`Message Sent with ID: ${msg.id}`);
    })
    .catch(err => console.error(err));

  return res.end();
});

module.exports = router;
