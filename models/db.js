const dbPath = require('../config/db-config').mongoUrl;
const mongoose = require('mongoose');
const extend = require('mongoose-schema-extend');
const i18n = require('./i18n');


//建立连接
mongoose.connect(dbPath || 'mongodb://localhost/blogrift');
const db = mongoose.connection;
db.on('error', err=>{
    console.error(i18n.__('error.db_1') + err);
    process.exit(1);
});


//建立基础schema
const base = new mongoose.Schema({
    id: {
        type: String,
        unique: true
    },
    CreateTime: {
        type: Date
    },
    ModifyTime: {
        type: Date
    }
});

exports.mongoose = mongoose;
exports.base = base;