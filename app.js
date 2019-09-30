const express = require ("express");
const path = require("path");
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const config = require('./config/database');
// const multer = require('multer');

mongoose.connect(config.database, { useNewUrlParser: true });
let db = mongoose.connection;

//check connection
db.once('open', function(){
  console.log('Connected to MongoDB');
})

//check for db errors
db.on('error', function(err){
  console.log(err);
});

//init app
const app = express();

//Bring in Models
let Center = require('./models/center');
let Trainer = require('./models/trainer');
let Exercise = require('./models/exercise');

//setup ejs
app.engine('ejs', require('express-ejs-extend'));
app.set('views', path.join(__dirname, 'views'));
app.set("view engine", 'ejs');

//Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false}));
//parse application/json
app.use(bodyParser.json());

//set public folder
app.use(express.static(path.join(__dirname, 'public')));
//Express Session middleware
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
}));

//Express Messages middleware
app.use(require('connect-flash')());
app.use(function (req, res, next){
  res.locals.messages = require('express-messages')(req, res);
  next();
});

//Express Validator middleware
app.use(expressValidator({
  errorFormatter: function(param, msg, value){
    var namespace = param.split('.')
    , root = namespace.shift()
    , formParam = root;

  while(namespace.length) {
    formParam += '[' + namespace.shift() + ']';
  }
  return {
    param : formParam,
    msg : msg,
    value : value
  };
}
}));

//Passport config
require('./config/passport')(passport);
//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

app.get('*', function(req, res, next){
  res.locals.user = req.user || null;
  next();
});

//home route
app.get("/", function (req,res) {
  res.render("index",{
    title: "Wlcome My Website"
  })
});

//home route
app.get("/exercises/search/:bodypart", function (req, res) {
  Exercise.find({bodypart: req.params.bodypart}, function(err, exercises){
    if(err){
      console.log(err);
    }else {
      res.render('exercises/choice_exercise', {
        title: req.params.bodypart,
        exercises: exercises
      });
    }
  });
});

app.get("/center_list", function(req, res){
  Center.find({}, function(err, centers){
    if (err) {
      console.log(err);
    }else {
      res.render("centers/center_list", {
        title: 'Fitnesscenter',
        centers: centers
      });
    }
  });
});

app.get("/trainer_list", function(req, res){
  Trainer.find({}, function(err, trainers){
    if (err) {
      console.log(err);
    }else {
      res.render("trainers/trainer_list", {
        title: 'Trainer',
        trainers: trainers
      });
    }
  });
});

//Route files
let centers = require('./routes/centers');
let trainers = require('./routes/trainers');
let owners = require('./routes/owners');
let admin = require('./routes/admin');
let exercises = require('./routes/exercises');

app.use('/centers', centers);
app.use('/trainers', trainers);
app.use('/owners', owners);
app.use('/exercises', exercises);
app.use('/admin', admin);

//404 route
app.get("*", function(req, res){
  res.render("error", {
    title: '404'
  });
});

app.listen("3000", function(){
  console.log("Server is running on port: '3000'");
});
