module.exports = {
    ensureAuthenticated: function(req, res, next){
        if(req.isAuthenticated()){
            return next();
        }
        req.flash('error_msg','Please log in to view this resource');
        res.redirect('/login');
    },

    isAdmin: function(req, res, next) {
        if(req.user.isAdmin == true) {
            return next();
        }
        req.flash('error_msg','This Admin site can only log by an admin');
        res.redirect('/');
    }
}