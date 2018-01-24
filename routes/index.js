import express from 'express';
const router = express.Router();
var bcrypt = require('bcrypt');
var db = require('../db');
var session = require('express-session');

router.use(session({
    key: 'useremail',
    secret: 'jbknlnklnklbl khlk hli',
    resave: false,
    saveUninitialized: false
}));

let sessionChecker = (req, res, next) => {
    if (req.session.useremail) {
        res.redirect('/');
    } else {
        next()
    }    
};

router.get('/',sessionChecker, (req, res) => {
    
    res.render('index');
});

router.get('/signup', (req, res) => {
    res.render('signup');
});


router.post('/signup', (req, res) => {
    let [email, username] = [req.body.email, req.body.username]
    let hashpassword = bcrypt.hashSync(req.body.password, 10);

    db.query('INSERT INTO users (username,email,password) VALUES($1,$2,$3)',[username,email,hashpassword],(err,resp)=>{
    // if(err){
    //     res.redirect('/signup');
    // }else{
        res.redirect('/login');
    // }     
}); 
});

router.get('/login', (req, res) => { 
    res.render('login');
});
 
router.post('/login', (req, res) => {
    let email = req.body.email;
    let password = req.body.password;
    let hashed = bcrypt.hashSync(password, 10);
    db.query('SELECT * FROM users WHERE email=$1',[email])
    .then(resp => {
        console.log('is in db'+resp.rows[0].password)
        if (resp.rowCount && bcrypt.compareSync(resp.rows[0].password,hashed)) {

            req.session.useremail = email;
            res.redirect('/');
        }
    })
    .catch(err => console.log(err.stack));
});


router.get('/logout', (req, res) => {
        req.session.destroy();
        res.redirect('/login');
        
});



router.use(function (req, res, next) {
  res.status(404).send("I surely hope you know what you are doing, becasue I dont!")
});
export default router;


