const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    res.render('dashboard', {
        title: 'Admin',
        user: req.user,
    })
});

module.exports = router;