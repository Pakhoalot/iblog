const express = require('express');
const router = express.Router();
const logger = require('../utility/logger');
const post = require('../proxy/post-proxy');

/* *******文章相关接口测试路由******** */

router.get('/post_getPostList', (req, res, next) => {
  //参数预处理
  if (typeof param.limit === 'string') {
    param.limit = parseInt(param.limit);
    if (isNaN(param.limit)) delete param.limit;
  }
  if (typeof param.skip === 'string') {
    param.skip = parseInt(param.skip);
    if (isNaN(param.skip)) delete param.skip;
  }
  let param = req.query;
  post.getPostList(param, (err, postlist) => {
    if (err) next(err);
    else {
      logger.info('postlist_get succeed');
      res.json(postlist);
    }
  });
})





router.post('/post_getPost', (req, res, next) => {
  let param = req.body;
  if (param.postId) {
    param = param.postId;
  }
  post.getPost(param, (err, post) => {
    if (err) next(err);
    else {
      res.json(post);
    }
  });
})




router.post('/post_modify', (req, res, next) => {
    let param = req.body;
    if (param.postId) {
      postId = param.postId;
      delete param.postId;
    }
    post.modify(postId, param, (err, post) => {
      if (err) next(err);
      else {
        res.json(post);
      }
    });
  })



router.post('/post_create', (req, res, next) => {
  let param = req.body;
  //转换boolean值
  if (param.IsDraft) {
    param.IsDraft = (param.IsDraft === 'true');
  }
  if (param.IsActive) {
    param.IsActive = (param.IsActive === 'true');
  }
  post.create(param, (err, result) => {
    if (err) next(err);
    else {
      res.json(result);
    }
  });
})

router.post('/post_softDelete', (req, res, next) => {
  let param = req.body;
  if (param.postId) {
    param = param.postId;
  }
  post.softDelete(param, (err, post) => {
    if (err) next(err);
    else {
      res.json(post);
    }
  });
})

router.post('/post_undo', (req, res, next) => {
  let param = req.body;
  if (param.postId) {
    param = param.postId;
  }
  post.undo(param, (err, post) => {
    if (err) next(err);
    else {
      res.json(post);
    }
  });
})

router.post('/post_hardDelete', (req, res, next) => {
  let param = req.body;
  if (param.postId) {
    param = param.postId;
  }
  post.hardDelete(param, (err, post) => {
    if (err) next(err);
    else {
      res.json(post);
    }
  });
})

module.exports = router;
