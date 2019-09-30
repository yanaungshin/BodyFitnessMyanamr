const LocalStrategy = require('passport-local').Strategy;
const Owner = require('../models/owner');
const Admin = require('../models/admin');
const config = require('../config/database');
const bcrypt = require('bcryptjs');

module.exports = function(passport){
  passport.use('admin' , new LocalStrategy(function(username, password, done){
    //Match username
    let query = {username:username};
    Admin.findOne(query, function(err, admin){
      console.log(query);
      if(err) throw err;
      if(!admin){
        return done(null, false, {message: 'No Admin Found'});
      }

      //Match Password
      bcrypt.compare(password, admin.password, function(err, isMatch){
        if(err) throw err;
        if(isMatch){
          return done(null, admin);
        } else {
          return done(null, false, {message: 'Wrong password'});
        }
      });
    });
  }));
  // Local Strategy
  passport.use(new LocalStrategy(function(username, password, done){
    //Match username
    let query = {username:username};
    Owner.findOne(query, function(err, owner){
      if(err) throw err;
      if(!owner){
        return done(null, false, {message: 'No Owner Found'});
      }

      //Match Password
      bcrypt.compare(password, owner.password, function(err, isMatch){
        if(err) throw err;
        if(isMatch){
          return done(null, owner);
        } else {
          return done(null, false, {message: 'Wrong password'});
        }
      });
    });
  }));

  passport.serializeUser(function(entity, done) {
    done(null, { id: entity.id, type: entity.type });
  });



  passport.deserializeUser(function(obj, done){
    switch (obj.type) {
      case 'owner':
        Owner.findById(obj.id, function(err, owner){
          done(err, owner);
        });
        break;
      case 'admin':
        Admin.findById(obj.id, function(err, admin){
          done(err, admin);
        });
        break;
      default:
        done(new Error('no entity type:', obj.type), null);
        break;
    }
  });
}
