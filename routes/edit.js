const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
    res.render('edit', {
        title: "Edit",
        layout: 'edit',
    })
});
module.exports = router;
