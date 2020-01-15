/**
* Enviroment Variables Setup
*/
require('dotenv').config();

/**
* Dependencies
*/
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const createError = require('http-errors');
const exphbs = require('express-handlebars');
const express = require('express');
const firebase = require('firebase');
const flash = require('express-flash');
const logger = require('morgan');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const path = require('path');
const sassMiddleware = require('node-sass-middleware');
const session = require('express-session');
const schedule = require('node-schedule');

/**
* Firebase Setup
*/
const config = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.FIREBASE_DATABASE_URL,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID
};
firebase.initializeApp(config);

/**
* Mongoose Setup
*/
mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${process.env.MONGO_SERVER}/${process.env.MONGO_DATABASE}?${process.env.MONGO_OPTIONS}`, { useNewUrlParser: true }).then(() => {
  console.log('Database connected.');
  }).catch((error) => {
    console.log('Database connection failed!');
    console.log(error);
  });

  /**
  * Add Routes here
  */
  const indexRouter = require('./routes/index');

  /**
  * Application Initialization
  */
  const app = express();

  // View Engine Setup
  app.engine('hbs', exphbs({
    defaultLayout: 'layout',
    extname: '.hbs',
    partialsDir: 'views/partials',
    helpers: {
      // Here we're declaring the #section that appears in layout/layout.hbs
      section(name, options) {
        if (!this._sections) this._sections = {};
        this._sections[name] = options.fn(this);
        return null;
      },

      ifNotEq(v1, v2, options) {
        if (v1 !== v2) {
          return options.fn(this);
        }
        return options.inverse(this);
      },

      compare(lvalue, rvalue, options) {
        if (arguments.length < 3) {
          throw new Error("Handlerbars Helper 'compare' needs 2 parameters");
        }

        const operator = options.hash.operator || '==';
        const operators = {
          '==': function(l, r) { return l == r; },
          '===': function(l, r) { return l === r; },
          '!=': function(l, r) { return l != r; },
          '<': function(l, r) { return l < r; },
          '>': function(l, r) { return l > r; },
          '<=': function(l, r) { return l <= r; },
          '>=': function(l, r) { return l >= r; },
          'typeof': function(l, r) { return typeof l == r; }
        }
        if (!operators[operator]) {
          throw new Error(`Handlerbars Helper 'compare' doesn't know the operator ${operator}`);
        }
        const result = operators[operator](lvalue, rvalue);
        if (result) {
          return options.fn(this);
        }
        return options.inverse(this);
      },

      math(lvalue, operator, rvalue, options) {
        lvalue = parseFloat(lvalue);
        rvalue = parseFloat(rvalue);

        return {
          '+': lvalue + rvalue,
          '-': lvalue - rvalue,
          '*': (lvalue * rvalue).toFixed(2),
          '/': (lvalue / rvalue).toFixed(2),
          '%': lvalue % rvalue
        }[operator];
      }
    }
  }));
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'hbs');

  /**
  * Application Configuration
  */
  app.use(logger('dev'));
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.use(cookieParser());
  app.use(session({
    secret: 'some-private-cpe-key',
    resave: true,
    saveUninitialized: true,
    cookie: {
      maxAge: 3600000
    }
  }));
  app.use(sassMiddleware({
    src: path.join(__dirname, 'public'),
    dest: path.join(__dirname, 'public'),
    indentedSyntax: true, // true = .sass and false = .scss
    sourceMap: true
  }));
  app.use(methodOverride('_method'));
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(flash());

  /**
  * Routes Setup
  */
  app.use('/', indexRouter);

  /**
  * Error Handling
  */
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
    res.render('error', { title: 'Erro', layout: 'layoutError' });
  });

  module.exports = app;
