const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const OAuthClient = require('disco-oauth');

require('dotenv').config();

//Initiate Discord OAuth Client
const Client = new OAuthClient(process.env.DISCORD_ID,process.env.DISCORD_SECRET).setScopes('identify','email').setRedirect(process.env.HOST+'/users/discordauthed');



// Load User model
const User = require('../models/User');
User.collection.createIndex({"email":1},{unique: true});

//Load Notification Model
const Notification = require('../models/Notification');

const { forwardAuthenticated } = require('../config/auth');

//Default index page for user
router.get('/',(req,res) => { res.redirect('login')});

// Login Page
router.get('/login', forwardAuthenticated, (req, res) => res.render('login'));

// Register Page
router.get('/register', forwardAuthenticated, (req, res) => res.render('register'));

//Discord Public Page
router.get('/discord', forwardAuthenticated, (req,res) => res.redirect(Client.authCodeLink));

// Register
router.post('/register', (req, res) => {
  const { name, email, password, password2 } = req.body;
  let errors = [];

  if (!name || !email || !password || !password2) {
    errors.push({ msg: 'Please enter all fields' });
  }

  if (password != password2) {
    errors.push({ msg: 'Passwords do not match' });
  }

  if (password.length < 6) {
    errors.push({ msg: 'Password must be at least 6 characters' });
  }

  if (errors.length > 0) {
    res.render('register', {
      errors,
      name,
      email,
      password,
      password2
    });
  } else {
    User.findOne({ email: email }).then(user => {
      if (user) {
        errors.push({ msg: 'Email already exists' });
        res.render('register', {
          errors,
          name,
          email,
          password,
          password2
        });
      } else {
        const newUser = new User({
          name,
          email,
          password
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(user => {
                req.flash(
                  'success_msg',
                  'You are now registered and can log in'
                );
                res.redirect('/users/login');
              })
              .catch(err => console.log(err));
          });
        });
      }
    });
  }
});

//Register via discord
router.get('/discordauthed', async(req, res, next) => {
  if (req.query.code) {
    let userKey = await Client.getAccess(req.query.code);
    let user = await Client.getUser(userKey);
    const usere = await User.findOne({ email: user._emailId });
    if(!usere){
      const newUser = new User({name:user._username,email:user._emailId,password:''+user._id});
      const salt = await new Promise((resolve, reject) => {
        bcrypt.genSalt(10, function(err, salt) {
          if (err) reject(err)
          resolve(salt)
        });
      });
      const hashedPassword = await new Promise((resolve, reject) => {
        bcrypt.hash(newUser.password, salt, function(err, hash) {
          if (err) reject(err)
          resolve(hash)
        });
      });
      newUser.password = hashedPassword;
      console.log(newUser);
      await newUser.save();
    }
    req.body = {email:user._emailId,password:user._id};
    passport.authenticate('local', {
      successRedirect: '/dashboard',
      failureRedirect: '/users/login',
      failureFlash: true
    })(req,res,next);
  } else {
    res.redirect('/login');
  }
});

// Login
router.post('/login',
  passport.authenticate('local', {
    failureRedirect: '/users/login',
    failureFlash: true
  }),async (req, res) => {
    try {
      const newNotification = new Notification({
        messageType:"loginSuccess",
        message:"Successfully logged in from "+req.ip.toString()+" using agent"+req.headers['user-agent'],
        userid:req.user.id,
      });
      await newNotification.save();
      res.redirect('/dashboard',);
    } catch(err) {
      console.log(err);
      
    }

  }
);

// Logout
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/users/login');
});

module.exports = router;