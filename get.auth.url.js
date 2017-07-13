'use strict';

var google = require('googleapis');
var OAuth2Client = google.auth.OAuth2;
var plus = google.plus('v1');
var CLIENT_ID = '80946248974-usm5tioi12k6pf6t48epj8cri5bp9jo7.apps.googleusercontent.com';
var CLIENT_SECRET = '93EUQObT0Q8lahP_319Xzvwe';
var REDIRECT_URL = 'http://localhost:8080/main';
var oauth2Client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URL);
module.exports.oauth2Clien = oauth2Client;
module.exports.plus = plus;

var scopes = [
  'https://www.googleapis.com/auth/admin.directory.user.readonly',
  'https://www.googleapis.com/auth/admin.directory.userschema.readonly',
  'profile', 'email', 'openid'
];

module.exports.url = oauth2Client.generateAuthUrl({
  // 'online' (default) or 'offline' (gets refresh_token)
  access_type: 'offline',

  // If you only need one scope you can pass it as a string
  scope: scopes,
  hd : "cronj.com",
  prompt : 'select_account'
});