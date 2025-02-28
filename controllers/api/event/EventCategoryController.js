import EventCategory from "../../../models/event/EventCategory.js"
import EventCategoryService from "../../../services/EventCategoryService.js";
import UserService from "../../../services/UserService.js";
import notifEvent from "../../../events/NotificationEvent.js";
import jwt from 'jsonwebtoken';
class EventCategoryController{

    constructor(){
        this.EventCategoryService = new EventCategoryService();
        this.UserService = new UserService();
    }

    index = async (req,res) => {
        let userRole = 'USER';

        if(req.user){
            userRole = await this.UserService.getRoleByuser(req.user.id);
            var user = await this.UserService.findAndLean(req.user.id);
        }

        let categories = user && user.event_favorite_categories.length && userRole == 'USER'
            ? await this.EventCategoryService.getByUser(user.event_favorite_categories)
            : await this.EventCategoryService.get()


        return res.json({'status':'success','data':categories});
    }

    store = async (req,res) => {
        const {name, description} = req.body;
        const authHeader = req.headers.authorization;
            const token = authHeader.split(' ')[1];
    
           const user = jwt.decode(token);
        let category = await this.EventCategoryService.store({name,description,"owner":user.id})
        notifEvent.emit('send','ADMIN',JSON.stringify({type:'Новая категория',message:category.name}));
        await this.UserService.pushInCollection(user.id,category,'event_categories')
        return res.json({'status':category,'message':'Админ будет подтверждать ваш запрос'});
    }
}

export default new EventCategoryController();