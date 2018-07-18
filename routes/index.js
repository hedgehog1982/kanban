var express = require('express');
var router = express.Router();

var passwordless = require('passwordless');

var appFile = require('../app.js') // for accessing my variables

//setup of databases
let DatabaseFile = require ("../dbs/index" )
let saveUser = DatabaseFile.saveUser


/* GET home page. */
router.get('/', function(req, res) {
    res.render('index', { user: req.user });
});

router.get('/index.html', function(req, res) {
    res.render('index', { user: req.user });
});

/*GET kanban page. */
router.get(
    '/kanban',
    passwordless.restricted({ failureRedirect: '/login' }),
    function(req, res) {
			if (!(req.user in appFile.userList)){
                appFile.userList[req.user] = {}
                saveUser(req.user)
            }
            
        res.render('kanban', { user: req.user});
    }
);

/* GET restricted site. */
router.get(
    '/restricted',
    passwordless.restricted({ failureRedirect: '/login' }),
    function(req, res) {
        res.render('restricted', { user: req.user });
    }
);

/* GET login screen. */
router.get('/login', function(req, res) {
    res.render('login', { user: req.user });
});

/* GET logout. */
router.get('/logout', passwordless.logout(), function(req, res) {
    res.redirect('/');
});

/* POST login screen. */
router.post(
    '/sendtoken',
    passwordless.requestToken(
        // Simply accept every user
        function(user, delivery, callback) {
            callback(null, user);
        }
    ),
    function(req, res) {
        res.render('sent', { user: req.user });
    }
);

module.exports = router;
