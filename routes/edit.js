const express = require('express');
const router = express.Router();
const post = require('../proxy/post-proxy');
/* GET home page. */
module.exports = router;

router.get(['/','/:id'], (req, res, next) => {
    let post_id = req.params.id
    if(post_id){
        post.getPost(post_id, (err, post)=> {
            if(err) return next(err);
            if(post) {
                res.render('edit', {
                    title: post.Title,
                    layout: 'edit-layout',
                    post: post,
                })
            }
        })
    }
    else {
        res.render('edit', {
            title: "New Article",
            layout: 'edit-layout',
            post: {},
        });
    }
})