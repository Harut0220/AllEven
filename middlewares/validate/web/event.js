import { validator } from "../../../helper/validator.js";
import EventCategory from "../../../models/event/EventCategory.js";

const eventCategory = async (req,res,next) => {
    const validationRule = {
        "name": "required|string",
        // "avatar": "nullable",
        // "block": "nullable|integer",
        "description": "string"
    };

    let category = await EventCategory.findOne({"name":req.body.name});
    if(category && category._id == req.body.id){
        category = false
    }
    if(category){
     return res.redirect('/admin/profile/event-categories')
        // return {
        //             success: false,
        //             message: 'The category has already been taken',
        //         };
    }

    await validator(req.body, validationRule, {}, (err, status) => {
        if (!status) {
            return res.redirect('/admin/profile/event-categories')
            // return {
            //         success: false,
            //         message: 'Validation failed',
            //         data: err
            //         };
        }
        next()
    }).catch( err => console.log(err))
}

export {eventCategory}