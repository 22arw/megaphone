const express = require('express');
const path = require('path');
require('dotenv').config();

const models = require('./app/models');

const app = express();

const port = process.env.PORT || 3000;

const allowedExt = ['.js', '.ico', '.css', '.png', '.jpg'];

app.get('*', (req, res) => {
  if (allowedExt.filter(ext => req.url.indexOf(ext) > 0).length > 0) {
    res.sendFile(path.resolve(`public/${req.url}`));
  } else {
    res.sendFile(path.join(__dirname + '/public/index.html'));
  }
});

models.sequelize.sync().then(() => {
  app.listen(port, () =>
    console.log(`Megaphone is listening on port ${port}!`)
  );
});
