const express = require('express');
const router = express.Router();
const orgController = require('../../controllers/organization');

router
  .post('/createOrgManager', async (req, res) => {
    const userId = req.userId;
    const orgId = req.body.orgId;
    const newOrgManagerEmail = req.body.newOrgManagerEmail;

    if (!(userId && orgId && newOrgManagerEmail)) {
      res.json({ success: false, error: 'Missing data on request.' });
    }

    const orgManager = await orgController
      .createOrgManager(userId, orgId, newOrgManagerEmail)
      .catch(err => console.error(err));

    if (!orgManager.userId) {
      res.json({ token: req.token, success: false, error: orgManager });
    }

    res.json({ token: req.token, success: true });
  })
  .post('/isSubscriptionCodeUnique', async (req, res) => {
    const subscriptionCode = req.body.subscriptionCode;
    if (!subscriptionCode) {
      res.json({ success: false, error: 'Missing data on request.' });
    }
    const isSubscriptionCodeUnique = await orgController
      .isSubscriptionCodeUnique(subscriptionCode)
      .catch(err => console.error(err));

    res.json({
      token: req.token,
      success: true,
      isSubscriptionCodeUnique: isSubscriptionCodeUnique
    });
  })
  .post('/updateOrgOwner', async (req, res) => {
    const userId = req.userId;
    const orgId = req.body.orgId;
    const newOrgOwnerEmail = req.body.newOrgOwnerEmail;

    if (!(orgId && newOrgOwnerEmail)) {
      res.json({ success: false, error: 'Missing data on request.' });
    }

    const org = await orgController
      .updateOrgOwner(userId, orgId, newOrgOwnerEmail)
      .catch(err => console.error(err));

    if (org !== true) {
      res.json({ token: req.token, success: false, error: org });
    }
    res.json({ token: req.token, success: true });
  });

module.exports = router;
