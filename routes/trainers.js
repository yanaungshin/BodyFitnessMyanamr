const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const passport = require('passport');
let Trainer = require('../models/trainer');
let Owner = require('../models/owner');
let Center = require('../models/center');

const ObjectId = require('mongoose').Types.ObjectId

var upload = multer({ dest: './public/uploads/'});

router.get("/add", ensureAuthenticated, function(req, res){
  Center.find({}, function(err, rtn){
    if(err) throw err;
    res.render("trainers/add_trainer", {
      title: 'Add Trainers',
      centers: rtn
    });
  });
});

router.post('/add', upload.single('traphoto'), function(req, res) {
  let errors = req.validationErrors();

  if (errors) {
    res.render('trainers/add_trainer', {
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
        res.redirect('/trainer_list');
      }
    });
  }
});

router.get('/:id', function (req, res) {
  Trainer.findById(req.params.id, function(err, trainer){
    Owner.findById(trainer.author, function(err, owner){
      res.render('trainers/trainer', {
        trainer: trainer,
        author: owner
      });
    });
  });
});

router.get('/edit/:id', ensureAuthenticated, function (req, res) {
  Trainer.findById(req.params.id, function(err, trainer){
    if (trainer.author != req.user._id) {
      req.flash('danger', 'Not Authorized !');
      res.redirect('/');
    }
    res.render('trainers/edit_trainer', {
      title: 'Edit Tainer',
      trainer: trainer,
    });
  });
});

router.post('/edit/:id', upload.single('traphoto'), function(req, res){
  let trainer = {};
  trainer.trainername = req.body.trainername;
  trainer.address = req.body.address;
  trainer.phone = req.body.phone;
  trainer.email = req.body.email;
  trainer.age = req.body.age;
  trainer.certificate = req.body.certificate;
  trainer.trainerfees = req.body.trainerfees;
  trainer.gym = req.body.gym;
  trainer.classes = req.body.classes;
  trainer.trainfo = req.body.trainfo;
  trainer.author = req.user._id;
  if(req.file) trainer.traphoto = '/uploads/' + req.file.filename;
  let query = {_id:req.params.id}
  Trainer.findOneAndUpdate(query, trainer, function(err){
    if(err){
      console.log(err);
      return;
    }else {
      req.flash('success', 'Trainer Updated');
      res.redirect('/trainer_list');
    }
  });
});

router.delete('/:id', function(req, res){
  if (!req.user._id) {
    res.status(500).send();
  }

  let query = {_id:req.params.id}

  Trainer.findById(req.params.id, function(err, trainer){
      Trainer.remove(query, function(err){
        if (err) {
          console.log(err);
        }
        res.send('Success');
      });
  });
});

router.get('/delete/:id', function (req, res) {
  Trainer.findByIdAndRemove(req.params.id , function(err, rtn){
    if(err) throw err;
    res.redirect('/trainer_list');
  });
});

function ensureAuthenticated(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }else{
    req.flash('danger', 'Please Login');
    res.redirect('/owners/login');
  }
}

module.exports = router;
