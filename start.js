var express = require('express')
var MongoClient=require('mongodb').MongoClient;
 var app = express()
 app.use(express.static('public'))
 var path= require('path')
 var bodyParser = require('body-parser')
 app.use(bodyParser.urlencoded({extended: false}))

  app.get('/home', function(req, res){
 	res.sendFile(path.join(path.join(__dirname, '/public', 'login.html')))
 			})
  app.get('/main', function(req, res){
 	res.sendFile(path.join(path.join(__dirname, '/public', 'main.html')))
 			})
  app.get('/apply', function(req, res){
 	res.sendFile(path.join(path.join(__dirname, '/public', 'apply.html')))
 			})
  app.get('/admin', function(req, res){
 	res.sendFile(path.join(path.join(__dirname, '/public', 'admin.html')))
 			})
  app.get('/view', function(req, res){
 	res.sendFile(path.join(path.join(__dirname, '/public', 'view.html')))
 			})
 app.listen(3000, function(req, res){
 	console.log('Server running...')
 })