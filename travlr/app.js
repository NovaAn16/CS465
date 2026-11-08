
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var handlebars = require('hbs');

// Initialize MongoDB and register Mongoose models FIRST
require('./app_api/models/db');

// Website routes
var indexRouter = require('./app_server/routes/index');
var usersRouter = require('./app_server/routes/users');
var travelRouter = require('./app_server/routes/travel');

// Module 5 - RESTful API routes
var apiRouter = require('./app_api/routes/index');

var app = express();

// View engine setup
app.set('views', path.join(__dirname, 'app_server', 'views'));

// Register Handlebars partials
handlebars.registerPartials(
    path.join(__dirname, 'app_server', 'views', 'partials')
);

app.set('view engine', 'hbs');

// Middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Website routes
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/travel', travelRouter);

// Module 5 - RESTful API routes
app.use('/api', apiRouter);

// Catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// Error handler
app.use(function(err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error =
        req.app.get('env') === 'development' ? err : {};

    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
