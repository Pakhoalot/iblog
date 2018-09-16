const db = require('./db');
const mongoose = db.mongoose;

//定义一个标题Schema
const postSchema = new mongoose.Schema({
    //标题
    title: { 
        type: String,
        required: true
     },
    //摘要
    summary: { type: String },
    //来源
    source: { type: String },
    //内容
    content: { type: String },
    //内容类型：默认空 (html)，可选markdown
    contentType: { type: String },
    //分类Id
    categoryName: { type: String },
    //标签
    labels: { type: [String] },
    //外链Url
    url: { type: String },
    //浏览次数
    viewCount: { 
        type: Number,
        default: 0
    },
    author: {
        type: String,
    },
    //是否草稿
    isDraft: { type: Boolean },
    //是否有效
    isActive: { type: Boolean, default: true },
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

//添加方法


module.exports = mongoose.model('post', postSchema);