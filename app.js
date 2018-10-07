// NPM Packages
const express = require('express');

// Initializations
require('dotenv').config();
const app = express();
const port = process.env.PORT || 3000;

// Reference Models
const models = require('./app/models');

// Reference Routes
const apiRouter = require('./app/routes/api');

// Application Flow
app.use(express.static('public')); // Sends frontend to user
app.use('/api', apiRouter);

models.sequelize.sync().then(() => {
  app.listen(port, () =>
    console.log(`Megaphone is listening on port ${port}!`)
  );
});
