const Router = require('express').Router;
let app = Router();
const { asyncMiddleware, extraQueryParamsMiddleware, formatSpecialTypes } = require('../../../common');

// Contract routes
app.use('/contract', require('./contract'))

// Item routes
app.use('/item', require('./item'))

// Made of routes
app.use('/made', require('./made'))

// Order routes
app.use('/order', require('./order'));

// Project routes
app.use('/project', require('./project'));

// Supplier routes
app.use('/supplier', require('./supplier'));

// Agreement routes
app.use('/to_supply', require('./to_supply'));

module.exports = app;