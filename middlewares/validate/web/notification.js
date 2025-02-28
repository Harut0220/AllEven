import { validator } from "../../../helper/validator.js";

const store = async (req,res,next) => {
    const validationRule = {
        "message": "required",
        "role": "required",
        "type":"required",
        "date_time":"required"
    };

    await validator(req.body, validationRule, {}, (err, status) => {
        if (!status) {
            return res.redirect('/admin/profile/notification')
            // return {
            //         success: false,
            //         message: 'Validation failed',
            //         data: err
            //         };
        }
        next()
    }).catch( err => console.log(err))
}

export {store}