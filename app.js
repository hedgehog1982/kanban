var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');
var bodyParser = require('body-parser');
var nodemailer = require('nodemailer');

var dotenv = require('dotenv').config();

var currentJSON = {} 
var currentBoards = {}
var currentCards = {}
var archivedCards = {}


//for IO
var http = require('http').Server(app);
var io = require('socket.io')(http);

//For SOCKET.io
io.on('connection', function(socket){
  console.log('a user connected on ', socket.id);
  socket.emit("LOAD",{currentJSON, currentBoards, currentCards})

  //on update but dont broadcast to sender as they already have the changes
  socket.on("CHANGE", function(msg){
    currentJSON = msg.kanbanStructure
    currentBoards = msg.kanbanBoards
    currentCards = msg.kanbanCards
    console.log(currentCards, currentBoards)
    socket.broadcast.emit("LOAD",{currentJSON, currentBoards, currentCards})
  });

});


//setup node mailer optiopns
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'black.bean.coffee.house01@gmail.com',
      pass: process.env.EMAIL_KEY
    }
  });

var passwordless = require('passwordless');
//var passwordless = require('../../');

var MongoStore = require('passwordless-mongostore');

var routes = require('./routes/index');

var app = express();

var pathToMongoDb = process.env.MONGODB_PATH;

// TODO: Path to be send via email
var host = 'http://localhost:3000/';

// Setup of Passwordless
passwordless.init(new MongoStore(pathToMongoDb));
passwordless.addDelivery(
    function(tokenToSend, uidToSend, recipient, callback) {
        var host = 'localhost:3000';
        var encoded = encodeURIComponent(uidToSend)

        var mailOptions = {
    from: "localhost:3000",
    to: recipient,
    subject: `Passwordless token` ,
    text: `Hello!\nAccess your account here: http://${host}?token=${tokenToSend}&uid=${encoded}`
  };

  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
        callback(error)
      console.log(error);
    } else {
        callback(null)
      console.log('Email sent: ' + info.response);
    }
  })

});



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Standard express setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(expressSession({secret: '42', saveUninitialized: false, resave: false}));
app.use(express.static(path.join(__dirname, 'public')));

// Passwordless middleware
app.use(passwordless.sessionSupport());
app.use(passwordless.acceptToken({ successRedirect: '/' }));

// CHECK /routes/index.js to better understand which routes are needed at a minimum
app.use('/', routes);

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// development error handler
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: err
    });
});


http.listen(8080, "127.0.0.1")  //socket io listening
app.set('port', process.env.PORT || 3000);

var server = app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + server.address().port);
});
