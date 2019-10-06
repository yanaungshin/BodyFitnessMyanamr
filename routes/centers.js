const express = require('express');
const router = express.Router();
const multer = require('multer');
const ObjectId = require('mongoose').Types.ObjectId;
const path = require('path');

//Article Model
let Center = require('../models/center');
//edit single article
//Teacher Model
let Owner = require('../models/owner');
let Trainer = require('../models/trainer')


var upload = multer({ dest: './public/uploads/'});

//Set Storage Engine-----

router.get('/edit/:id', ensureAuthenticated, function (req, res) {
  Center.findById(req.params.id, function(err, center){
    if (center.author != req.user._id) {
      req.flash('danger', 'Not Authorized !');
      res.redirect('/');
    }
    res.render('centers/edit_center', {
      title: 'Edit Fitnesscenter',
      center: center,
    });
  });
});

//teacher route
router.get("/add", ensureAuthenticated, function(req, res){
  res.render("centers/add_center", {
    title: 'Add Fitnesscenter'
  });
});

// category route
router.get('/search/:city', function(req, res){
  Center.find({city: req.params.city}, function(err, centers){
    if(err){
      console.log(err);
    }else {
      res.render('city', {
        title: req.params.city,
        centers: centers
      });
    }
  })
});

//add submit post route
router.post('/add', upload.single('artphoto'), function(req, res, next){
  req.checkBody('centername', 'Centername is required').notEmpty();
  // req.checkBody('author', 'Author is required').notEmpty();
  req.checkBody('otinfo', 'Other info is required').notEmpty();

  //Get errors
  let errors = req.validationErrors();

  if (errors) {
    res.render('centers/add_center', {
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
    center.dailymemberfees = req.body.dailymemberfees;
    center.yearmemberfees = req.body.yearmemberfees;
    if(req.file) center.artphoto = '/uploads/' + req.file.filename ;
    center.classes = req.body.classes;
    center.promotion = req.body.promotion;
    center.discount = req.body.discount;
    center.author = req.user._id;
    center.otinfo = req.body.otinfo;

    center.save(function(err){
      if(err){
        console.log(err);
        return;
      }else {
        req.flash('success','Fitnesscenter Added');
        res.redirect('/center_list');
      }
    });
  }
});

// get single article
router.get('/:id', function (req, res) {
  Center.findById(req.params.id, function(err, center){
    if (err) {
      console.log(err);
    }
    Trainer.find({gym:req.params.id}, function(err, trainers){
      Owner.findById(center.author, function(err, owner){
      res.render('centers/center', {
        center: center,
        author: owner,
        trainers : trainers
        });
      });
    });
  });
});


//update submit post route
router.post('/edit/:id', upload.single('artphoto'), function(req, res, next){
  let center = {};
  center.centername = req.body.centername;
  center.city = req.body.city;
  center.address = req.body.address;
  center.phone = req.body.phone;
  center.opttime = req.body.opttime;
  center.closetime = req.body.closetime;
  center.memberfees = req.body.memberfees;
  center.dailymemberfees = req.body.dailymemberfees;
  center.yearmemberfees = req.body.yearmemberfees;
  center.classes = req.body.classes;
  center.promotion = req.body.promotion;
  center.discount = req.body.discount;
  center.otinfo = req.body.otinfo;
  center.author = req.user._id;
  if(req.file) center.artphoto = '/uploads/' + req.file.filename;
  let query = {_id:req.params.id}
  Center.findOneAndUpdate(query, center,{ $set: center}, function(err){
    if(err){
      console.log(err);
      return;
    }else {
      req.flash('success', 'Fitnesscenter Updated');
      res.redirect('/center_list');
    }
  });
});

router.delete('/:id', function(req, res){
  if (req.user.type == 'admin') {
    let query = {_id:req.params.id}

    Center.findById(req.params.id, function(err, center){
        Center.remove(query, function(err){
          if (err) {
            console.log(err);
          }
          res.send('Success');
        });
    });
  } else {
    if (!req.user._id) {
      res.status(500).send();
    }
    let query = {_id:req.params.id}

    Center.findById(req.params.id, function(err, center){
      if (center.author != req.user._id) {
        res.status(500).send();
      } else {
        Center.remove(query, function(err){
          if (err) {
            console.log(err);
          }
          res.send('Success');
        });
      }
    });
  }
});

//Access Control
function ensureAuthenticated(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }else{
    req.flash('danger', 'Please Login');
    res.redirect('/owners/login');
  }
}

module.exports = router;
