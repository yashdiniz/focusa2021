/**
 * Middleware to ensure user is authenticated.
 * If the user is logged in via persistent login session,
 * the request will proceed, else will get redirected to login.
*/
let ensureAuthenticated = (req, res, next) => {
    if (req.session.passport.user) {
        req.user = req.session.passport.user;
        return next();
    }
    res.redirect('/error');
};

module.exports = { ensureAuthenticated }