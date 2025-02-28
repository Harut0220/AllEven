import AccessTokenService from "../../services/AccessTokenService.js";
import UserService from "../../services/UserService.js";
import {transporter} from "../../config/nodemailer.js"
class AuthController{

    constructor(){
        this.AccessTokenService = new AccessTokenService();
        this.UserService = new UserService();
    }

    login = async (req,res)=>{
        res.render('auth/login')
    }

    register = async (req,res)=>{
        res.render('auth/register')
    }

    passwordRestore = async (req,res)=>{
        res.render('auth/password_restore')
    }

    signIn = async (req,res) => {
        const { email, password } = req.body;
        let token = await this.AccessTokenService.store( email, password);
        if(!token){
            return res.redirect('/admin/login')
        }
        res.cookie('alleven_token',token);
        return res.redirect('/admin/profile/users');
    }

    signUp = async (req,res) => {
        
        const { name,surname,email,password,phone_number } = req.body;
        let user = await this.UserService.create({name,surname,email,password,phone_number},'MODERATOR');
        res.cookie('register_notif',1);    
        return res.redirect('/admin/register')
        // let token = await this.AccessTokenService.store( email, password);

        // if(!token){
        //     res.redirect('/register')
        // }
        // res.cookie('alleven_token',token)
        // res.redirect('profile/users')
    }

    logOut = async (req,res) => {
        let des = await this.AccessTokenService.destroy(req.cookies.alleven_token);
        if(!des){
            return res.redirect('back')
        }

        res.clearCookie("alleven_token");
        return res.redirect('/admin/login')
    }

    passwordReset = async (req,res) => {
        const email = req.body.email;
        const checkEm = await this.UserService.passwordResetByEmail(email);
        res.cookie('password_reset_notif',checkEm);    
        return res.redirect('/admin/password-restore');

    }
}

export default new AuthController();