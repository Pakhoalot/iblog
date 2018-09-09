const db = require('./db');
const mongoose = db.mongoose;

const categorySchema = new mongoose.Schema({
    // 分类名称
    CateName: { 
        type: String,
        required: true,
    },
    // 分类别名
    Alias: { 
        type: String,
        unique: true,
        required: true,
        lowercase: true,
    },
    // 图标地址
    Img: { type: String },

    // 链接地址
    Link: { type: String },
    //生成时间
    CreateTime: {
        type: Date,
        default: Date.now
    },
    //修改时间
    ModifyTime: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('category', categorySchema);
