// NPM Packages
const express = require('express');
// const cookieParser = require('cookie-parser');
const session = require('express-session');
// const path = require('path');

// Initializations
require('dotenv').config();
const app = express();
const port = process.env.PORT || 3000;

// Reference Models
const models = require('./app/models');

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

app.post('/login', (req, res) => {
  console.log(req.body);
  res.redirect('/');
  // find the user by the email
  // encrypt the password, check for a match against stored hashed password of user
  // if correct
  // . set req.session.userId = userId
  // . redirect to /app
});

app.post('/register', (req, res) => {
  console.log(req.body);
  res.redirect('/');
  // validate credentials
  // if valid
  // . check if user already exists
  // . if exists
  // . . set req.session.userId = userId
  // . else
  // . . register user
  // res.redirect to logged in app
});

app.use('/api', apiRouter);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/app/views/index.html');
});

app.get('/home', requireUserMiddleware, express.static('public'));

models.sequelize.sync({ force: process.env.DEV || false }).then(() => {
  app.listen(port, () =>
    console.log(`Megaphone is listening on port ${port}!`)
  );
});

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
