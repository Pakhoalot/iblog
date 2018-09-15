const express = require('express');
const router = express.Router();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const accountConfig = require('../config/accout-config');
const Account = require('../models/account');

passport.use(new LocalStrategy(Account.authenticate()));
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());

router.get('/login', (req, res, next) => {
  res.render('login', {
    title: 'Login',
    layout: 'main',
    user: req.user
  })
})

/* ************register **************** */
if (accountConfig.resigterEnable) {
  router.get('/register', function (req, res) {
    res.render('register', {});
  });

  router.post('/register', function (req, res) {
    Account.register(new Account({
      username: req.body.username
    }), req.body.password, function (err, account) {
      if (err) {
        return res.render('register', {
          account: account
        });
      }

      passport.authenticate('local')(req, res, function () {
        res.redirect('/');
      });
    });
  });
}

/* ********************login********************* */
router.post('/login', function (req, res, next) {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.render('login', {
        title: 'Login',
        layout: 'main',
        user: req.user,
        message: 'account invaild.'
      });
    }
    req.logIn(user, function (err) {
      if (err) {
        return next(err);
      }
      if (req.headers.referer === `http://${req.headers.host}/login`)
        return res.redirect('/');
      else return res.redirect(req.headers.referer);
    });
  })(req, res, next);

});

router.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/');
});

module.exports = router;
