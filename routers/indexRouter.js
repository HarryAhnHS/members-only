const indexControllers = require('../controllers/indexControllers');
const express = require('express');
const indexRouter = express.Router();

indexRouter.get("/",indexControllers.indexGet);

indexRouter.get("/sign-up", indexControllers.signUpGet);
indexRouter.post("/sign-up", indexControllers.signUpPost);

// Login
indexRouter.get('/log-in', indexControllers.logInGet);
indexRouter.post("/log-in", indexControllers.logInPost);

// Logout
indexRouter.get("/log-out", indexControllers.logOutGet);

// Create message
indexRouter.get("/create", indexControllers.createPostGet);
indexRouter.post("/create", indexControllers.createPostPost);

// Admin
indexRouter.get("/set-admin", indexControllers.setAdminGet);
indexRouter.post("/set-admin", indexControllers.setAdminPost);

// Delete messages - only as admin
indexRouter.post("/delete/:id", indexControllers.deleteMessagePost);

module.exports = indexRouter;