const dbPath = require('../config/db-config').mongoUrl;
const mongoose = require('mongoose');
const i18n = require('./i18n');
const logger = require('../utility/logger');

//建立连接
mongoose.connect(dbPath || 'mongodb://localhost:27017/blogrift',{ useNewUrlParser: true });
const db = mongoose.connection;
db.on('error', err => {
    logger.error(i18n.__('error.db_1') + err);
    process.exit(1);
});

exports.mongoose = mongoose;