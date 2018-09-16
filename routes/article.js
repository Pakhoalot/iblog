const express = require('express');
const router = express.Router();
const post = require('../proxy/post-proxy')

//article page
router.get('/:id', (req, res, next) => {
  if (!req.params.id) {
    return next();
  }
  let post_id = req.params.id;
  post.getPost(post_id, (err, post) => {
    if (err) return next(err);
    if (post) {
      res.render('article', {
        post: post,
        title: post.title,
        user: req.user,
      });
    }
  });
});

module.exports = router;
