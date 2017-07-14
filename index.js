var google = require('googleapis');

var OAuth2 = google.auth.OAuth2;
var CLIENT_ID = "490379597944-pigcng7tfb8hb199p0ppcoiiuh1mio6h.apps.googleusercontent.com";
var CLIENT_SECRET = "FC1VAUZ8lmVrsAuOcn87mvEU";
var REDIRECT_URL = 'http://emp-leave.herokuapp.com/main';
var GoogleAuth = require('google-auth-library');
var auth = new GoogleAuth;
var client = new auth.OAuth2(CLIENT_ID);
var mongoose = require("mongoose");
var User = require("./model/user.model.js");
var tokenService = require("./jwt.service.js");
var plus = require("./get.auth.url.js").plus;
var url = require('./get.auth.url.js').url;

var oauth2Client = new OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URL
);

var scopes = [
  'https://www.googleapis.com/auth/admin.directory.user.readonly',
  'https://www.googleapis.com/auth/admin.directory.userschema.readonly',
  'profile', 'email', 'openid'
];

var url = oauth2Client.generateAuthUrl({
  // 'online' (default) or 'offline' (gets refresh_token)
  access_type: 'offline',

  // If you only need one scope you can pass it as a string
  scope: scopes,
  hd : "cronj.com",
  prompt : 'select_account'
});

google.options({
  auth: oauth2Client
});


var idTokenVerification = (tokens, callback) => {
   oauth2Client.verifyIdToken(tokens, CLIENT_ID, (e, login) => {
    console.log('--inside verifyIdToken--');
        var payload = login.getPayload();
        var userid = payload['sub'];
        // If request specified a G Suite domain:
        var domain = payload['hd'];
        if(domain === "cronj.com") {
            
            //SAVE REFRESH TOKEN HERE (ONLY FIRST LOGIN CONTAIN REFRESH TOKEN)
            var refreshToken = tokens.refresh_token;
            /*
            * Now check if the user exists
            * If yes : attach token
            * If No : create user and attach token
            */
            let email = payload.email;
            let name = payload.name;
            User.User.getUser(email)
            .then(user => {
                console.log("get User");
                //Attach token in next then
                if(user){
                    return user;
                }else{
                    //create user
                    let newUser = new User.User();
                    newUser._id = email;
                    newUser.refreshToken = refreshToken;
                    console.log(refreshToken);
                    return newUser.save();
                }
            })
            .then(user => {
                let jwtToken = tokenService.signToken(user._id, name);
                callback(null, jwtToken, tokens);
                console.log('Callback done');

            })
            .catch(err => {
                console.log(err);
                callback("INTERNAL_ERROR");
            });
        }
        else {
            callback("INVALID_DOMAIN");
        }
    });
}
module.exports.login=idTokenVerification;