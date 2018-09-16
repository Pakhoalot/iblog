const express = require('express');
const router = express.Router();
const post = require('../proxy/post-proxy');
const passport = require('passport');
module.exports = router;

router.get(['/', '/:id'], (req, res, next) => {
  let post_id = req.params.id
      let helpers = {
        spliting: function (array) {
          if (array) return array.join(' ');
          return '';
        }
      };
      if (post_id) {
        post.getPost(post_id, (err, post) => {
          if (err) return next(err);
          if (post) {
            res.render('edit', {
              title: post.Title,
              layout: 'edit-layout',
              post: post,
              user: req.user,
              helpers: helpers

            });
          }
        })
      } else {
        return res.render('edit', {
          title: "New Article",
          layout: 'edit-layout',
          user: req.user,
          // post: {},
          helpers: helpers,
        });
      }
})
