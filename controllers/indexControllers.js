const passport = require("passport");
const bcrypt = require('bcryptjs');
const pool = require('../db/pool');

const { validationResult } = require("express-validator");
const validators = require('../helpers/validators');

module.exports = {
    indexGet:  (req, res) => res.render("index"),
    signUpGet: (req, res) => res.render("forms/sign-up-form"),
    signUpPost: [validators.validateSignUp, async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).render('forms/sign-up-form', { errors: errors.array()});
        }
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
    }],
    logInGet: (req, res) => res.render('forms/log-in-form'),
    logInPost: (req, res, next) => {
        passport.authenticate('local', (err, user, info) => {
            if (err) {
                return next(err); // Handle errors from Passport
            }
            if (!user) {
                // Authentication failed
                const errors = [{ msg: typeof info.message === 'string' ? info.message : info.message[0] }];
                return res.render('forms/log-in-form', { 
                    errors: errors
                });
            }
            req.logIn(user, (err) => {
                if (err) {
                    return next(err); // Handle errors from req.logIn
                }
                res.redirect('/'); // Redirect on successful login
            });
        })(req, res, next);
    },
    logOutGet: (req, res, next) => {
        req.logout((err) => {
            if (err) {
            return next(err);
            }
            res.redirect("/");
       })
    },
}