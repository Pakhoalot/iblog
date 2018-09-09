const db = require('./db');
const mongoose = db.mongoose;

//定义一个标题Schema
const postSchema = new mongoose.Schema({
    //标题
    Title: { 
        type: String,
        required: true
     },
    //摘要
    Summary: { type: String },
    //来源
    Source: { type: String },
    //内容
    Content: { type: String },
    //内容类型：默认空 (html)，可选markdown
    ContentType: { type: String },
    //分类Id
    CategoryAlias: { type: String },
    //标签
    Labels: { type: [String] },
    //外链Url
    Url: { type: String },
    //浏览次数
    ViewCount: { 
        type: Number,
        default: 0
    },
    //是否草稿
    IsDraft: { type: Boolean },
    //是否有效
    IsActive: { type: Boolean, default: true },
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

//添加方法


module.exports = mongoose.model('post', postSchema);