const express = require('express');
const router = express.Router();
const orgController = require('../../controllers/organization');

router
  .post('/createorg', async (req, res) => {
    const userId = req.session.userId;
    const baseId = req.body.baseId;
    const orgName = req.body.orgName;
    const subscriptionCode = req.body.subscriptionCode;

    if (!(userId && baseId && orgName && subscriptionCode)) {
      res.json({
        error: 'Missing data on request.'
      });
    }

    const createOrgResponse = await orgController.createOrg(
      userId,
      baseId,
      orgName,
      subscriptionCode
    );
    if (createOrgResponse === true) {
      res.sendStatus(200);
    } else {
      console.error(`Some error occurred when attempting to create an organization:
      ${JSON.stringify(createOrgResponse)}`);
      res.status(400).json(createOrgResponse);
    }
  })
  .post('/updateorgname', async (req, res) => {
    res.status(400).json({
      error: 'route is not configured yet.'
    });
  })
  .post('/updateorgowner', async (req, res) => {
    res.status(400).json({
      error: 'route is not configured yet.'
    });
  })
  .post('/addorgmanager', async (req, res) => {
    const userId = req.session.userId;
    const orgId = req.body.orgId;
    const newOrgManagerEmail = req.body.newOrgManagerEmail;

    if (!(userId && orgId && newOrgManagerEmail)) {
      res.json({
        error: 'Missing data on request.'
      });
    }

    const addOrgManagerResponse = await orgController
      .addOrgManager(userId, orgId, newOrgManagerEmail)
      .catch(err => console.error(err));

    if (addOrgManagerResponse === true) {
      res.sendStatus(200);
    } else {
      console.error(`An error occurred when attempting to add an organization manager:
      ${JSON.stringify(addOrgManagerResponse)}`);
      res.status(400).json(addOrgManagerResponse);
    }
  });

module.exports = router;
