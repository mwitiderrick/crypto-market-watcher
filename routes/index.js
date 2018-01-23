import express from 'express';
import request from 'request';
const router = express.Router();
var bcrypt = require('bcrypt');
var db = require('../db');
var session = require('express-session');

router.use(session({
    key: 'email',
    secret: 'ndnsfknskfskfbslkf',
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 600000
    }
}));

var sessionChecker = (req, res) => {
    if (req.session.email) {
        res.redirect('/');
    } else {
        res.redirect('/login')
    }    
};

router.get('/', sessionChecker, (req, res) => {
    res.render('index');
});

router.get('/signup', sessionChecker, (req, res) => {
    res.render('signup');
});


router.post('/signup', (req, res) => {
    let [email, username] = [req.body.email, req.body.username]
     let hashpassword = bcrypt.hashSync(req.body.password, 10);

    db.query('INSERT INTO users (username,email,password) VALUES($1,$2,$3)',[username,email,hashpassword],(err,resp)=>{
    if(err){
        res.render('signup');
    }else{
        req.session.email = email;
        res.render('index');
    }     
}); 
});

router.post('/login', (req, res) => {
    let email = req.body.email;
    let password = req.body.password;
    db.query('SELECT * FROM users WHERE email=$1',[email],(err,res)=>{
        if(err){
            console.log('user doesnt exist, duh',err);
        }else{
           if(bcrypt.compareSync(password, resrows[0].password)){
            res.render('index');
           }

        }
    })
});


router.get('/login', sessionChecker, (req, res) => {
    res.render('login');
});

router.get('/logout', (req, res) => {
        req.session.destroy();
        res.redirect('/login');
        
});

export default router;


