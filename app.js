const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const morgan = require('morgan');
const logger = require('./utility/logger');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
//include handlebars
const exphbs  = require('express-handlebars');
//****************路由设置***********************//
const routes = require('./routes/index');
const categoryApi = require('./routes/category');
const postApi = require('./routes/post');
const articleRoutes = require('./routes/article')
const editRoutes = require('./routes/edit');
/* ******************************************* */
const app = express();

const env = process.env.NODE_ENV || 'development';
app.locals.ENV = env;
app.locals.ENV_DEVELOPMENT = env == 'development';

// view engine setup
//use handlebars as default
app.engine('handlebars', exphbs({
    defaultLayout: 'main',
    partialsDir: ['views/partials/']
  }));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');

/* ********************use middleware*************************** */
app.use(favicon(__dirname + '/public/img/favicon.ico'));
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));
/* *********************routes********************************* */
app.use('/', routes);
app.use('/article', articleRoutes);
app.use('/edit', editRoutes);
app.use('/api/category', categoryApi);
app.use('/api/post', postApi);
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
