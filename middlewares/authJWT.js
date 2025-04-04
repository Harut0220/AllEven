import jwt from "jsonwebtoken";
import User from "../models/User.js";

// const authenticateJWT = (req, res, next) => {
//     const authHeader = req.headers.authorization;

//     if (authHeader) {
//         const token = authHeader.split(' ')[1];

//         jwt.verify(token, process.env.API_TOKEN, async (err, user) => {
//             if (err) {
//                 return res.sendStatus(403);
//             }

//             let u = await User.findById(user.id).populate("roles")
//             if(u){
//                 user.name = u.name;
//                 user.surname = u.surname;
//                 user.email = u.email;
//                 user.phone_number = u.phone_number;
//                 user.role_name = u.roles.name;
//                 user.id=u._id
//                 req.user = user;
//                 next();
//             }else{
//                 res.sendStatus(401);
//             }

//         });
//     } else {
//         res.sendStatus(401);
//     }
// };

const authenticateJWT = async(req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(" ")[1];
    const user = jwt.decode(token);



      let u = await User.findById(user.id).populate("roles");
      if (u) {
        user.name = u.name;
        user.surname = u.surname;
        user.email = u.email;
        user.phone_number = u.phone_number;
        user.role_name = u.roles.name;
        user.id = u._id;
        req.user = user;
        next();
      } else {
        res.sendStatus(401);
      }
  } else {
    res.sendStatus(401);
  }
};

export default authenticateJWT;
