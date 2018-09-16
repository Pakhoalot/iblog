const db = require('./db');
const mongoose = db.mongoose;

const categorySchema = new mongoose.Schema({
    // 分类名称
    categoryName: { 
        type: String,
        required: true,
        unique: true,
    },
    // 图标地址
    img: { type: String },

    // 链接地址
    link: { type: String },
    //生成时间
    createTime: {
        type: Date,
        default: Date.now
    },
    //修改时间
    modifyTime: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('category', categorySchema);
