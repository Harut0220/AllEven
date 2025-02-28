import Notification from "../../../models/Notification.js";
import User from "../../../models/User.js";
import NotificationService from "../../../services/NotificationService.js"

class NotificationController{

    constructor(){
        this.NotificationService = new NotificationService();
    }

    opportunity=async (req,res)=>{
        const authHeader = req.headers.authorization;
        // if(authHeader&&authHeader!=="null"){
            const token = authHeader.split(" ")[1];
    
            const user = jwt.decode(token);
        
            const userDb=await User.findById(user.id)
        
    
        
            return res.status(200).send({message:"success",eventNotif:userDb.notifEvent,companyNotif:userDb.notifCompany,meetingNotif:userDb.notifMeeting,hotOfferNotif:userDb.notifHotOffer,})
        // }else{
        //     return res.status(403).send({message:"Unauthorized"})
        // }
    

    
      }
    
    index = async (req,res) => {
        // const notifications = await this.NotificationService.findByRole(req.user);
        const notifications=await Notification.find({user:req.user.id})
        notifications.map((el)=>{
            el.date_time = new Date(el.date_time)
            if(el.read && el.read.length){
                for(let n =0;n<el.read.length;n++){
                    if(el.read[n].toString() == req.user.id){
                        el.read = true
                    }else{
                        el.read = false
                    }
                }
            }else{
                el.read = false
            }

        })
        await this.NotificationService.toRead(req.user);
        console.log(notifications,"notifications");
        
        return res.json({"status":"success","data":notifications})
    }

    read = async (req,res) => {
       await this.NotificationService.toRead(req.user);
       return res.json({"status":"success"})
   }

   readOne = async (req,res) => {
    const notifId = req.params.id;
    await this.NotificationService.toReadOne(req.user,notifId);
    return res.json({"status":"success"})
   }

   destroyOne = async (req,res) => {
    const notifId = req.params.id;
    await this.NotificationService.destroy(notifId);
    return res.json({"status":"success"})
   }
   
}


export default new NotificationController();