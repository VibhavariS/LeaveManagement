"use strict";

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.Promise = global.Promise

// Define model
var UserSchema = function(data){
    this.data=data;
}

var UserSchema = new Schema({
    _id : {
      type : String
    },
    firstLogin  : {
        type : Date,
        default : Date.now
    },
    refreshToken : {
        type : String
    }
});

// Statics/Class methods
UserSchema.statics = {

  //get user by email
    getUser : function(email){
        return this.findOne()
        .where('_id').equals(email)
        exec();
    }
}


//module.exports=UserSchema;
exports.User = mongoose.model('User', UserSchema);
