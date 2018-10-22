function requireUserMiddleware(req, res, next) {
  if (!req.session.userId) {
    switch (req.header['content-type']) {
      case 'application/json':
        res.sendStatus(403);
        break;
      case 'text/html':
        res.redirect('/login');
        break;
      default:
        res.sendStatus(403);
    }
  }
  next();
}

module.exports = requireUserMiddleware;
