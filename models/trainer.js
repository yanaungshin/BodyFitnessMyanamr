let mongoose = require('mongoose');

//Article Schema
const trainerSchema = mongoose.Schema;
const TrainersSchema = new trainerSchema({
  trainername:{
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
  email:{
    type: String,
    required: true
  },
  age:{
    type: String,
    required: true
  },
  certificate:{
    type: [String]
  },
  trainerfees:{
    type: String,
    required: true
  },
  traphoto:{
    type: String
  },
  gym:{
    type: String
  },
  classes:{
    type: [String]
  },
  author:{
    type: String,
    required: true
  },
  trainfo:{
    type: [String]
  },
});
TrainersSchema.virtual('classes_name').get(function(){
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

TrainersSchema.virtual('trainfo_name').get(function(){
  var arr =[];
  for(var i in this.trainfo ) {
    switch (this.trainfo[i]) {
      case '1':
        arr.push('Industry switchkill');
        break;
      case '2':
        arr.push('Ennergy and Commitement');
        break;
      case '3':
        arr.push('Personal');
        break;
      case '4':
        arr.push('Demonstrable passion');
        break;
      case '5':
        arr.push('NSCA');
        break;
      default:

    }
  }
  return arr;
})

let Trainer = module.exports = mongoose.model('Trainer', TrainersSchema);
