const express = require('express');
const router = express.Router();
const ObjectId = require('mongoose').Types.ObjectId;
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const passport = require('passport');
const flash = require('connect-flash');
const path = require("path");
const multer = require('multer');


//Bring in Models
let Admin = require('../models/admin');
let Owner = require('../models/owner');
let Center = require('../models/center');
let Trainer = require('../models/trainer');
let Exercise = require('../models/exercise');

var upload = multer({ dest: './public/uploads/'});

//set public folder
router.use(express.static(path.join(__dirname, 'public')));

//admin login route
router.get("/signup", function(req, res){
  res.render("admin/admin_signup", {
    title: 'Signup for Admin'
  })
});

//Registration Process
router.post('/signup', function(req, res){
  const username = req.body.username;
  const type = 'admin';
  const password = req.body.password;

  req.checkBody('username', 'Name is required').notEmpty();
  req.checkBody('password', 'Password is required').notEmpty();

  let errors = req.validationErrors();

  if (errors) {
    res.render('admin/admin_signup', {
      errors:errors
    });
  } else {
    let newAdmin = new Admin({
      username:username,
      type:type,
      password:password
    });

    bcrypt.genSalt(10, function(err, salt){
      bcrypt.hash(newAdmin.password, salt, function(err, hash){
        if (err) {
          console.log(err);
        }
        newAdmin.password = hash;
        newAdmin.save(function(err){
          if (err) {
            console.log(err);
          } else {
            req.flash('success', 'Now ! You are Admin');
            res.redirect('/admin/login');
          }
        });
      });
    });
  }
});

//admin login route
router.get('/login', function(req, res){
  res.render("admin/admin_login", {
    title: 'Login for Admin'
  })
});

//admin login process
router.post('/login', function(req, res, next){
  passport.authenticate('admin', {
    successRedirect:'/admin',
    failureRedirect:'/admin/login',
    failureFlash: true
  })(req, res, next);
});

//admin home route
router.get("/", function(req, res){
  if (!req.user) {
    res.render("admin/admin_login");
  } else {
    Owner.find({}, function(err, owners){
      Center.find({}, function(err, centers){
        Trainer.find({}, function(err, trainers){
          if (err) {
            console.log(err);
          }else {
            res.render("admin/admin_index", {
              title: "HELLO",
              user: req.user,
              owners: owners,
              centers: centers,
              trainers:trainers
            });
          }
        });
      });
    });
  }
});

//route owners
router.get('/owner/:id', function (req, res) {
  Owner.findById(req.params.id, function(err, owner){
      res.render('admin/owner', {
        title: "<%=owner.username%>",
        owner: owner
    });
  });
});

router.get('/center/:id', function (req, res) {
  Center.findById(req.params.id, function(err, center){
      res.render('admin/center1', {
        title: "<%=center.centername%>",
        center: center
    });
  });
});

router.get('/trainer/:id', function (req, res) {
  Trainer.findById(req.params.id, function(err, trainer){
      res.render('admin/trainer', {
        title: "<%=trainer.trainername%>",
        trainer: trainer
    });
  });
});

router.get("/centers/add", function(req, res){
  res.render("admin/centers/add_center", {
    title: 'Signup for Admin'
  })
});

router.get("/trainers/add", ensureAuthenticated, function(req, res){
  Center.find({}, function(err, rtn){
    if(err) throw err;
    res.render("admin/trainers/add_trainer", {
      title: 'Add Trainers',
      centers: rtn
    });
  });
});

router.post('/centers/add', upload.single('artphoto'), function (req, res, next) {
  let errors = req.validationErrors();

  if (errors) {
    res.render('admin/centers/add_center', {
      title: 'Add Fitnesscenter',
      errors:errors
    });
  } else {
    let center = new Center();
    center.centername = req.body.centername;
    center.city = req.body.city;
    center.address = req.body.address;
    center.phone = req.body.phone;
    center.opttime = req.body.opttime;
    center.closetime = req.body.closetime;
    center.memberfees = req.body.memberfees;
    if(req.file) center.artphoto = '/uploads/' + req.file.filename ;
    center.classes = req.body.classes;
    center.author = req.user._id;
    center.otinfo = req.body.otinfo;
    center.save(function(err){
      if(err){
        console.log(err);
        return;
      }else {
        req.flash('success','Fitnesscenter Added');
        res.redirect('/admin');
      }
    });
  }
});

router.post('/trainers/add', upload.single('traphoto'), function(req, res) {
  let errors = req.validationErrors();

  if (errors) {
    res.render('admin/trainers/add_trainer', {
      title: 'Add Trainers',
      errors:errors
    });
  } else {
    let trainer = new Trainer();
    trainer.trainername = req.body.trainername;
    trainer.address = req.body.address;
    trainer.phone = req.body.phone;
    trainer.email = req.body.email;
    trainer.age = req.body.age;
    trainer.certificate = req.body.certificate;
    if(req.file) trainer.certificatephoto = '/uploads/' + req.file.filename;
    trainer.trainerfees = req.body.trainerfees;
    if(req.file) trainer.traphoto = '/uploads/' + req.file.filename;
    trainer.gym = req.body.gym;
    trainer.classes = req.body.classes;
    trainer.author = req.user._id;
    trainer.trainfo = req.body.trainfo;
    trainer.save(function(err){
      if(err){
        console.log(err);
        return;
      }else {
        req.flash('success','Trainer Added');
        res.redirect('/admin');
      }
    });
  }
});
//admin login route
// router.get('/dashboard', function(req, res){
//   res.send('dashboard test');
// });

// Delete route
// router.delete('/:id', function(req, res){
//
//   let query = {_id:req.params.id}
//
//   Article.findById(req.params.id, function(err, article){
//       Article.remove(query, function(err){
//         if (err) {
//           console.log(err);
//         }
//         res.send('Success');
//       });
//   });
// });

// delete Route
// router.get('/delete/:id', function (req, res) {
//   Owner.findByIdAndRemove(req.params.id , function(err, rtn){
//     if(err) throw err;
//     res.redirect('/');
//   });
// });


function ensureAuthenticated(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }else{
    req.flash('danger', 'Please Login');
    res.redirect('/admin/login');
  }
}

//Logout
router.get('/logout', function(req, res){
  req.logout();
  req.flash('success', 'You are logged out');
  res.redirect('/admin/login');
});

module.exports = router;
