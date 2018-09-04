const express = require('express');
const router = express.Router();
const async = require('async');
const category = require('../proxy/category');
const tool = require('../utility/tool');
//分类页面
router.get('/:category?', (req, res, next)=>{
    const currentCate = req.params.category || '';
    async.parallel([
        function (cb) {
            tool.getConfig(path.join(__dirname, '../config/settings.json'), (err, settings)=>{
                if(err) {
                    cb(err);
                } else {
                    cb(null, settings);
                }
            });
        },
        //获取分类
        function (cb) {
            category.getAll((err, categories)=>{
                if(err) {
                    cb(err);
                } else {
                    cb(null, categories);
                }
            });
        }
    ], (err, result)=>{
        if(err){
            next(err);
        } else {
            let settings = result[0];
            let categories = result[1];
            let cate = tool.jsonQuery(categories, {
                Alias: currentCate
            });
            if(cate || !currentCate || currentCate === 'other') {
                res.render('blog/index', {
                    cateData: categories,
                    settings,
                    title: settings.SiteName,
                    currentCate,
                    isRoot: false
                })
            } else {
                next();
            }
        }
    })
})

//获取文章数据
router.post('/getPosts', (req, res, next) => {
    async.parallel([
        //获取文章列表和文章页数
        function (cb) {
            async.waterfall([
                //1.根据分类alias获取分类对象
                function (cb) {
                    category.getByAlias(req.body.CateAlias, (err, category) => {
                        if(err) {
                            cb(err);
                        } else {
                            cb(null, category);
                        }
                    });
                },
                //2.传入分类对象查询文章
                function(category, cb) {
                    const params = {
                        cateId: category.__id,
                        pageIndex: req.body.PageIndex,
                        pageSize: req.body.PageSize,
                        sortBy: req.body.SortBy,
                        keyword: req.body.Keyword,
                        filterType: req.body.FilterType
                    };
                    async.parallel([
                        //文章列表
                        function (cb) {
                            post.getPosts(params, (err, data) => {
                                if(err) {
                                    cb(err);
                                } else {
                                    cb(null,data);
                                }
                            })
                        }
                    ])
                }

            ])
        }
    ])
})
