/**
 * Middleware to ensure user is authenticated.
 * If the user is logged in via persistent login session,
 * the request will proceed, else will get redirected to login.
*/
let ensureAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) return next();
    res.redirect('/login');
};

module.exports = { ensureAuthenticated }