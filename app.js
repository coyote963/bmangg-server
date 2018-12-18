var express = require('express');
var path = require('path');
var passport = require('passport');
var bodyParser = require('body-parser');
var cors = require('cors');
var app = express();
var db = require('./db');

var auth = require('./auth/AuthController');
var PlayerController = require('./player/PlayerController');
var KillController = require('./kill/KillController');
var user = require('./routes/user');
var viewer = require('./playerviewer/PlayerViewerController');
let authenticateroute = require('./passport');

app.use(cors());
  
app.get('/', function(req, res, next) {
// Handle the get for this route
});

app.post('/', function(req, res, next) {
// Handle the post for this route
});

app.use('/kills',authenticateroute, KillController);
app.use('/players',authenticateroute, PlayerController);
app.use('/auth', auth);
app.use('/user', passport.authenticate('jwt', {session: false}), user);
app.use('/view', viewer)


app.use(express.static(__dirname + '/public'))
app.set('view engine', 'ejs')
app.get('/', (req, res) => res.render('pages/index'))
app.get('/about', (req, res)=> res.render("pages/about"))


module.exports = app;
