const express = require('express');
const router = express.Router();
const post = require('../proxy/post-proxy');
const category = require('../proxy/category-proxy');

/* GET home page. */
router.get(['/','/blog','/blog/:category_alias'], (req, res, next) => {
  let category_alias = req.params.category_alias;
  if(!category_alias) category_alias = ""; 
  post.getPostList({
    CategoryAlias: category_alias,
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
            //descripte render level handlebars helpers
            helpers:{
              shorten: function (str) {
                if(typeof str === 'string')
                  return str.substr(0, 244) + '...';
                else return "hello world";
              }
            }
          })
        }
      })
    }
  })
});
module.exports = router;
