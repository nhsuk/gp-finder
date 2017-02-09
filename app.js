const express = require('express');
const helmet = require('helmet');
const gpLookup = require('./app/middleware/gpLookup');

const app = express();

app.port = process.env.PORT || 3000;
app.use(helmet());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/gp-surgeries/:orgCode', (req, res) => {
  res.send(`GP Page for ${gpLookup(req.params.orgCode).name}`);
});

app.get('/gp-surgeries/:orgCode/book-a-gp-appointment', (req, res) => {
  res.send(`Book an appointment at ${gpLookup(req.params.orgCode).name}`);
});

module.exports = app;
