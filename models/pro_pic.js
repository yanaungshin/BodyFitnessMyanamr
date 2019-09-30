let mongoose = require('mongoose');

//Profile Pic Schema
let profleSchema = mongoose.Schema({
  author:{
    type: String,
    required: true
  },
  propic:{
    type: String,
    required: true
  }
});

let Profile = module.exports = mongoose.model('Profile', profleSchema);
