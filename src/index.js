require('dotenv').config();

const path = require('path');
const express = require('express');
const session = require('express-session');
const app = express();

app.use(session({
    store: new (require('connect-pg-simple')(session))({
        conString: process.env.POSTGRES_URI,
        createTableIfMissing: true
    }),
    secret: process.env.DB_SECRET,
    resave: false,
    cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 } // 30 days
}));

app.use('/api', require('./routes/api'));

app.use(require('express').static(require('path').join(__dirname, '..', 'web', 'dist')))

app.use(require('./common').errorHandlerMiddleware);

module.exports = { app };
