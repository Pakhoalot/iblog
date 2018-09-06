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
                        },
                        //文章页数
                        function (cb) {
                            post.getPageCount(params, (err, data) => {
                                if(err){
                                    cb(err);
                                } else {
                                    cb(null, data);
                                }
                            })
                        }
                    ], (err, results) => {
                        if(err) {
                            cb(err);
                        } else {
                            cb(null, results);
                        }
                    });
                }

            ], (err, result) => {
                if(err) {
                    cb(err);
                } else {
                    cb(null, result);
                }
            });
        },

        //获取分类
        function (cb) {
            category.getAll((err, data) => {
                if(err) {
                    cb(err)
                } else {
                    cb(null, data);
                }
            });
        }
    ], (err, result)=>{
        if(err) {
            next(err);
        } else {
            let posts,
                pageCount,
                categories,
                cateId,
                cateItem;
            posts = results[0][0];
            pageCount = results[0][1];
            categories = results[1];
            categories.unshift({
                __id: '',
                Alias: '',
                CateName: res.__('Category.all'),
                Img: '/static/images/全部分类.svg'
            });
            categories.push({
                __id: 'other',
                Alias: 'other',
                CateName: res.__('Category.uncate'),
                Img: '/static/images/未分类.svg'
            });
            for(let i = 0; i < posts.length; i++) {
                result[i] = {
                    Source: posts[i].Source,
                    Alias: posts[i].Alias,
                    Title: posts[i].Title,
                    Url: posts[i].Url,
                    PublishDate: moment(posts[i].CreateTime)
                        .format('YYYY-MM-DD'),
                    Host: posts[i].Url ? url.parse(posts[i].Url)
                        .host : '',
                    Summary: posts[i].Summary,
                    UniqueId: posts[i].UniqueId,
                    ViewCount: posts[i].ViewCount
                };
                cateId = posts[i].CategoryId;
                cateItem = tool.jsonQuery(categories, {__id: cateId});
                if(cateItem) {
                    result[i].CategoryAlias = cateItem.Alias;
                    result[i].CateName = cateItem.CateName;
                }
            }
            res.send({posts: result, pageCount });
        }
    })
})

module.exports = router;