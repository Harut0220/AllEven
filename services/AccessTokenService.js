import User from "../models/User.js";
import bcrypt from "bcryptjs"
import jwt  from "jsonwebtoken";

class AccessTokenService{

    store = async (email,password) => {
        const user = await User.findOne({email});
        // console.log("user",user && !user.block);
        if (user && !user.block) {
            let passCheck = await bcrypt.compare(password, user.password);
            // console.log("passCheck",passCheck);
            if(!passCheck){
                console.log("0");
                //res.json({"success":false,"message":"Wrong password"},401);
                return 0;
            }
          
            const accessToken = jwt.sign({id:user.id, email: user.email,  role: user.roles }, process.env.API_TOKEN);
            
            return accessToken;
        } else {
            return 0;
        }
    }
    // signinfcmtoken
    storeByPhoneNumber = async (phone_number,password,fcm_token) => {
        const user = await User.findOne({phone_number});

        if (user) {
            let passCheck = await bcrypt.compare(password, user.password);
            if(!passCheck){
                //res.json({"success":false,"message":"Wrong password"},401);
                return 0;
            }

            if(fcm_token){
                if(!user.fcm_token.includes(fcm_token)){
                    const fcmArray=[fcm_token]
                    fcmArray.push()
                    user.fcm_token=fcmArray;
                    await user.save();
                }
            }

            const accessToken = jwt.sign({id:user.id, name:user.name, surname:user.surname, email: user.email,  role: user.roles, phone_number: user.phone_number}, process.env.API_TOKEN);
            return accessToken;
        } else {
            return 0;
        }
    }
    // storeByPhoneNumber = async (phone_number,password) => {
    //     const user = await User.findOne({phone_number});

    //     if (user) {
    //         let passCheck = await bcrypt.compare(password, user.password);
    //         if(!passCheck){
    //             //res.json({"success":false,"message":"Wrong password"},401);
    //             return 0;
    //         }
    //         const fcm_token="2134rewfe"
    //         if(fcm_token){
    //             if(!user.fcm_token.includes(fcm_token)){
    //                 user.fcm_token.push(fcm_token);
    //                 await user.save();
    //             }
    //         }

    //         const accessToken = jwt.sign({id:user.id, name:user.name, surname:user.surname, email: user.email,  role: user.roles, phone_number: user.phone_number}, process.env.API_TOKEN);
    //         return accessToken;
    //     } else {
    //         return 0;
    //     }
    // }

    // storeByPhoneNumber = async (phone_number,password,fcm_token) => {
    //     const user = await User.findOne({phone_number});

    //     if (user) {
    //         let passCheck = await bcrypt.compare(password, user.password);
    //         if(!passCheck){
    //             //res.json({"success":false,"message":"Wrong password"},401);
    //             return 0;
    //         }

    //         if(fcm_token){
    //             if(!user.fcm_token.includes(fcm_token)){
    //                 user.fcm_token.push(fcm_token);
    //                 await user.save();
    //             }
    //         }

    //         const accessToken = jwt.sign({id:user.id, name:user.name, surname:user.surname, email: user.email,  role: user.roles, phone_number: user.phone_number}, process.env.API_TOKEN);
    //         return accessToken;
    //     } else {
    //         return 0;
    //     }
    // }

    destroy = async (token) => {
        if(!token){
            return 0;
        }
        
        //await jwt.destroy(token);
        return 1;
    }

    phoneNumberToken = async (data) => {
        return jwt.sign(data, process.env.API_TOKEN,  {
            expiresIn: "1h",
          });
    }

    jwtSignByPhone = async (phone_number) => {
        const user = await User.findOne({phone_number});
        return jwt.sign({id:user.id, name:user.name, surname:user.surname, email: user.email,  role: user.roles, phone_number: user.phone_number}, process.env.API_TOKEN);
    }
}

export default AccessTokenService;