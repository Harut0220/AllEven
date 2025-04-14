import { validator } from "../../../helper/validator.js";
import Role from "../../../models/Role.js";
import User from "../../../models/User.js";
import UserService from "../../../services/UserService.js";
import AccessTokenService from "../../../services/AccessTokenService.js";
import SmsProstoService from "../../../services/SmsProstoService.js";
import GenerateRand from "../../../services/GenerateRand.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import axios from "axios";
import NodeCache from "node-cache";
import saveImageToDisk from "../../../imageController/imageController.js";
const myCache = new NodeCache({ stdTTL: 100, checkperiod: 120 });

class AuthController {
  constructor() {
    this.UserService = new UserService();
    this.AccessTokenService = new AccessTokenService();
    this.SmsProstoService = new SmsProstoService();
    this.GenerateRand = new GenerateRand();
  }

  login = async (req, res) => {
    res.send("1");
  };

  signUp = async (req, res) => {
    req.body.role = "USER";
    const { phone_number, name, surname, imagePath, role, password } = req.body;
    if (imagePath) {
      const user = await this.UserService.storeUserByPhoneNumberImage(
        phone_number,
        name,
        surname,
        imagePath,
        password,
        role
      );
      res
        .status(200)
        .send({ status: "success", message: "Пользователь успешно создан" });
    } else {
      const user = await this.UserService.storeUserByPhoneNumber(
        phone_number,
        name,
        surname,
        password,
        role
      );
      res
        .status(200)
        .send({ status: "success", message: "Пользователь успешно создан" });
    }

    // req.body.role="USER"
    // const {phone_number,name,surname,imagePath,role} = req.body;
    // const sendPath=`${process.env.URL}/api/imageUser/${phone_number}.jpg`
    // saveImageToDisk(imagePath,"./storage/users/"+`${phone_number}`+".jpg")
    //     .then(() => {
    //     })
    //     .catch((error) => {
    //       console.error("Error downloading file:", error);
    //     });
    // saveImageToDisk(imagePath,"./storage/users/"+`${phone_number}`+".jpg")
    // const user = await this.UserService.storeUserByPhoneNumber(phone_number,name,surname,imagePath,role)
    // res.json({'imagePath':sendPath,'status':'success','message':'Пользователь успешно создан'})
  };

  getPhoneCode = async (req, res) => {
    const { phone_number } = req.query;
    const rand = await this.GenerateRand.pin();
    let phoneMessage = await this.SmsProstoService.sendMessage(
      phone_number,
      rand
    );
    if (phoneMessage != 0) {
      return res.json({
        status: false,
        message: "Не верный формат номера получателя SMS.",
      });
    }
    console.log(rand, "rand");

    myCache.set(`phone_number_${phone_number}`, rand, 54000);
    return res.json({
      status: "success",
      message: "Проверьте свой телефон, через 15 минут код исчезнет",
    });
  };
  //signinfcmtoken
  signIn = async (req, res) => {
    const { phone_number, password, fcm_token } = req.body;

    let token = await this.AccessTokenService.storeByPhoneNumber(
      phone_number,
      password,
      fcm_token
    );

    if (!token || token == 0) {
      return res
        .status(403)
        .json({ message: "Вы ввели неверный номер телефона или пароль" });
    }

    console.log({
      message: "Вы успешно вошли в систему",
      token: token,
    });
    return res.json({
      message: "Вы успешно вошли в систему",
      token: token,
    });
    // const { phone_number, password } = req.body;
    // let token = await this.AccessTokenService.storeByPhoneNumber(phone_number,password);

    // if(!token || token == 0){
    //     return res.status(403).json({"message":"Вы ввели неверный номер телефона или пароль"})
    // }

    // return res.json({
    //     "message":"Вы успешно вошли в систему",
    //     "token":token
    // })
  };

  // signIn = async (req,res) =>{

  //     const { phone_number, password, fcm_token } = req.body;
  //     let token = await this.AccessTokenService.storeByPhoneNumber(phone_number,password,fcm_token);

  //     if(!token || token == 0){
  //         return res.status(403).json({"message":"Вы ввели неверный номер телефона или пароль"})
  //     }

  //     return res.json({
  //         "message":"Вы успешно вошли в систему",
  //         "token":token
  //     })

  // }

  passwordReset = async (req, res) => {
    const { phone_number } = req.body;
    let rand = await this.GenerateRand.pin();
    console.log("password reset",phone_number);
    
    let success = myCache.set(`reset_pass_${phone_number}`, rand, 54000);
    const sendSMS = await this.SmsProstoService.sendMessage(phone_number, rand);
    return res.json({
      status: "success",
      message: "Проверьте свой телефон, через 15 минут код исчезнет",
    });
  };

  passwordResetConfirm = async (req, res) => {
    const { phone_number, phone_number_code, password } = req.body;
    console.log("password reset confirm",phone_number, phone_number_code, password);
    
    let ph_num_c = myCache.get(`reset_pass_${phone_number}`);
    if (!ph_num_c) {
      return res.json({
        status: false,
        message: "15-минутный лимит исчерпан, попробуйте еще раз",
      });
    }

    if (ph_num_c && ph_num_c != phone_number_code) {
      return res.json({ status: false, message: "Неверный код" });
    }

    const token = await this.AccessTokenService.phoneNumberToken({
      phone_number,
      phone_number_code,
    });

    return res.json({ status: "success", expiration_token: token });
  };

  passwordResetNewPass = async (req, res) => {
    const { phone_number, password } = req.body;
    console.log("password reset new pass",phone_number, password);
    
    await this.UserService.updateByPhone(phone_number, {
      password: password.toString(),
    });
    const token = await this.AccessTokenService.jwtSignByPhone(phone_number);
    return res.json({
      status: "success",
      message: "Ваш пароль успешно сохранен",
      token,
    });
  };

  logout = async (req, res) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const token1 = authHeader.split(" ")[1];
      const user1 = jwt.decode(token1);
      
      if (req.body.fcm_token) {
        await User.findOneAndUpdate(
          { _id: user1.id },
          { $pull: { fcm_token: req.body.fcm_token } }, 
          { new: true }
        );
 
      }

      return res.send({ message: "Вы вышли из системы" });
    }
  };

  signupConfirmPhoneCode = async (req, res) => {
    const { phone_number, phone_number_code } = req.body;
    console.log(phone_number, "phone_number");
    console.log(phone_number_code, "phone_number_code");

    const ph_num_c = myCache.get(`phone_number_${phone_number}`);
    console.log(ph_num_c, "ph_num_c");
    if (!ph_num_c) {
      return res.json({
        status: false,
        message: "15-минутный лимит исчерпан, попробуйте еще раз",
      });
    }

    if (ph_num_c && ph_num_c != phone_number_code) {
      return res.json({ status: false, message: "Неверный код" });
    }

    const token = await this.AccessTokenService.phoneNumberToken({
      phone_number,
      phone_number_code,
    });
    myCache.del(`phone_number_${phone_number}`);

    return res.json({ status: "success", expiration_token: token });
  };
}

export default new AuthController();
