const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const flash = require('connect-flash');
const path = require('path');

//Bring in Teacher Model
let Owner = require('../models/owner');

//Registration form
router.get('/register', function(req, res){
  res.render('register');
});

//Registration Process
router.post('/register', function(req, res){
  const name = req.body.name;
  const email = req.body.email;
  const username = req.body.username;
  const type = 'owner';
  const password = req.body.password;
  const password2 = req.body.password2;

  req.checkBody('name', 'Name is required').notEmpty();
  req.checkBody('email', 'Email is required').notEmpty();
  req.checkBody('email', 'Name is required').isEmail();
  req.checkBody('username', 'Username is required').notEmpty();
  req.checkBody('password', 'Password is required').notEmpty();
  req.checkBody('password2', 'Password do not match').equals(req.body.password);

  let errors = req.validationErrors();

  if (errors) {
    res.render('register', {
      errors:errors
    });
  } else {
    let newOwner = new Owner({
      name:name,
      email:email,
      username:username,
      type:type,
      password:password
    });

    bcrypt.genSalt(10, function(err, salt){
      bcrypt.hash(newOwner.password, salt, function(err, hash){
        if (err) {
          console.log(err);
        }
        newOwner.password = hash;
        newOwner.save(function(err){
          if (err) {
            console.log(err);
          } else {
            req.flash('success', 'You are now registered');
            res.redirect('/owners/login');
          }
        });
      });
    });
  }
});

//Login form
router.get('/login', function(req, res){
  res.render('login');
});

//Login process
router.post('/login', function(req, res, next){
  passport.authenticate('local', {
    successRedirect:'/',
    failureRedirect:'/owners/login',
    failureFlash: true
  })(req, res, next);
});

//Login form
// router.get('/profile', function(req, res){
//   res.render('owners/teacher_profile');
// });

//profile route
// router.post('/add_photo', function(req, res){
//   upload(req, res, (err) => {
//     // if (err) {
//     //   res.render('teachers/teacher_profile', {
//     //     msg: err
//     //   });
//     // } else {
//       console.log(req.file);
//       res.send('test');
//     // }
//   });
// });

router.delete('/:id', function(req, res){

  let query = {_id:req.params.id}

  Owner.findById(req.params.id, function(err, owner){
      Owner.remove(query, function(err){
        if (err) {
          console.log(err);
        }
        res.send('Success');
      });
  });
});

//Logout
router.get('/logout', function(req, res){
  req.logout();
  req.flash('success', 'You are logged out');
  res.redirect('/owners/login');
});


module.exports = router;
