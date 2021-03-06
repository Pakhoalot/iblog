const express = require('express');
const router = express.Router();
const post = require('../proxy/post-proxy');
const category = require('../proxy/category-proxy');

/* GET home page. */
router.get(['/','/blog','/blog/:category_name'], (req, res, next) => {
  let category_name = req.params.category_name;
  if(!category_name) category_name = ""; 
  post.getPostList({
    categoryName: category_name,
  },(err, postlist)=> {
    if(err) return next(err);
    else {
      category.getAll((err, categories)=>{
        if(err) return next(err);
        else{
          //数据预渲染
          res.render('index', {
            title: 'Pakho Leung\'s Nest',
            postlist: postlist,
            categories: categories,
            user: req.user,
          })
        }
      })
    }
  })
});
module.exports = router;
