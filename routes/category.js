const express = require('express');
const router = express.Router();
const category = require('../proxy/category-proxy');
const logger = require('../utility/logger');


//给予测试接口以插入数据进数据库的条件

router.get('/get-all', (req, res, next) => {
    category.getAll((err, categories) => {
        if(err) next(err);
        else {
            logger.info('categories_get succeed');
            res.json(categories);
        }
    })
})

router.post('/create', (req, res, next) => {
    let params = req.body;
    category.create(params,(err,category)=>{
        if(err) next(err);
        else {
            res.json(category);
        }
    });

})

router.post('/update-or-create', (req, res, next) => {
    let params = req.body.CategoryName;
    category.updateOrCreate(params,(err)=>{
        if(err) next(err);
        else {
            result = {status: "sucess"};
            res.json(result);
        }
    });

})

router.post('/delete-by-categoryname', (req, res, next) => {
    let params = req.body.CategoryName;

    category.deleteByCategoryName(params,(err)=>{
        if(err) next(err);
        else {
            result = {status: "sucess"};
            res.json(result);
        }
    });

})

module.exports = router;