const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');

let album = {};

app.use(bodyParser.json());
app.use(express.static('static'))

app.options('*', cors());

app.get('/api/album', (req, res) => {
  res.json(album);
});

app.post('/api/album', (req, res) => {
  console.log('req.body', req.body);
  album = req.body;
  res.sendStatus(200);
});

app.listen(4242, () => console.log('Example app listening on port 4242!'));
