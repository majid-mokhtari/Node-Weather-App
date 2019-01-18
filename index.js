//const app = require('./src/app');

const express = require('express');
const fs = require('fs');

const port = process.env.PORT || 8000;

var app = express();

app.use((req, res, next) => {
  var now = new Date().toString();
  const log = `${now}: ${req.method} ${req.url}`;
  console.log(log);
  fs.appendFile('server.log', log + '\n', err => {
    if (err) {
      console.log(err);
    }
  });
  next();
});

app.get('/', (req, res) => {
  res.send({
    name: 'Andrew',
    likes: ['Biking', 'Cities']
  });
});

app.get('/user/:id', (req, res) => {
  res.send('User: ' + req.params.id + ' ' + req.query.name);
});

app.get('/bad', (req, res) => {
  res.send({
    errorMessage: 'Unable to handle request'
  });
});

app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
