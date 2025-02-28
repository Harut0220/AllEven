import { validator } from "../../../helper/validator.js";

const storeReport = async (req,res,next) => {
    const validationRule = {
        "phone_number":"required|integer",
        "text":"required"
    };

    await validator(req.body, validationRule, {}, (err, status) => {
        if (!status) {
            // return res.redirect('back')
            return {
                success: false,
                message: 'Validation failed',
                data: err
            };
        }
        next()
    }).catch( err => console.log(err))
}

export {storeReport}