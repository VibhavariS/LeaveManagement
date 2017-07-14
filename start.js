var express = module.exports = require('express')
var app = express();
var idTokenVerification = require('./index')
var port = process.env.PORT || 8080;
var path = require('path')
var service = require('./jwt.service')
var bodyParser = require('body-parser')
var moment = require('moment');
var cookieParser = require('cookie-parser');
var session = require('express-session');
moment().format();

app.set('view engine', 'html');
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({ secret: "Your secret key" }));

var mongoose = require("mongoose");
var Record = require("./model/record.model.js");
var email;
var monogoURI = process.env.MONGODB_URI || 'mongodb://localhost/empdb';
mongoose.connect(monogoURI);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error: '));
db.once('open', function() {

    function checkSignIn(req, res, next) {
        if (req.session.user) {
            next(); //If session exists, proceed to page
        } else {
            var err = new Error("Not logged in!");
            res.redirect('/home');
            //next(err);  //Error, trying to access unauthorized page!
        }
    }

    app.post('/login', function(req, res) {

        idTokenVerification.login(req.body.id_token, function(err, jwtToken, tokens) {
            if (err) {
                res.send("Failed");
                console.log(err);
            } else {
                req.session.user = jwtToken;
                res.send({ redirect: '/main' });
            }
        })
    })

    app.post('/apply', function(req, res) {
        console.log("--apply token--");
        email = req.body.email;
        from = req.body.start;
        to = req.body.end;
        reason = req.body.reason;
        name = req.body.name;
        var diffDays = 0;
        for (var m = moment(from); m.isSameOrBefore(to); m.add(1, 'days')) {
            if ((moment(m).day()) != (0) && moment(m).day() != (6)) {
                diffDays += 1
            }
        }
        var leave = { 'from': from, 'to': to, 'reason': reason, 'appliedOn': Date.now(), 'approved': 'Pending' };
        var query = Record.Record.findOne({ 'email': email }, function(err, result) {

            if (err) {
                console.log(err);
            }

            if (!result) {
                var newRecord = new Record.Record({
                    email: email,
                    leaves: leave,
                    name: name,
                    leavesRemaining: 20,
                });
                console.log('new');
                console.log(newRecord);
                newRecord.save();
            } else {
                console.log('update');
                var q = Record.Record.findOneAndUpdate({ 'email': email }, { $push: { 'leaves': leave } }, function(err) {
                    if (err) {
                        console.log(err);
                    }
                });
            }
        })
    });



    app.use('/view', function(err, req, res, next) {
        console.log(err);
        //User should be authenticated! Redirect him to log in.
        res.redirect('/home');
    });


    app.use('/main', function(err, req, res, next) {
        console.log(err);
        //User should be authenticated! Redirect him to log in.
        res.redirect('/home');
    });

    app.get('/', function(req, res) {
        res.sendFile(path.join(__dirname, '/public/html', 'login.html'))
    })

    app.get('/home', function(req, res) {
        res.sendFile(path.join(__dirname, '/public/html', 'login.html'))
    })
    app.get('/main', checkSignIn, function(req, res) {
        res.sendFile(path.join(__dirname, '/public/html', 'main.html'));
    })

    app.get('/destroy', function(req, res) {
        req.session.destroy(function(err) {
            if (err) {
                console.log(err);
            }
        });
        console.log("Session destroyed");
    })

    app.get('/getLr', function(req, res) {
        var email = req.query.email;
        var lr;
        var join = req.query.doj;
        var new_date = moment(join).add(1, 'minute');
        for (i = 1;
            (moment().isAfter(new_date)); i++) {
            new_date = moment(join).add(i, 'years');
        }
        new_date = moment.utc(new_date).format('L')

        Record.Record.findOne({ 'email': email }, { 'leavesRemaining': 1, _id: 0 }, function(err, result) {
            if (err) {
                console.log(err);
            }
            if (!result) {
                res.send({ lrr: '20', nd: new_date });
            } else {
                var r = result['leavesRemaining'];
                lr = r.toString();
                res.send({ lrr: lr, nd: new_date });
            }
        });
    })
    app.get('/apply', checkSignIn, function(req, res) {
        res.sendFile(path.join(__dirname, '/public/html', 'apply.html'))
    })

    app.get('/admin', checkSignIn, function(req, res) {
        res.sendFile(path.join(__dirname, '/public/html', 'admin.html'))
    })

    app.get('/view', checkSignIn, function(req, res) {
        res.sendFile(path.join(__dirname, '/public/html', 'view.html'))
    })

    app.get('/getNames', function(req, res) {
        Record.Record.find({}, { 'name': 1, _id: 0 }, function(err, result) {
            if (err) {
                console.log(err);
            }
            if (!result) {
                console.log("No leave to approve/dissaprove");
            } else {
                res.send(result);
            }

        })
    })

    app.get('/getData', function(req, res) {
        var email = req.query.email;
        Record.Record.find({ 'email': email }, function(err, docs) {
            if (err) {
                return next(err);
            }
            if (docs != null) {
                docs.forEach(function(docs, index) {});
                res.send(docs);
            } else {
                console.log('No leave to display');
            }
        })
    })

    app.get('/getData2', function(req, res) {
        var name = req.query.name;
        Record.Record.find({ 'name': name }, function(err, docs) {
            if (err) {
                return next(err);
            }
            if (docs != null) {
                docs.forEach(function(docs, index) {});
                res.send(docs);
            } else {
                console.log('No leave to display');
            }
        })
    })

    app.post('/approve', function(req, res) {
        var name = req.body.name;
        from = req.body.from;
        to = req.body.to;
        var diffDays = 0;
        for (var m = moment(from); m.isSameOrBefore(to); m.add(1, 'days')) {
            if ((moment(m).day()) != (0) && moment(m).day() != (6)) {
                diffDays += 1
            }
        }
        Record.Record.findOneAndUpdate({ 'name': name, 'leaves.from': from, 'leaves.to': to }, { $set: { 'leaves.$.approved': 'Approved' }, $inc: { 'leavesRemaining': -diffDays } }, function(err) {
            if (err) {
                console.log(err);
            } else {
                console.log("approve update done");
            }
        })
        res.send('done');
    })

    app.post('/disapprove', function(req, res) {
        var name = req.body.name;
        var from = req.body.from;
        Record.Record.findOneAndUpdate({ 'name': name, 'leaves.from': from }, { $set: { 'leaves.$.approved': 'Disapprove' } }, function(err) {
            if (err) {
                console.log(err);
            } else {
                console.log("Disapprove update done");
            }
        })
        res.send('done');
    })

    app.post('/viewAll', function(req, res) {

        Record.Record.aggregate([
            // Get just the docs that contain a shapes element where color is 'red'
            { $match: { 'leaves.approved': 'Pending' } }, {
                $project: {
                    leaves: {
                        $filter: {
                            input: '$leaves',
                            as: 'leave',
                            cond: { $eq: ['$$leave.approved', 'Pending'] }
                        }
                    },
                    _id: 1,
                    name: 1,
                    leavesRemaining: 1
                }
            }
        ], function(err, docs) {
            if (err) {
                console.log(err);
                res.status(301).send("Error");
            }
            console.log(docs[0].leaves);
            res.send(docs);
        })
    })
    app.listen(port, function(req, res) {
        console.log('Server running...')
    })
})
