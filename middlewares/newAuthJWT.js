
import jwt  from "jsonwebtoken";
import User from "../models/User.js";

const newAuthJWT = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];
        const user = jwt.decode(token);

        try {
            let u = await User.findById(user.id).populate("roles");

            if (u) {
                return next(); 
            } else {
                return res.status(401).send({ message: "User not found" }); 
            }
        } catch (err) {
            console.error(err);
            return res.status(500).send({ message: "Internal server error" }); 
        }
    } 

    return res.status(403).send({ message: "Unauthorized" });
};


export default newAuthJWT;