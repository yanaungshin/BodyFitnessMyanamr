let mongoose = require('mongoose');
var dateformat = require('dateformat');

//Article Schema
const centerSchema = mongoose.Schema;
const NewsSchema = new centerSchema({
  centername:{
    type: String,
    required: true
  },
  city:{
    type: String,
    required: true
  },
  address:{
    type: String,
    required: true
  },
  phone:{
    type: String,
    required: true
  },
  opttime:{
    type: String,
    required: true
  },
  closetime:{
    type: String,
    required: true
  },
  memberfees:{
    type: String,
    required: true
  },
  dailymemberfees:{
    type: String,
    required: true
  },
  yearmemberfees:{
    type: String,
    required: true
  },
  artphoto:{
    type: String
  },
  classes:{
    type: [String]
  },
  promotion:{
    type: [String]
  },
  discount:{
    type: String,
  },
  author:{
    type: String,
    required: true
  },
  otinfo:{
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
NewsSchema.virtual('updated_date').get(function(){
  return dateformat(this.updated, 'dd/mm/yyyy. HH:MM');
});
NewsSchema.virtual('classes_name').get(function(){
  var arr =[];
  for(var i in this.classes ) {
    switch (this.classes[i]) {
      case '1':
        arr.push('Yoga');
        break;
      case '2':
        arr.push('KickBoxing');
        break;
      case '3':
        arr.push('Personal Training');
        break;
      case '4':
        arr.push('Zumba');
        break;
      case '5':
        arr.push('Kilocycle');
        break;
      case '6':
        arr.push('barre-less-barre');
        break;
      case '7':
        arr.push('Cardio funk dance party');
        break;
      default:

    }
  }
  return arr;
})

NewsSchema.virtual('classes_name').get(function(){
  var arr =[];
  for(var i in this.classes ) {
    switch (this.classes[i]) {
      case '1':
        arr.push('Yoga');
        break;
      case '2':
        arr.push('KickBoxing');
        break;
      case '3':
        arr.push('Personal Training');
        break;
      case '4':
        arr.push('Zumba');
        break;
      case '5':
        arr.push('Kilocycle');
        break;
      case '6':
        arr.push('barre-less-barre');
        break;
      case '7':
        arr.push('Cardio funk dance party');
        break;
      default:

    }
  }
  return arr;
})

let Center = module.exports = mongoose.model('Center', NewsSchema);
