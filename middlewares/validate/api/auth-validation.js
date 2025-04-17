import { validator } from "../../../helper/validator.js";
import User from "../../../models/User.js";
import jwt  from "jsonwebtoken";


const signup = async (req,res,next)=>{
    const validationRule = {
        // "phone_number_code": "required|integer",
        "expiration_token":"required",
        // "phone_number": "required|integer",
        "name": "required|string",
        "surname":"required|string",
        // "imagePath":"required|string",
        // "role": "required|string",
    };
    const {expiration_token} = req.body;
    

    await validator(req.body, validationRule, {}, (err, status) => {
        if (!status) {
            res.status(412)
                .send({
                    success: false,
                    message: 'Validation failed',
                    data: err
                });
        }

        jwt.verify(req.body.expiration_token, process.env.API_TOKEN, async (err, expiration) => {
            if (err) {
                return res.sendStatus(403);
            }

            req.body.phone_number = expiration.phone_number;
            next();

        });
    }).catch( err => console.log(err))
}

const signin = async (req,res,next)=>{
    const validationRule = {
        "phone_number": "required|integer",
        "password": "required|integer",
        "fcm_token": "required",
    };


    await validator(req.body, validationRule, {}, (err, status) => {
        if (!status) {
            console.log('err: ', err);
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

const passwordReset = async (req,res,next) => {
    const validationRule = {
        "phone_number": "required|integer",
    };

    const user = await User.findOne({"phone_number":req.body.phone_number});

    if(!user){
        res.status(412)
                .send({
                    success: false,
                    message: 'This phone number does not exist in our records.',
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

const passwordResetConfirm = async (req,res,next) => {
    const validationRule = {
        "phone_number": "required|integer",
        // "password" : "required|integer",
        "phone_number_code" : "required|integer"
    };

    const user = await User.findOne({"phone_number":req.body.phone_number});

    if(!user){
        res.status(412)
                .send({
                    success: false,
                    message: 'This phone number does not exist in our records.',
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

const passwordResetNewPass = async (req,res,next) => {
    console.log(req.body,"req.body");
    
    const validationRule = {
        "expiration_token": "required",
        "password" : "required|integer",
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
        jwt.verify(req.body.expiration_token, process.env.API_TOKEN, async (err, expiration) => {
            if (err) {
                return res.sendStatus(403);
            }

            req.body.phone_number = expiration.phone_number;
            next();

        });
    }).catch( err => console.log(err))

}

const updatePhoneNumber = async (req,res,next) => {
    const validationRule = {
        "phone_number": "required",
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

const updatePhoneNumberConfirm = async (req,res,next) => {
    const validationRule = {
        "phone_number_code": "required",
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

const storeFavoriteCategory = async (req,res,next) => {
    const validationRule = {
        "event_category_id": "required",
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

const notificationsList = async (req,res,next) => {
    const validationRule = {
        "notifications_list_id": "required",
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

const existsPhoneNumber = async (req,res,next) => {
    
    const phone_number = req.body.phone_number ?? req.query.phone_number;

    if(!phone_number){
        return res.status(412)
                .send({
                    success: false,
                    message: 'The phone_number is required',
                });
    }

    const user = await User.findOne({phone_number});

    if(user){
        return res.status(400)
                .send({
                    success: false,
                    message: 'Номер телефона уже существует',
                });
    }

    next()

}

const confirmPhoneNumber = async (req,res,next) => {

    const validationRule = {
        "phone_number": "required",
        "phone_number_code": "required",
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


const updateProfile = async (req,res,next) => {

    const validationRule = {
        "name": "required",
        "email": "required|email",
        "surname": "required",
    };

    if(req.body.password){
        res.status(412);
        return res.json({"status":false,"message":"You cannot change your password in this api"});
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


export {
    signup,
    signin,
    passwordReset,
    passwordResetConfirm,
    passwordResetNewPass,
    updatePhoneNumber,
    updatePhoneNumberConfirm,
    storeFavoriteCategory,
    notificationsList,
    existsPhoneNumber,
    confirmPhoneNumber,
    updateProfile
};