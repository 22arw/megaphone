// NPM Packages
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

// Initializations
require('dotenv').config();
const app = express();
const port = process.env.PORT || 3000;

// Reference Models
const models = require('./app/db/models');

// Reference Routes
const apiRouter = require('./app/routes/api');

// Application Flow
app.use(helmet());
app.get('', (req, res) => res.redirect('https://github.com/22arw/megaphone'));
app.use(cors());
app.options('*', cors()); // preflight
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1); // trust first proxy
}

app.use('/api', apiRouter);

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
