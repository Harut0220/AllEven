
import jwt  from "jsonwebtoken";
import User from "../models/User.js";

const authenticateJWTWithoutCheck = (req, res, next) => {

    const authHeader = req.headers.authorization;

    if (authHeader&&authHeader!=="null") {

        const token = authHeader.split(' ')[1];
        
        if(!token || token == 'null' || token == null){
            next()
            return 1;
        }

        jwt.verify(token, process.env.API_TOKEN, async (err, user) => {

            if (err) {
                return res.sendStatus(403);
            }

            let u = await User.findById(user.id);

            if(u){
                user.name = u.name;
                user.surname = u.surname;
                user.email = u.email;
                user.phone_number = u.phone_number;
                req.user = user;

                next();

            }

        });
    }else{
        next();
    }

};

export default authenticateJWTWithoutCheck;