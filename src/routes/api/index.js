const app = require('express').Router();

const bodyParser = require('body-parser').json({ type: 'application/json' });
app.use(bodyParser);

app.use('/db-app', require('./db-app/index'));

module.exports = app;
