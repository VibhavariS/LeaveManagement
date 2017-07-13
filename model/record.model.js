"use strict";

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.Promise = global.Promise


var leaveRecord = function(data){
	this.data=data;
}

var leaveRecord = new Schema({

	email : String,
	name : String,
	join : Date,
	leaves : [{ from : Date, to : Date, reason : String, appliedOn : Date, approved : { type: String, enum: ['Pending', 'Approved', 'Disapproved'], default: 'Pending'}, approvedOn : Date }],
	leavesRemaining : Number
	
});

exports.Record = mongoose.model('Record', leaveRecord);