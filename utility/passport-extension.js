const passport = require('passport');

/**
 *扩充passport方法,使之能成为一个认证登录状态的中间件
 *
 * @param {*} options
 * @returns
 */
passport.ensureLoggedIn = function (options) {
    if (typeof options == 'string') {
      options = { redirectTo: options }
    }
    options = options || {};
    
    var url = options.redirectTo || '/login';
    var setReturnTo = (options.setReturnTo === undefined) ? true : options.setReturnTo;
    
    return function(req, res, next) {
      if (!req.isAuthenticated || !req.isAuthenticated()) {
        if (setReturnTo && req.session) {
          req.session.returnTo = req.originalUrl || req.url;
        }
        return res.redirect(url);
      }
      next();
    }
  }

  /**
   *
   *
   * @returns
   */
  passport.ensureAuthorized = function (){
      return function(req, res, next) {
          if(!req.isAuthenticated || !req.isAuthenticated()) {
              return res.send(401, 'unauthorized');
          } 
          next();
      }
  }