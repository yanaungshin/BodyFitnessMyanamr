let mongoose = require('mongoose');
var dateformat = require('dateformat');

//Article Schema
const exerciseSchema = mongoose.Schema;
const ExerciseSchema = new exerciseSchema({
  exercisename:{
    type: String,
    required: true
  },
  bodypart:{
    type: String,
    required: true
  },
  exephoto:{
    type: String
  },
  exeinfo:{
    type: String,
    required: true
  },
  inserted:{
    type: Date,
    default: Date.now
  },
  updated:{
    type: Date,
    default: Date.now
  }
});
ExerciseSchema.virtual('updated_date').get(function(){
  return dateformat(this.updated, 'dd/mm/yyyy. HH:MM');
});

let Exercise = module.exports = mongoose.model('Exercise', ExerciseSchema);
