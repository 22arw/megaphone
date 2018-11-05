// NPM Packages
const express = require('express');
const session = require('express-session');
const path = require('path');

// Initializations
require('dotenv').config();
const app = express();
const port = process.env.PORT || 3000;

// Reference Models
const models = require('./app/db/models');

// Reference Controllers
const authController = require('./app/controllers/auth');

// Reference Routes
const apiRouter = require('./app/routes/api');

// Reference Middleware functions
const requireUserMiddleware = require('./app/middleware/requireUser');

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

if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1); // trust first proxy
}

app.use(express.static('./app/views'));
app.get('/', (req, res) => {
  if (!req.session.userId) {
    res.sendFile(__dirname + '/app/views/landing.html');
  } else {
    res.redirect('/home');
  }
});

app.use('/login', express.static('./app/views'));
app.get('/login', (req, res) => {
  if (!req.session.userId) {
    res.sendFile(__dirname + '/app/views/login.html');
  } else {
    res.redirect('/home');
  }
});

app.post('/login', async (req, res) => {
  const user = await authController.loginUser(
    req.body.email,
    req.body.password
  );

  if (!user.id) {
    res.status(400).json({
      success: false,
      error: user
    });
  }

  req.session.userId = user.id;
  res.redirect('/home');
});

app.post('/register', async (req, res) => {
  const user = await authController.registerUser(
    req.body.email,
    req.body.password,
    req.body.passwordConfirmation
  );

  if (!user.id) {
    res.status(400).json({
      success: false,
      error: user
    });
  }

  req.session.userId = user.id;
  res.redirect('/home');
});

app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
});

app.use('/api', apiRouter);

app.use('/home', requireUserMiddleware, express.static('public'));

// Sync database and then have app listen for connections.

models.sequelize
  .sync({
    force: process.env.DROP_DATABASE_ON_RESTART === 'true'
  })
  .then(() => {
    app.listen(port, () => {
      console.log(`\nMegaphone is listening on port ${port}!`);
    });
  });
