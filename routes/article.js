const express = require('express');
const router = express.Router();
const post = require('../proxy/post-proxy')
const markdownPraser = require("marked");

//article page
router.get('/:id', (req, res, next) => {
  if (!req.params.id) {
    return next();
  }
  let post_id = req.params.id;
  post.getPost(post_id, (err, post) => {
    if (err) return next(err);
    if (post) {
      post.Content = markdownPraser.parse(post.Content);

      res.render('article', {
        post: post,
        title: post.Title,
      });
    }
  });
});

module.exports = router;
