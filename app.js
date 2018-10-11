// NPM Packages
const express = require('express');
const session = require('express-session');
const path = require('path');

// Initializations
require('dotenv').config();
const app = express();
const port = process.env.PORT || 3000;

// Reference Models
const models = require('./app/models');

// Reference Controllers
const authController = require('./app/controllers/auth');

// Reference Routes
const apiRouter = require('./app/routes/api');

// Application Flow
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: process.env.NODE_ENV === 'production' }
  })
);

app.get('/login', (req, res) => {
  res.sendFile(__dirname + '/app/views/login.html');
});

app.post('/login', async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  const authResult = await authController.loginUser(email, password);

  if (isNaN(authResult)) {
    res.send(authResult);
  }

  req.session.userId = authResult;

  res.redirect('/home');
});

app.post('/register', async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const passwordConfirmation = req.body.passwordConfirmation;

  const authResult = await authController.registerUser(
    email,
    password,
    passwordConfirmation
  );

  if (isNaN(authResult)) {
    res.send(authResult);
  }

  req.session.userId = authResult;
  res.redirect('/home');
});

app.use('/api', apiRouter);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/app/views/index.html');
});

app.use('/home', requireUserMiddleware, express.static('public'));

models.sequelize.sync({ force: process.env.DEV || false }).then(() => {
  app.listen(port, () =>
    console.log(`Megaphone is listening on port ${port}!`)
  );
});

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
