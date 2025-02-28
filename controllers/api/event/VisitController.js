// import EventService from "../../../services/EventService.js";
// import notifEvent from "../../../events/NotificationEvent.js";
// import NotificationService from "../../../services/NotificationService.js";
// import jwt from "jsonwebtoken";
// class VisitController{
//     constructor(){
//         this.EventService = new EventService()
//         this.NotificationService = new NotificationService()
//     }

//     index = async (req,res) => {
//         let datas = await this.EventService.find(req.query.event_id)
//         return res.json({'status':'success','data':datas.participants})
//     }

//     store = async (req,res) => {
//         const {event_id} = req.body;
//         const event = await this.EventService.find(event_id);
//         const userName = req.user.name ? req.user.name : '';
//         const userSurname = req.user.surname ? req.user.surname : '';

//         let evEx = 0;

//         for(let e =0;e<event.participants.length;e++){
//             if(event.participants[e]._id == req.user.id){
//                 evEx = 1;
//             }
//         }

//         if(!evEx && event.owner){
//             const evLink = `alleven://eventDetail/${event._id}`
//             const msg = `${userName} ${userSurname} собирается посетить ваше событие ${event.name}`;
//             const notif = await this.NotificationService.store({type:'message',date_time:new Date(),status:2,message:msg,user:event.owner._id.toString(),link:evLink,notif_type:'Я пойду', categoryIcon: event.category.avatar, event: event._id})
//             notifEvent.emit('send',event.owner._id.toString(),JSON.stringify({type:'message',date_time:new Date(),message:msg,link:evLink,notif_type:'Я пойду', categoryIcon: event.category.avatar}));
//         }

//         let ev = await this.EventService.addOrRemoveCollectionData(event_id,req.user.id,'visits')
//         return res.json({'status':'success'})
//     }

// }

// export default new VisitController();