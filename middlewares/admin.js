const adminMiddleware = (req, res, next) => {

    if (req.user.roles.name == "ADMIN") {
            next();
        
    } else {
        return res.redirect('back');
    }
};

export default adminMiddleware;