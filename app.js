var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');
var bodyParser = require('body-parser');
var nodemailer = require('nodemailer');
const http2 = require('spdy');
const fs = require('fs');

var dotenv = require('dotenv').config();

//var currentJSON = {}
var kanbanBoards = {};
var kanbanCards = {};
var archivedBoards = {};
var userList = {};
module.exports = { userList };

//for IO
var http = require('http').Server(app);
var io = require('socket.io')(http);

//setup node mailer optiopns
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'black.bean.coffee.house01@gmail.com',
        pass: process.env.EMAIL_KEY
    }
});

var passwordless = require('passwordless');

var MongoStore = require('passwordless-mongostore');

var routes = require('./routes/index');

var app = express();

var pathToMongoDb = process.env.MONGODB_PATH;

// TODO: Path to be send via email
var host = 'https://localhost:443/';

// set up a route to redirect http to https
var httpRedirect = require('http');
httpRedirect
    .createServer(function(req, res) {
        res.writeHead(301, {
            Location: 'https://' + req.headers['host'] + req.url
        });
        res.end();
    })
    .listen(80);

// Setup of Passwordless
passwordless.init(new MongoStore(pathToMongoDb));
passwordless.addDelivery(function(tokenToSend, uidToSend, recipient, callback) {
    var host = 'localhost';
    var encoded = encodeURIComponent(uidToSend);

    var mailOptions = {
        from: 'localhost',
        to: recipient,
        subject: `Passwordless token`,
        text: `Hello!\nAccess your account here: https://${host}?token=${tokenToSend}&uid=${encoded}`
    };

    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            callback(error);
            console.log(error);
        } else {
            callback(null);
            console.log('Email sent: ' + info.response);
        }
    });
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Standard express setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
    expressSession({ secret: '42', saveUninitialized: false, resave: false })
);
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

http.listen(8080, '127.0.0.1'); //socket io listening
app.set('port', process.env.PORT || 3000);

const server = http2
    .createServer(
        {
            key: fs.readFileSync('localhost-privkey.pem'),
            cert: fs.readFileSync('localhost-cert.pem')
        },
        app
    )
    .listen(443);

//For SOCKET.io
io.origins((origin, callback) => {
    if (origin !== 'https://localhost') {
        console.log('not allowed');
        return callback('origin not allowed', false);
    }
    callback(null, true);
});

io.on('connection', function(socket) {
    console.log('a user connected on ', socket.id);

    socket.emit('LOAD', {
        archivedBoards,
        kanbanBoards,
        kanbanCards,
        userList
    });

    //on update but dont broadcast to sender as they already have the changes
    socket.on('CHANGE', function(msg) {
        archivedBoards = msg.archivedBoards;
        kanbanBoards = msg.kanbanBoards;
        kanbanCards = msg.kanbanCards;
        userList = msg.userList;

        //console.log(currentCards, currentBoards);
        socket.broadcast.emit('LOAD', {
            archivedBoards,
            kanbanBoards,
            kanbanCards,
            userList
        });
    });

    socket.on('boardChange', function(msg) {
        console.log('board Change');
        console.log(msg);
        kanbanBoards[msg.id] = msg.data;
        //just transmit the lot until I've fixed it
        //console.log(currentCards, currentBoards);
        socket.broadcast.emit('boardChange', msg);
    });

    socket.on('cardChange', function(msg) {
        console.log('card Change');
        console.log(msg);
        kanbanCards[msg.id] = msg.data;

        //just transmit the lot until I've fixed it
        //console.log(currentCards, currentBoards);
        socket.broadcast.emit('cardChange', msg);
    });
});
