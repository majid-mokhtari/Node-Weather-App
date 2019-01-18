const yargs = require('yargs');
const axios = require('axios');

const argv = yargs
  .options({
    a: {
      demand: false,
      alias: 'address',
      describe: 'Address to fetch weather for',
      string: true
    }
  })
  .help()
  .alias('help', 'h').argv;

const address = '150 Font blvd San Francisco, 94132';
var encodedAddress = encodeURIComponent(address);
var geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=AIzaSyDh5HKm75BZXkIKo0GKdtgEnT_NaT_biso`;

axios
  .get(geocodeUrl)
  .then(response => {
    if (response.data.status === 'ZERO_RESULTS') {
      throw new Error('Unable to find that address.');
    } else var lat = response.data.results[0].geometry.location.lat;
    var lng = response.data.results[0].geometry.location.lng;
    var weatherUrl = `https://api.darksky.net/forecast/e3a138bee5c40adc7b1513fa6206692e/${lat},${lng}`;
    const formattedAddress = response.data.results[0].formatted_address;
    module.exports.address = formattedAddress;
    return axios.get(weatherUrl);
  })
  .then(response => {
    var temperature = response.data.currently.temperature;
    var apparentTemperature = response.data.currently.apparentTemperature;
    const weather = `Your current temperature is: <h2>${temperature} and it feels like ${apparentTemperature}.</h2>`;
    module.exports.weather = weather;
  })
  .catch(e => {
    if (e.code === 'ENOTFOUND') {
      console.log('Unable to connect to API servers.');
    } else {
      console.log('Server Error:', e.message);
    }
  });
