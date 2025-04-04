import { Router } from "express";
import UserController from "../controllers/user/UserController.js";
const webRoutes = Router();
import authCookieJWT from '../middlewares/authCookieJWT.js';
import AuthController from '../controllers/user/AuthController.js';
import {profileRoutes} from './prefix/web/profile.js';
import RedirectIfAuthenticated from '../middlewares/RedirectIfAuthenticated.js';
import { admin } from "../config/firebase/messaging.js";
import notifEvent from "../events/NotificationEvent.js";


webRoutes.get('/',(req,res)=>{
    res.redirect('/admin/login');
});

// webRoutes.get('/admin',(req,res)=>{
//     res.redirect('/login');
// });

webRoutes.get('/login',RedirectIfAuthenticated,AuthController.login);

webRoutes.get('/register',RedirectIfAuthenticated,AuthController.register);

webRoutes.get('/password-restore',RedirectIfAuthenticated,AuthController.passwordRestore);

webRoutes.post('/password-restore',AuthController.passwordReset);

webRoutes.post('/login',AuthController.signIn);

webRoutes.post('/register',AuthController.signUp);

webRoutes.post('/logout',AuthController.logOut);

webRoutes.use('/profile',authCookieJWT,profileRoutes);








export {webRoutes};
