const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

let Exercise = require('../models/exercise');
// let Admin = require('../models/admin');
var upload = multer({ dest: './public/uploads/'});


router.get("/admin/add", function(req, res){
  res.render("admin/exercises/add_exercise", {
    title: 'Signup for Admin'
  })
});

router.post('/admin/add', upload.single('exephoto'), function(req, res){
  let errors = req.validationErrors();

  if (errors) {
    res.render('admin/exercises/add_exercise', {
      user: req.user,
      title: 'Add Exercise',
      errors:errors
    });
  } else {
    let exercise = new Exercise();
    exercise.exercisename = req.body.exercisename;
    exercise.bodypart = req.body.bodypart;
    if(req.file) exercise.exephoto = '/uploads/' + req.file.filename;
    exercise.exeinfo = req.body.exeinfo;
    exercise.save(function(err){
      if(err){
        console.log(err);
        return;
      }else {
        req.flash('success','Exercise Added');
        res.redirect('/exercises/admin/exercise_list');
      }
    });
  }
});


router.get("/admin/exercise_list", function(req, res){
  Exercise.find({}, function(err, exercises){
    if (err) {
      console.log(err);
    } else {
      res.render("admin/exercises/exercise_list", {
        title: 'Exercise List',
        exercises: exercises
      });
    }
  });
});

router.get('/admin/:id', function (req, res) {
  Exercise.findById(req.params.id, function(err, exercise){
      res.render('admin/exercises/exercise', {
        exercise: exercise
    });
  });
});

router.get('/:id', function (req, res) {
  Exercise.findById(req.params.id, function(err, exercise){
      res.render('exercises/exercise', {
        exercise: exercise
    });
  });
});

router.get('/admin/edit/:id', ensureAuthenticated, function (req, res) {
  Exercise.findById(req.params.id, function(err, exercise) {
    res.render('admin/exercises/edit_exercise', {
      title: 'Edit Exercise',
      exercise: exercise
    });
  });
});

router.post('/admin/edit/:id', upload.single('exephoto'), function (req, res) {
  let exercise = {};
  exercise.exercisename = req.body.exercisename;
  exercise.bodypart = req.body.bodypart;
  exercise.exeinfo = req.body.exeinfo;
  if(req.file) exercise.exephoto = '/uploads/' + req.file.filename;
  let query = {_id:req.params.id}
  Exercise.findOneAndUpdate(query, exercise, function(err){
    if(err){
      console.log(err);
      return;
    }else {
      req.flash('success', 'Exercise Updated');
      res.redirect('/exercises/admin/exercise_list');
    }
  });
});

router.get('/admin/delete/:id', function (req, res) {
  Exercise.findByIdAndRemove(req.params.id , function(err, rtn){
    if(err) throw err;
    res.redirect('/exercises/admin/exercise_list');
  });
});

function ensureAuthenticated(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }else{
    req.flash('danger', 'Please Login');
    res.redirect('/admin/login');
  }
}

module.exports = router;
