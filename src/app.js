const express = require('express');
const mongoose = require('mongoose');
const logger = require('morgan');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const passport = require ('passport');


// The first version of the route ..
const v1 = require('./routes/v1');

const app = express();

// DB Config ...
mongoose.connect(
  process.env.MONGODB_URL,
  {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
  }
);

mongoose.connection.on('connected', () => {
  console.log('Connected to the database ..');
});

mongoose.connection.on('error', err => {
  console.error(`Field to connected to database: ${err}`);
});


// Middlewares ...
app.use(logger('dev'));

app.use(helmet());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended : true}));

app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(passport);

// Routes ...
app.use('/api/v1', v1);


// Errors ...

// 404 Not Found .. 
app.use((req, res, next) => {
  var err = new Error('Not Found Directory');
  err.status = 404;
  next(err);
});

// errors handling ..
app.use((err, req, res, next) => {
  const status = err.status || 500 ;
  const error = err.message || 'Error processing your request' ;

  res.status(status).json({ error });
});


module.exports = app ;