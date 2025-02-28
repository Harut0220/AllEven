import EventCategoryService from "../../../services/EventCategoryService.js";
import {transporter} from "../../../config/nodemailer.js"
class EventCategoryController{

    constructor(){
        this.EventCategoryService = new EventCategoryService();
    }

    index = async (req,res) => {
        let categories = await this.EventCategoryService.index();
        res.render('profile/event-category',{ layout: 'profile', title: "Event Category", user:req.user,categories})
    }

    edit = async (req,res) => {
        const {name,description,status} = req.body;
        let avatar = req.files ? req.files.avatar : null;
        let map_avatar = req.files ? req.files.map_avatar : null;
        let data = {name,description,status};
        if(avatar){
            data.avatar = avatar
        }
        if(map_avatar){
            data.map_avatar = map_avatar
        }
        let categories = await this.EventCategoryService.update(req.params.id,data);
        
        if(categories.owner){
            transporter.sendMail({
                from: process.env.MAIL_USERNAME,
                to: categories.owner.email,
                subject: "Hello",
                template: 'confirm-category',
                context: {
                    message: status == '1' ? 'Ваша категория принята' : 'Ваша категория отменена'
                }
              }); 
        }
        return res.redirect('back')
    }

    store = async (req,res) => {
        const {name,description,status} = req.body;
        let avatar = req.files ? req.files.avatar : null;
        let map_avatar = req.files ? req.files.map_avatar : null;
        let data = {name,description,status};
        if(avatar){
            data.avatar = avatar
        }
        if(map_avatar){
            data.map_avatar = map_avatar
        }
        let categories = await this.EventCategoryService.store(data);
        return res.redirect('back') 
    }
}


export default new EventCategoryController();