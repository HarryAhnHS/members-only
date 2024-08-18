// Authorization middleware
module.exports = {
    isAuth: (req, res, next) => {
        if (req.isAuthenticated()) {
            next();
        }
        else {
            console.error("Please log in to use this feature");
            res.redirect('/log-in');
        }
    },

    isAuthAndAdmin: (req, res, next) => {
        if (req.isAuthenticated() && req.user.is_admin) {
            next();
        }
        else {
            console.error("You are not authorized to use this feature because you are not an admin");
            res.redirect('/');
        }
    }
} 
