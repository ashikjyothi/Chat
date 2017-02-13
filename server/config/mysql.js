'use strict';

var mysql = require('mysql'),
	config = require('./config');

var conn = mysql.createConnection(config.dbConfig);

conn.connect(function (err) {
    if (err) {
        console.log('db connection err : ', err);
        return;
    }
    console.log('successfull db connection. id: ', conn.threadId);
})

module.exports = conn;