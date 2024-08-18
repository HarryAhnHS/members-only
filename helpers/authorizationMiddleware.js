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
    }
} 
