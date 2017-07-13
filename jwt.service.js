"use strict";

var jwt = require('jsonwebtoken');
//var strings = require("../config/strings.js");
var secretPassword = "JWT-secret-by-rahul-amandeep";

exports.signToken = (email, name) => {

  // sign token with email.
  var info = {
    email : email,
    name : name,
    sub : "jwt-session"
  };
  //return token
  return jwt.sign(info, secretPassword, {
    expiresIn: 12 * 60 * 60 * 5
  });
}

//verifies the token, calls next()
exports.jwtToken = (req, res, next) => {
  //req contains the token that will be verified
  return verifyJwtToken(req.headers.authorization, (error,verifiedToken) => {
    if(error){
      res.json({
          status : false,
          message : "strings.JWT_FAILURE"
      });
      return false;
    }else{
      //token verified
      //decode to get payload object
      var data = jwt.decode(req.headers.authorization);
      // add decoded data to req obj for further use
      req.user = data;
      next();
    }
  });
}

var verifyJwtToken = (token,callBack) => {
  try {
    // verify the token
    var verifiedToken = jwt.verify(token, secretPassword);
    return callBack(null,verifiedToken);
  } catch(err) {
    return callBack(err);
  }
}
