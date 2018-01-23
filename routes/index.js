import express from 'express';
import request from 'request';
const router = express.Router();
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var morgan = require('morgan');
var User = require('../models/user');
// set morgan to log info about our requests for development use.
router.use(morgan('dev'));
// initialize body-parser to parse incoming parameters requests to req.body
router.use(bodyParser.urlencoded({ extended: true }));
// initialize cookie-parser to allow us access the cookies stored in the browser. 
router.use(cookieParser());

router.use(session({
    key: 'user_sid',
    secret: 'bkakdkhadhalba',
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 600000
    }
}));

// This middleware will check if user's cookie is still saved in browser and user is not set, then automatically log the user out.
// This usually happens when you stop your express server after login, your cookie still remains saved in the browser.
router.use((req, res, next) => {
    if (req.cookies.user_sid && !req.session.user) {
        res.clearCookie('user_sid');        
    }
    next();
});

// middleware function to check for logged-in users
var sessionChecker = (req, res, next) => {
    if (req.session.user && req.cookies.user_sid) {
        res.redirect('/');
    } else {
        next();
    }    
};

// route for Home-Page
router.get('/', sessionChecker, (req, res) => {
    res.render('login')
});

// route for user signup
router.get('/signup')
    .get(sessionChecker, (req, res) => {
        res.render('signup')
    })
    .post((req, res) => {
        User.create({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password
        })
        .then(user => {
            req.session.user = user.dataValues;
            res.redirect('/');
        })
        .catch(error => {
            res.redirect('/signup');
        });
    });

// route for user Login
router.get('/login')
    .get(sessionChecker, (req, res) => {
        res.render('login')
    })
    .post((req, res) => {
        var username = req.body.username,
            password = req.body.password;

        User.findOne({ where: { username: username } }).then(function (user) {
            if (!user) {
                res.redirect('/login');
            } else if (!user.validPassword(password)) {
                res.redirect('/login');
            } else {
                req.session.user = user.dataValues;
                res.redirect('/');
            }
        });
    });

    // route for user's dashboard
router.get('/', (req, res) => {
    if (req.session.user && req.cookies.user_sid) {
        res.render('index')
    } else {
        res.redirect('/login');
    }
});

// route for user logout
router.get('/logout', (req, res) => {
    if (req.session.user && req.cookies.user_sid) {
        res.clearCookie('user_sid');
        res.redirect('/');
    } else {
        res.redirect('/login');
    }
});

// route for handling 404 requests(unavailable routes)
router.use(function (req, res, next) {
  res.status(404).send("I surely hope you know what you are doing, because I dont!")
});
export default router;


