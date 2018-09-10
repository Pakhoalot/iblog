const dbPath = require('../config/db-config').mongoUrl;
const mongoose = require('mongoose');
const logger = require('../utility/logger');

//建立连接
mongoose.connect(dbPath || 'mongodb://localhost:27017/blogrift',{ useNewUrlParser: true });
const db = mongoose.connection;
db.on('error', err => {
    logger.error("database connect fail");
    process.exit(1);
});

exports.mongoose = mongoose;