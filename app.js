var express = require('express');
var path = require('path');
var fs = require('fs');
var debug = require('debug')('enviousonline');

//var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');
var ws_handler = require('./ws_handler.js');

var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/eonline');

var app = express();

// Set port for Express and Socket.io
app.locals.port = 3000;
if (fs.existsSync(path.join(__dirname, 'config.js')))
    app.locals.port = require(path.join(__dirname, 'config')).port || 3000;
app.set('port', app.locals.port);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// required for db access
app.use(function(req, res, next) {
    req.db = db;
    next();
});

//app.locals.basedir = config.user;
//app.locals.port = require('./config2').port || 3000;

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

var server = app.listen(app.get('port'), function() {
  debug('Express server listening on port ' + server.address().port);
});

// IO handler
var io = require('socket.io').listen(server);

io.sockets.on('connection', function(socket) {
    console.log('Connection Established');
    ws_handler.init(io, socket, db);
});
