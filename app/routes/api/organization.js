const express = require('express');
const router = express.Router();
const orgController = require('../../controllers/organization');

router
  .post('/addOrgManager', async (req, res) => {
    const userId = req.session.userId;
    const orgId = req.body.orgId;
    const newOrgManagerEmail = req.body.newOrgManagerEmail;

    if (!(userId && orgId && newOrgManagerEmail)) {
      res.status(400).json({
        error: 'Missing data on request.'
      });
    }

    const addOrgManagerResponse = await orgController
      .addOrgManager(userId, orgId, newOrgManagerEmail)
      .catch(err => console.error(err));

    if (addOrgManagerResponse === true) {
      res.json({ success: addOrgManagerResponse });
    } else {
      console.error(`An error occurred when attempting to add an organization manager:
    ${JSON.stringify(addOrgManagerResponse)}`);
      res.status(400).json({ error: addOrgManagerResponse });
    }
  })
  .post('/createOrg', async (req, res) => {
    const userId = req.session.userId;
    const baseId = req.body.baseId;
    const orgName = req.body.orgName;
    const subscriptionCode = req.body.subscriptionCode;

    if (!(userId && baseId && orgName && subscriptionCode)) {
      res.status(400).json({ error: 'Missing data on request.' });
    }

    const createOrgResponse = await orgController
      .createOrg(userId, baseId, orgName, subscriptionCode)
      .catch(err => console.error(err));

    if (createOrgResponse === true) {
      res.json({ success: createOrgResponse });
    } else {
      console.error(`Some error occurred when attempting to create an organization:
      ${JSON.stringify(createOrgResponse)}`);
      res.status(400).json(createOrgResponse);
    }
  })
  .post('/isSubscriptionCodeUnique', async (req, res) => {
    const subscriptionCode = req.body.subscriptionCode;
    if (!subscriptionCode) {
      res.status(400).json({ error: 'Missing data on request.' });
    }
    const response = await orgController
      .isSubscriptionCodeUnique(subscriptionCode)
      .catch(err => console.error(err));

    res.json({ isSubscriptionCodeUnique: response });
  });

module.exports = router;
