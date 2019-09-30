const mongoose = require('mongoose');

//Teacher Schema
const OwnerSchema = mongoose.Schema({
  name:{
    type: String,
    required: true
  },
  email:{
    type: String,
    required: true
  },
  username:{
    type: String,
    required: true
  },
  type:{
    type: String,
    required: true
  },
  password:{
    type: String,
    required: true
  }
});

const Owner = module.exports = mongoose.model('Owner', OwnerSchema);
