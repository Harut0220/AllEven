import { validator } from "../../../helper/validator.js";
import EventCategory from "../../../models/event/EventCategory.js";
import mongoose from "mongoose";


const eventStore = async (req,res,next) => {
    const validationRule = {
        "name":"required|string",
        // "description":"null|string",
        "category":"required|string",
        "started_time":"required",
        "joinng_time":"required",
        // "tickets_link":"null|string",
        "latitude":"required|string",
        "longitude":"required|string"
    };
    await validator(req.body, validationRule, {}, (err, status) => {
        if (!status) {
            return res.status(412)
                .send({
                    success: false,
                    message: 'Validation failed',
                    data: err
                });
        }
        next()
    }).catch( err => console.log(err))
}

const eventCategory = async (req,res,next) => {
    const validationRule = {
        "name": "required|string",
        // "avatar": "nullable",
        // "block": "nullable|integer",
        "description": "string"
    };

    const category = await EventCategory.findOne({"name":req.body.name});

    if(category){
        return res.status(412)
                .send({
                    success: false,
                    message: 'The category has already been taken',
                });
    }

    await validator(req.body, validationRule, {}, (err, status) => {
        if (!status) {
            return res.status(412)
                .send({
                    success: false,
                    message: 'Validation failed',
                    data: err
                });
        }
        next()
    }).catch( err => console.log(err))
}

const event = async (req,res,next) => {
    const validationRule = {
        "name":"required|string",
        "description":"required|string",
        "category":"required|string",
        "started_time":"required",
        "latitude":"required",
        "longitude":"required",
        "address":"required|string",
    };
    

    // if(req.files && req.files.images){
    //     if(req.files.images.length != 3){
    //         return res.status(412)
    //             .send({
    //                 success: false,
    //                 message: 'The number of images must be 3',
    //             });
    //     }

    //     return res.status(412)
    //             .send({
    //                 success: false,
    //                 message: 'The number of images must be 3',
    //             });

    // }

    if(req.body.images && !Array.isArray(req.body.images)){
        return res.status(412)
                .send({
                    success: false,
                    message: 'Image type must be array',
                });
    }

    // if(req.files && req.files.images){
    //         if(req.files.images.length != 3){
    //             return res.status(412)
    //                 .send({
    //                     success: false,
    //                     message: 'The number of images must be 3',
    //                 });
    //         }
    //     }

    await validator(req.body, validationRule, {}, (err, status) => {
        if (!status) {
            return res.status(412)
                .send({
                    success: false,
                    message: 'Validation failed',
                    data: err
                });
        }
        next()
    }).catch( (err) => {console.log(err)
        res.status(500).send({success: false, message: 'Server error middleware'})
    })
}

const likeDislike = async (req,res,next) => {
    const validationRule = {
        "id":"required",
    };

    await validator(req.body, validationRule, {}, (err, status) => {
        if (!status) {
            return res.status(412)
                .send({
                    success: false,
                    message: 'Validation failed',
                    data: err
                });
        }
        next()
    }).catch( err => console.log(err))
}

const rating = async (req,res,next) => {
    const validationRule = {
        "id":"required",
        "rating":"required|min:1|max:5",
    };

    await validator(req.body, validationRule, {}, (err, status) => {
        if (!status) {
            return res.status(412)
                .send({
                    success: false,
                    message: 'Validation failed',
                    data: err
                });
        }
        next()
    }).catch( err => console.log(err))
}


const comment = async (req,res,next) => {
    const validationRule = {
        "id":"required",
        "text":"required",
    };

    await validator(req.body, validationRule, {}, (err, status) => {
        if (!status) {
            return res.status(412)
                .send({
                    success: false,
                    message: 'Validation failed',
                    data: err
                });
        }
        next()
    }).catch( err => console.log(err))
}


const commentLike = async (req,res,next) => {
    const validationRule = {
        "id":"required",
    };

    await validator(req.body, validationRule, {}, (err, status) => {
        if (!status) {
            return res.status(412)
                .send({
                    success: false,
                    message: 'Validation failed',
                    data: err
                });
        }
        next()
    }).catch( err => console.log(err))
}

const userImpression = async (req,res,next) => {
    const validationRule = {
        "user_id":"required",
        "event_id":"required",
    };

    await validator(req.query, validationRule, {}, (err, status) => {
        if (!status) {
            return res.status(412)
                .send({
                    success: false,
                    message: 'Validation failed',
                    data: err
                });
        }
        if (!mongoose.isValidObjectId(req.query.event_id)) {
            res.status(412)
            .send({
                success: false,
                message: 'Wrong format event_id',
            });
       }
       if (!mongoose.isValidObjectId(req.query.user_id)) {
        res.status(412)
        .send({
            success: false,
            message: 'Wrong format user_id',
        });
   }
        next()
    }).catch( err => console.log(err))
}

const ImpressionImage = async (req,res,next) => {
    const validationRule = {
        "event_id":"required",
        "files":"required"
    };

    if(!Array.isArray(req.body.files)){
        return res.status(412)
                .send({
                    success: false,
                    message: 'Files must be array',
                });
    }

    // if(!req.files){
    //     return res.status(412)
    //             .send({
    //                 success: false,
    //                 message: 'Validation failed',
    //                 data: 'The images field is required.'
    //             });
    // }

    await validator(req.body, validationRule, {}, (err, status) => {
        if (!status) {
            return res.status(412)
                .send({
                    success: false,
                    message: 'Validation failed',
                    data: err
                });
        }
        next()
    }).catch( err => console.log(err))
}

const nearEvent = async (req,res,next) => {
    const validationRule = {
        // "max_distance":"required",
        "latitude":"required",
        "longitude":"required",
    };

    await validator(req.query, validationRule, {}, (err, status) => {
        if (!status) {
            return res.status(412)
                .send({
                    success: false,
                    message: 'Validation failed',
                    data: err
                });
        }
        next()
    }).catch( err => console.log(err))
}

export {eventStore,eventCategory,event,likeDislike,rating,comment,commentLike,ImpressionImage,userImpression,nearEvent};