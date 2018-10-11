const express = require('express');
const router = express.Router();

const userRouter = require('./user');

function requireUserMiddleware(req, res, next) {
  if (!req.session.userId) {
    switch (req.header['content-type']) {
      case 'application/json':
        res.send(403);
        break;
      case 'text/html':
        res.redirect('/login');
        break;
      default:
        res.send(403);
    }
  }
  next();
}

router
  .get('/', (req, res, next) => {
    // TODO: Eventually serve an api reference page at the root
    res.send('This is the base api route.');
  })
  .use('/user', requireUserMiddleware, userRouter);

module.exports = router;
