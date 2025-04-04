import NotificationService from "../../../services/NotificationService.js";
import EventCategoryService from "../../../services/EventCategoryService.js";
import FeedbackService from "../../../services/FeedbackService.js";
import notifEvent from "../../../events/NotificationEvent.js";
import Notification from "../../../models/Notification.js";
import moment from "moment-timezone";

class NotificationController{

    constructor(){
        this.NotificationService = new NotificationService();
        this.EventCategoryService = new EventCategoryService();
        this.FeedbackService = new FeedbackService();
    }

    index = async (req,res) => {
        const notifics = await this.NotificationService.all({status:1});

        res.render('profile/notification/list',{ layout: 'profile', title: "Notifications", user:req.user,notifics})
    }

    indexForAdmin = async (req,res) => {
        const notifics = await this.NotificationService.allAggregate({status: {
            $ne: 2
        }});

        res.render('profile/notification/list',{ layout: 'profile', title: "Notifications", user:req.user,notifics})
    }

    create = async (req,res) => {
        let planNotif = await this.NotificationService.all({status:1});
        res.render('profile/notification/notification',{ layout: 'profile', title: "Notifications", user:req.user,planNotif})
    }

    store = async (req,res) => {
        const {message,type,date_time} = req.body;
        let data = {
            message,
            type,
            date_time: new Date(date_time)
        }
        if(req.body.role == 'all'){
            data.sent = ["USER", "USER"]
        }else{
            data.sent = [req.body.role]
        }
        let notif = await this.NotificationService.storeAdmin(data);

        return res.redirect(`/admin/profile/notification`)
    }

    edit = async (req,res) => {
        let notif = await this.NotificationService.find(req.params.id);
        let planNotif = await this.NotificationService.all({status:1});

        // return res.json(notif)
        res.render('profile/notification/notification',{ layout: 'profile', title: "Notification Edit", user:req.user,notif,planNotif})
    }

    update = async (req,res) => {
        let data = req.body;
        if(data.role == 'any' || data.role == 'all'){
            data.role = ['USER','USER']
        }

        let notif = await this.NotificationService.update(req.params.id,data);
        return res.redirect('back');
    }

    categories = async (req,res) => {
        let categories = await this.EventCategoryService.getInactive();
        
        res.render('profile/notification/categories',{ layout: 'profile', title: "Event Category", user:req.user,categories})
    }

    feedback = async (req,res) => {
        let feedbacks = await this.FeedbackService.all();
        
        if(req.query && req.query.type && req.query.type == 'json'){
            return res.json({feedbacks,status:true})
        }

        res.render('profile/notification/feedback',{ layout: 'profile', title: "Feedback", user:req.user,feedbacks,feedbac_data:JSON.stringify(feedbacks)})
    }

    storeFeedback = async (req,res) => {
        let data =  req.body;
        await Notification.create({link:"feedback",message:data.message,user:data.user,feedback:data.parent_id,date_time:moment.tz(process.env.TZ).format("YYYY-MM-DD HH:mm"),type:"feedback",status:2,createId:data.parent_id});
        notifEvent.emit('send',data.user,JSON.stringify({message:data.message,user:data.user,feedback:data.parent_id,date_time:moment.tz(process.env.TZ).format("YYYY-MM-DD HH:mm"),type:"feedback"}))
        delete data.user;
        let feedback = await this.FeedbackService.store(data);
        //notifEvent.emit('send',feedback.parent.user.toString(),JSON.stringify(feedback))
        return res.json({"status":"success","message":"message saved success"})
    }

    changeStatus = async (req,res) => {
        await this.NotificationService.changeStatus(req.params.id);
        return res.redirect('back');
    }

    destroy = async (req,res) => {
        await this.NotificationService.destroy(req.params.id);
        return res.redirect('back');
    }

    destroyManyCatgs = async (req,res) => {
        const categ_ids = req.body.des_categs;

        if(Array.isArray(categ_ids)){
            await this.EventCategoryService.destroyMany(categ_ids)
        }else{
            await this.EventCategoryService.destroy(categ_ids)
        }

        return res.redirect('back');
    }
}


export default new NotificationController();