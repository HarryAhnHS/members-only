const { body, validationResult } = require('express-validator');
const db = require('../db/queries');

// Validation middleware for the sign-up form
const validateSignUp = [
    // Validate first name
    body('first_name')
        .trim()
        .notEmpty().withMessage('First name is required')
        .isLength({ min: 2 }).withMessage('First name must be at least 2 characters long'),

    // Validate last name
    body('last_name')
        .trim()
        .notEmpty().withMessage('Last name is required')
        .isLength({ min: 2 }).withMessage('Last name must be at least 2 characters long'),

    // Validate username
    body('username')
        .trim()
        .notEmpty().withMessage('Username is required')
        .isLength({ min: 3 }).withMessage('Username must be at least 3 characters long')
        .isAlphanumeric().withMessage('Username must contain only letters and numbers')
        .custom(async value => {
            const rows =  await db.getUserByUsername(value);
            console.log('rows:', rows);
            if (rows.length > 0) {
                throw new Error('Username already in use');
            }
            return true;
        }),

    // Validate password
    body('password')
        .trim()
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 4 }).withMessage('Password must be at least 4 characters long'),

    // Validate confirm password
    body('confirmPassword')
        .trim()
        .notEmpty().withMessage('Confirm password is required')
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Passwords must match');
            }
            return true;
        })
];

const validatePost = [
    // Validate first name
    body('title')
        .trim()
        .notEmpty().withMessage('Title is required'),

    body('message')
        .trim()
        .notEmpty().withMessage('Message is required')
]

module.exports = { validateSignUp, validatePost };
