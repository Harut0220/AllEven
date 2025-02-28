import { validator } from "../../../helper/validator.js";

const store = async (req,res,next) => {
    const validationRule = {
        "document_id": "required",
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

export {store}