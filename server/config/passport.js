'use strict';

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

module.exports = function(conn) {


        passport.use(new LocalStrategy(function (username, password, done) {
        console.log("inside passport");
        conn.query("SELECT * from Admin WHERE name='" + username + "'", function (err, res) {
            if (res.length) {
                if (res[0].password == password) {
                    return done(null, {
                        id: res[0].id,
                        username: res[0].name
                    })
                } else {
                    return done(null, false, {
                        message: 'Incorrect password'
                    });
                }
            } else {
                return done(null, false, {
                    message: 'No user found'
                });
            }
        })
    }));

    passport.serializeUser((user, done) => {
        done(null, user.username);
    });

    passport.deserializeUser((username, done) => {
        var adminSelectQuery = "SELECT * FROM Admin WHERE name='" + username + "'";
        conn.query(adminSelectQuery, function (err, res) {
            if (res.length) {
                return done(null, {
                    id: res[0].id,
                    username: res[0].name
                });
            }
        })
    });

}