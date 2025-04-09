import FeedbackService from "../../../services/FeedbackService.js";
import notifEvent from "../../../events/NotificationEvent.js";
import jwt from "jsonwebtoken";
import User from "../../../models/User.js";
class FeedbackController{

    constructor(){
        this.FeedbackService = new FeedbackService();
    }
    
    index = async (req,res) => {
        try {
            const feedbacks = await this.FeedbackService.getByUserId(req.user.id);
            return res.json({"status":"success","data":feedbacks})
        } catch (error) {
            console.error(error)
        }

    }

    store = async (req,res) => {
        try {
            let data =  req.body;
            
            const authHeader = req.headers.authorization;
            const token = authHeader.split(" ")[1];
            const user = jwt.decode(token);
            const userDb= await User.findById(user.id)
            data.user = user.id;
            
            let feedback = await this.FeedbackService.store(data);
            
            notifEvent.emit('send','ADMIN',JSON.stringify({type:'Обратная связь',message:userDb.email,data:feedback}));
            // notifEvent.emit('send','ADMIN_FEEDBACK',JSON.stringify(feedback));
            return res.json({"status":"success","message":"message send success"})
        } catch (error) {
            console.error(error)
            return res.json({"status":"fail","message":"Server Error"})

        }

    }
}


export default new FeedbackController();