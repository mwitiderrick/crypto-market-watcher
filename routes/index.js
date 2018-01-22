import express from 'express';
import request from 'request';
const router = express.Router();

var passport = require('passport');
var Strategy = require('passport-facebook').Strategy;
passport.use(new Strategy({
    clientID: '1532856283496325',
    clientSecret: '330aae67e7a9be6d9156ff641cac66ba',
    callbackURL: 'http://localhost:3000/'
  },
  function(accessToken, refreshToken, profile, cb) {
    return cb(null, profile);
  }));

passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});


// Initialize Passport and restore authentication state, if any, from the
// session.
router.use(passport.initialize());
router.use(passport.session());

// router.get('/login',
//   function(req, res){
//     res.render('login');
//   });

router.get('/facebook/',
  passport.authenticate('facebook'));

router.get('/login/facebook/return', 
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });

router.get('/', (req, res) => {
	res.render('index')
});

export default router;


