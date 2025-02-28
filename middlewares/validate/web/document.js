import { validator } from "../../../helper/validator.js";

const store = async (req,res,next) => {
    try {
        console.log(req.body.role,"req.body.role");

    const validationRule = {
        "file": "required",
        "role": "required"
    };
    //role:req.body.role
    let v = {role:req.body.role}

    if(req.files){
        v.file = req.files.file
    }

    await validator(v, validationRule, {}, (err, status) => {
        if (!status) {
            return res.redirect('/admin/profile/documents')
            // return {
            //         success: false,
            //         message: 'Validation failed',
            //         data: err
            //         };
        }
        next()
    }).catch( err => console.log(err))
} catch (error) {
    console.error(error)
}
}

export {store}