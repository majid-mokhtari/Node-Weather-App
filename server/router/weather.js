const express = require('express');
const router = new express.Router();
const weatherApp = require('../../src/weatherApp');

router.get('/weather', (req, res) => {
  const address = weatherApp.address;
  const weather = weatherApp.weather;
  res.send(`Your current address is: ${address} and ${weather}`);
});

module.exports = router;
