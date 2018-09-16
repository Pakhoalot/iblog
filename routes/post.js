const express = require('express');
const router = express.Router();
const logger = require('../utility/logger');
const post = require('../proxy/post-proxy');

/* *******文章相关接口测试路由******** */

router.get('/get-postlist', (req, res, next) => {
  let param = req.query;
  //参数预处理
  if (typeof param.limit === 'string') {
    param.limit = parseInt(param.limit);
    if (isNaN(param.limit)) delete param.limit;
  }
  if (typeof param.skip === 'string') {
    param.skip = parseInt(param.skip);
    if (isNaN(param.skip)) delete param.skip;
  }

  post.getPostList(param, (err, postlist) => {
    if (err) next(err);
    else {
      logger.info('postlist_get succeed');
      res.json(postlist);
    }
  });
})





router.post('/get', (req, res, next) => {
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




router.post('/modify', (req, res, next) => {
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



router.post('/create', (req, res, next) => {
  let param = req.body;
  //转换boolean值
  if (param.isDraft) {
    param.isDraft = (param.isDraft === 'true');
  }
  if (param.isActive) {
    param.isActive = (param.isActive === 'true');
  }
  post.create(param, (err, result) => {
    if (err) next(err);
    else {
      res.json(result);
    }
  });
})

router.post('/soft-delete', (req, res, next) => {
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

router.post('/undo', (req, res, next) => {
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

router.post('/hard-delete', (req, res, next) => {
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
