import { validator } from "../../../helper/validator.js";
import User from "../../../models/User.js";

const signup = async (req,res,next)=>{
    const validationRule = {
        "email": "required|string|email",
        "name": "required|string",
        "surname": "required|string",
        "middlename": "required|string",
        "password": "required|string",
    };

    const user = await User.findOne({"email":req.body.email});

    if(user){
        res.status(412)
                .send({
                    success: false,
                    message: 'The email has already been taken',
                });
    }

    await validator(req.body, validationRule, {}, (err, status) => {
        if (!status) {
            res.status(412)
                .send({
                    success: false,
                    message: 'Validation failed',
                    data: err
                });
        }
        next()
    }).catch( err => console.log(err))
}

const signin = async (req,res,next)=>{
    const validationRule = {
        "email": "required|string|email",
        "password": "required|string",
    };


    await validator(req.body, validationRule, {}, (err, status) => {
        if (!status) {
            res.status(412)
                .send({
                    success: false,
                    message: 'Validation failed',
                    data: err
                });
        }
        next()
    }).catch( err => console.log(err))
}

export {signup,signin};