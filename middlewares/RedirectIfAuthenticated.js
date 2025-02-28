
import jwt  from "jsonwebtoken";

const RedirectIfAuthenticated = (req, res, next) => {
    const token = req.cookies.alleven_token;

    if (token) {
        jwt.verify(token, process.env.API_TOKEN, (err, user) => {
            if (err) {
                next();
            }
            return res.redirect('/admin/profile');
        });
    } else {
        next();
    }
};

export default RedirectIfAuthenticated;