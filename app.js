const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const mongoose = require('mongoose');
const models = require('./public/Models/User');
const passport = require('./public/config/passport');


const indexRouter = require('./routes/index');


const app = express();


// Setup app
app.set('view engine', 'pug');


// Setup database
const mongoUri = 'mongodb://127.0.0.1/db1';
mongoose.connect(mongoUri);
mongoose.set('debug', true);
const db = mongoose.connection;
db.on('error', (err) => {
  if (err) {
    db.db.close();
    mongoose.connect(mongoUri);
  }
});
db.once('open', () => {
});


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);


// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
