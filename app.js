const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const morgan = require('morgan');
//include handlebars
const exphbs = require('express-handlebars');
const logger = require('./utility/logger');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const session = require('express-session');
const passport = require('passport');
require('./utility/passport-extension');
const flash = require('connect-flash');
//****************路由设置***********************//
const routes = require('./routes/index');
const categoryApi = require('./routes/category');
const postApi = require('./routes/post');
const articleRoutes = require('./routes/article')
const editRoutes = require('./routes/edit');
const uploadRoutes = require('./routes/upload');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
/* ******************************************* */
const app = express();

const env = process.env.NODE_ENV || 'development';
app.locals.ENV = env;
app.locals.ENV_DEVELOPMENT = env == 'development';


/* ********************load view engine ***************/
app.engine('handlebars', exphbs({
  defaultLayout: 'main',
  partialsDir: ['views/partials/'],
  helpers: require('./utility/handlebars-helpers'),
}));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');

/* ********************use middleware*************************** */
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(session({
  secret: 'secret',
  cookie: {
    maxAge: 24 * 60 * 60 * 1000
  },
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(__dirname + '/public/img/favicon.ico'));
app.use(morgan('dev'));


/* *********************routes********************************* */
app.use('/', routes);
app.use('/article', articleRoutes);
app.use('/edit', passport.ensureLoggedIn({redirectTo:'/login'}), editRoutes);
app.use('/upload', uploadRoutes);
app.use('/api/category', categoryApi);
app.use('/api/post', passport.ensureAuthorized(), postApi);
app.use('/', authRoutes);
app.use('/admin', adminRoutes);
/* *********************routes********************************* */



/// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err,
      title: err.message,
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {},
    title: err.message
  });
});

module.exports = app;
