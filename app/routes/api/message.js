const express = require('express');
const router = express.Router();
const messageController = require('../../controllers/message');

router.post('/send', async (req, res) => {
  const userId = req.userId;
  const orgId = req.body.orgId;
  const message = req.body.message;
  try {
    if (!(orgId && message) || message === '') {
      throw new Error('Missing information.');
    }

    const sendMessageResponse = await messageController
      .sendMessage(userId, orgId, message)
      .catch(err => console.error(err));

    if (sendMessageResponse instanceof Error) throw sendMessageResponse;
  } catch (error) {
    res.json({ token: req.token, success: false, error: error.message });
  }

  res.json({ token: req.token, success: true });
});

module.exports = router;
