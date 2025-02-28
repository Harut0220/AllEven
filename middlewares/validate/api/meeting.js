

import { validator } from "../../../helper/validator.js";

export const createPassport = async (req, res, next) => {
    const validationRule = {
        "name": "required|string",
        "family": "required|string",
        "surname": "required|string",
        "passport": "required|string",
        "term": "required|string",
        // "passportImage": "required|string",
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
};





export const meeting = async (req, res, next) => {
    const validationRule = {
        "purpose": "required|string",
        "description": "required|string",
        // "ticket": "required|string",
        "longitude": "required|numeric",
        "latitude": "required|numeric",
        "date": "required|string",
        "address": "required|string",
        "images": "required",
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