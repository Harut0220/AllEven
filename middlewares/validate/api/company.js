import { validator } from "../../../helper/validator.js";


export const company = async (req, res, next) => {
    const validationRule = {
        "name": "required|string",
        "address": "required|string",
        "images": "required",
        "phoneNumbers": "required",
        "days": "required|string",
        "services": "required",
        "startHour": "required",
        "endHour": "required",
    };


    
    try {
    
        await new Promise((resolve, reject) => {
          validator(req.body, validationRule, {}, (err, status) => {
            if (!status) {
              return reject(err);
            }
            resolve();
          });
        });

    
        next();
      } catch (err) {
        console.error(err);
        return res.status(412).send({
          success: false,
          message: "Validation failed",
          data: err,
        });
      }
}



export const serviceRegisterMiddl=async (req, res, next) => {
  const { serviceId, date, route } = req.body;
  
  if (serviceId && date) {
    return next();
  } else {
    return res.status(403).send({ message: "INVALID DATA" });
  }
}