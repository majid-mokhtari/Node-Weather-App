const express = require('express');
const fs = require('fs');
const weatherApp = require('./weatherApp');

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
  const address = weatherApp.address;
  const weather = weatherApp.weather;
  res.send(`Your current address is: <h2>${address}</h2>${weather}`);
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
