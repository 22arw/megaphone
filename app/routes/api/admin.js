const express = require('express');
const router = express.Router();
const adminController = require('../../controllers/admin');

router.get('/', async (req, res) => {
  const adminData = await adminController.getAdminData(req);
  res.json(adminData);
});

module.exports = router;
