const express = require('express');
const router = express.Router();
const path =  require('path');
const category = require('../proxy/category-proxy');
const tool = require('../utility/tool');
const logger = require('../utility/logger');


//给予测试接口以插入数据进数据库的条件

router.get('/category_getAll', (req, res, next) => {
    category.getAll((err, categories) => {
        if(err) next(err);
        else {
            logger.info('categories_get succeed');
            res.json(categories);
        }
    })
})

router.post('/category_create', (req, res, next) => {
    let params = req.body;
    category.create(params,(err,category)=>{
        if(err) next(err);
        else {
            res.json(category);
        }
    });

})

router.post('/category_deleteByAlias', (req, res, next) => {
    let params = req.body.Alias;

    category.deleteByAlias(params,(err)=>{
        if(err) next(err);
        else {
            result = {status: "sucess"};
            res.json(result);
        }
    });

})

module.exports = router;