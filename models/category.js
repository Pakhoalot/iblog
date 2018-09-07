const db = require('./db');
const mongoose = db.mongoose;
const base = db.base;
const extend = require('mongoose-schema-extend');


const categorySchema = base.extend({
    // 分类名称
    CateName: { 
        type: String,
        required: true,
        unique: true,
    },

    // 分类别名
    Alias: { 
        type: String,
        required: true,
        unique: true,
    },

    // 图标地址
    Img: { type: String },

    // 链接地址
    Link: { type: String }
});

module.exports = mongoose.model('category', categorySchema);
