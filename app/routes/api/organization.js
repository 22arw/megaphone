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
    res.json(createOrgResponse);
  })
  .get('/updateorgname', async (req, res) => {
    res.send('Update Org Name Route');
  })
  .get('/updateorgowner', async (req, res) => {
    res.send('Update Org Owner Route');
  })
  .get('/addorgmanager', async (req, res) => {
    res.send('Add Org Manager Route');
  });

module.exports = router;
