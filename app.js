var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var bitcoinRouter = require('./routes/bitcoin');

var app = express();
const serverUrl = `http://localhost:3000`;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Add headers before the routes are defined
app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', 'http://pepeadvgame.surge.sh');
  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);
  // Pass to next layer of middleware
  next();
});

app.use('/', indexRouter);
app.use('/bitcoin', bitcoinRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

const mapError = function(error) {
  let message = error.message;
  let type = error.name
  let code = error.code;
  let status = error.status;
  
  switch (error.message) {
    case 'Invalid checksum':
    case 'Invalid signature length':
    case 'The first argument must be of type string or an instance of Buffer, ArrayBuffer, or Array or an Array-like Object. Received undefined':
      type = "INVALID_ARGUMENT"
      code = 1000200;
      status = 400;
      break;
    default:
      if (app.get('env') !== 'development') {
        message = "An error occurred";
        type = "UNKNOWN_ERROR";
        code = 9999999;
      }
  }

  return { 
    message: message,
    type: type,
    code: code,
    status: status
  }
}
// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // send error
  console.log(err)
  const errorMapped = mapError(err)
  //res.status(err.status || 500).json(
  res.status(errorMapped.status || 500).json(
    {
      error: { 
        message: errorMapped.message,
        type: errorMapped.type,
        code: errorMapped.code,
        trace_id: 1,
        help_url: `${serverUrl}/docs/error/${errorMapped.type}#${errorMapped.code}`
      }
    });

  // render the error page
  //res.status(err.status || 500);
  //res.render('error');
});

module.exports = app;
