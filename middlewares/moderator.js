const moderatorMiddleware = (req, res, next) => {

    if (req.user.roles.name == "MODERATOR") {
            next();
        
    } else {
        return res.redirect('back');
    }
};

export default moderatorMiddleware;