const express = require('express');
const router = express.Router();

const adminRouter = require('./admin');
const bandwidthRouter = require('./bandwidth');
const orgRouter = require('./organization');
const userRouter = require('./user');

const mw = require('../../middleware');

const authController = require('../../controllers/auth');
const baseController = require('../../controllers/base');
const messageController = require('../../controllers/message');

router.get('/', (req, res) => {
  res.redirect('https://github.com/22arw/megaphone/blob/master/app/routes/api/api.md');
});

// Bandwidth communicates over this route.
router.use('/bandwidth', bandwidthRouter);

// Must be logged in beyond this point
router.use(mw.auth);

// Auth Routes
router
  .post('/auth/login', authController.login)
  .post('/auth/resetPassword', authController.resetPassword);

// Base Routes
router
  .get('/base/getAllBases', baseController.getAllBases)
  .post('/base/createBase', mw.requireAdmin, baseController.createBase)
  .post('/base/createBaseManager', mw.requireBaseManager, baseController.createBaseManager)
  .post('/base/deleteBaseManager', mw.requireBaseManager, baseController.deleteBaseManager)
  .post('/base/getAllBaseManagersUnderBase', mw.requireBaseManager, baseController.getAllBaseManagersUnderBase)
  .post('/base/getAllMessagesSentByBase', mw.requireBaseManager, baseController.getAllMessagesSentByBase)
  .post('/base/getAllOrgsUnderBase', mw.requireBaseManager, baseController.getAllOrgsUnderBase)
  .post('/base/getAllUsersUnderBase', mw.requireBaseManager, baseController.getAllUsersUnderBase)
  .post('/base/isBasePhoneNumberUnique', baseController.isBasePhoneNumberUnique)
  .post('/base/updateBase', mw.requireBaseManager, baseController.updateBase);

// Message Routes
router
  .post('/message/send', mw.requireOrgManager, messageController.send)
  .get('/message/getAllMessagesEver', mw.requireAdmin, messageController.allMessagesEver);

// Organization Routes
// User Routes

// All of the old routes
router
  .use('/organization', orgRouter)
  .use('/user', userRouter)
  .use('/admin', adminRouter);

module.exports = router;
