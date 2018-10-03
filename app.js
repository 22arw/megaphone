const express = require('express');
const path = require('path');

const app = express();

const port = process.env.PORT || 3000;

const allowedExt = ['.js', '.ico', '.css', '.png', '.jpg', '.ttf', '.svg'];

app.get('*', (req, res) => {
  if (allowedExt.filter(ext => req.url.indexOf(ext) > 0).length > 0) {
    res.sendFile(path.resolve(`public/${req.url}`));
  } else {
    res.sendFile(path.join(__dirname + '/public/index.html'));
  }
});

app.listen(port, () => console.log(`Megaphone is listening on port ${port}!`));
