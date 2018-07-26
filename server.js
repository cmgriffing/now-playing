const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');

app.use(bodyParser.json());

app.options('*', cors());

app.post('/receive', (req, res) => {
  console.log('req.body', req.body);
  fs.writeFileSync(path.resolve('current-album.txt'), `${req.body.album} \n${req.body.artist}\n${req.body.url}`);
  res.sendStatus(200);
});

app.listen(4242, () => console.log('Example app listening on port 4242!'));
