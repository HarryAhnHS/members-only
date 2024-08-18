require('dotenv').config()

const pool = require("./db/pool");

const express = require("express");
const path = require('path');

const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require('passport-local').Strategy;

const bcrypt = require('bcryptjs');

const indexRouter = require('./routers/indexRouter');

// Authentication setup
passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const { rows } = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
        const user = rows[0];
  
        if (!user) {
          return done(null, false, { message: 'Username not found' });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            // passwords do not match!
            return done(null, false, { message: 'Incorrect password' });
        }

        return done(null, user);
      } catch(err) {
        return done(err);
      }
    })
);
passport.serializeUser((user, done) => {
    done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
    try {
        const { rows } = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
        const user = rows[0];
    
        done(null, user);
    } catch(err) {
        done(err);
    }
});  

const app = express();
app.set("views", path.join(__dirname, '/views'));
app.set("view engine", "ejs");

app.use(session({
    store: new (require('connect-pg-simple')(session))({
      // Insert connect-pg-simple options here
      conString: process.env.DATABASE_URL
    }),
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { 
        maxAge: 1 * 24 * 60 * 60 * 1000 // 1 day
    } 
}));
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to set locals
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    next();
});

// Debugging Middleware
app.use((req, res, next) => {
    console.log('session: ', req.session);
    console.log('user: ', req.user);
    next();
});

app.use("/", indexRouter);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

const port = process.env.PORT || 3000;

app.listen(port, () => console.log("app listening on port",port));
