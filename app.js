// NPM Packages
const express = require('express');
const cookieParser = require('cookie-parser');

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
app.use(cookieParser()); // add secret
app.use(express.static('public')); // Sends frontend to user
app.use('/api', apiRouter);

// Catch all route just sends back the client to render the landing page.
app.use('*', express.static('public'));

models.sequelize.sync({ force: process.env.DEV || false }).then(() => {
  app.listen(port, () =>
    console.log(`Megaphone is listening on port ${port}!`)
  );
});
