const passport = require("passport");
const db = require('../db/queries');

const { validationResult } = require("express-validator");
const validators = require('../helpers/validators');

const { isAuth, isAuthAndAdmin } = require('../helpers/authorizationMiddleware');
const { all } = require("../routers/indexRouter");

module.exports = {
    indexGet:  async (req, res) => {
        const allMessages = await db.fetchMessages();
        res.render("index", {messages: allMessages});
    },
    signUpGet: (req, res) => res.render("forms/sign-up-form"),
    signUpPost: [validators.validateSignUp, async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).render('forms/sign-up-form', { 
                errors: errors.array()
            });
        };
        const { first_name, last_name, username, password } = req.body; 
        await db.addUser(first_name, last_name, username, password);
        res.redirect('/');
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
    logOutGet: async (req, res, next) => {
        req.logout(async (err) => {
            if (err) {
            return next(err);
            }
            const allMessages = await db.fetchMessages();
            res.redirect('/');
       })
    },
    createPostGet: [isAuth, (req, res) => {
        // Middleware to authorize user session
        res.render('forms/create-post-form');
    }],
    createPostPost: [validators.validatePost, async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.render('forms/create-post-form', {
                errors: errors.array()
            })
        }
        const { title, message } = req.body;
        await db.addMessage(req.user.id, title, message);
        res.redirect('/');
    }],
    deleteMessagePost: [isAuthAndAdmin, async (req, res) => {
        const messageIdToDelete = req.params.id;
        
        await db.deleteMessage(messageIdToDelete);
        console.log(`Deleted message ${messageIdToDelete} successfully`);   
        res.redirect('/');
    }],
    setAdminGet: [isAuth, (req, res) => {
        res.render('forms/admin-check-form');
    }],
    setAdminPost: [isAuth, validators.validateAdminKey, async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.render('forms/admin-check-form', {
                errors: errors.array()
            })
        }
        const { id } = req.user;
        await db.setAdmin(id);
        res.redirect('/');
    }]
}