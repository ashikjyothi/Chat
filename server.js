'use strict';

var mysql = require('./server/config/mysql'),
    passport = require('./server/config/passport')(mysql),
    app = require('./server/config/express')(mysql);

module.exports = app;