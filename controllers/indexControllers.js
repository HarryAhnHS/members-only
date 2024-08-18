const passport = require("passport");
const bcrypt = require('bcryptjs');
const pool = require('../db/pool');

module.exports = {
    indexGet:  (req, res) => res.render("index"),
    signUpGet: (req, res) => res.render("forms/sign-up-form"),
    signUpPost: async (req, res, next) => {
        try {
            bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
                if (err) return console.error(err, 'while hashing password');
    
                await pool.query("INSERT INTO users (first_name, last_name, username, password) VALUES ($1, $2, $3, $4)", [
                    req.body.first_name,
                    req.body.last_name,
                    req.body.username,
                    hashedPassword,
                ]);
            }); 
            res.redirect("/");
        } catch(err) {
          return next(err);
        }
    },
    logInGet: (req, res) => res.render('forms/log-in-form'),
    logInPost: passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/log-in"
    }),
    logOutGet: (req, res, next) => {
        req.logout((err) => {
            if (err) {
            return next(err);
            }
            res.redirect("/");
       })
    },
}