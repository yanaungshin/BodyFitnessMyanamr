const mongoose = require('mongoose');

//Teacher Schema
const AdminSchema = mongoose.Schema({
  username:{
    type: String,
    required: true
  },
  type:{
    type: String,
    require: true
  },
  password:{
    type: String,
    required: true
  }
});

const Admin = module.exports = mongoose.model('Admin', AdminSchema);
