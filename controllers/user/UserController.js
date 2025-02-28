import UserService from "../../services/UserService.js";
import User from "../../models/User.js";
import jwt  from "jsonwebtoken";
import bcrypt from "bcryptjs"
class UserController{

    constructor(){
        this.UserService = new UserService();
    }
    index = async (req, res) => {
        let datas = await this.UserService.getAll();
        res.render('index',{
            title:'Home Page',
            datas
        })
    }

    login = async (req,res) =>{

        const { email, password } = req.body;
        const user = await User.findOne({email});

        if (user) {
            let passCheck = await bcrypt.compare(password, user.password);
            if(!passCheck){
                res.json({"success":false,"message":"Wrong password"},401);
            }

            const accessToken = jwt.sign({id:user.id, email: user.email,  role: user.roles }, process.env.API_TOKEN);
            res.cookie('jwt',accessToken)
            res.render('profile',{
                title:'Profile Page',
            })
        } else {
            res.send('Username or password incorrect');
        }
       
    }
}

export default new UserController()