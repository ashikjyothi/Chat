'use strict';

var express = require('express'),
    path = require('path'),
    http = require('http'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    flash = require('connect-flash'),
    passport = require('passport'),
    session = require('express-session'),
    SessionStore = require('express-mysql-session'),
    dbConfig = require('./config').dbConfig;

module.exports = function(mysql) {
    var app = express();
    var server = http.createServer(app).listen(3000);

    console.log('Server running at http://localhost:3000');



    // Middlewares
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(bodyParser.json());
    app.use(methodOverride());

    // Session management
    var store = new SessionStore(dbConfig);
    app.use(session({
        store: store,
        cookie: {
            maxAge: 86400000
        },
        saveUninitialized: true,
        resave: true,
        secret: 'my secret'
    }));

    // Passport
    app.use(flash());
    app.use(passport.initialize());
    app.use(passport.session());



    // view engine setup
    app.set('views', path.join(__dirname, '../../public'));
    app.engine('html', require('ejs').renderFile);
    app.set('view engine', 'html');

    // Serving static files
    app.use(express.static(path.join(__dirname, '../../public')));

    require('../routes.js')(app,passport);
    // require('../routes.js')(app, mysql);
    require('./socketio.js')(server, mysql);

    return app;
}