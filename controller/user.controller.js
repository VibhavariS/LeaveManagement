"use strict";

var mongoose = require("mongoose");
var User = mongoose.model("User");

exports.getMyEmail = (req, res) => {
    res.status(200).json({
        status : true,
        data : {
            email : req.user.email
        }
    });
}
