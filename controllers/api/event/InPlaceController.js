// import EventService from "../../../services/EventService.js";
// import NotificationService from "../../../services/NotificationService.js";
// import notifEvent from "../../../events/NotificationEvent.js";
// import UserService from "../../../services/UserService.js";
// import jwt from "jsonwebtoken";
// class InPlaceController{
//     constructor(){
//         this.EventService = new EventService()
//         this.UserService = new UserService()
//         this.NotificationService = new NotificationService()
//     }

//     index = async (req,res) => {
//         const event = await this.EventService.find(req.query.event_id)

//         // const datas = await this.UserService.comeEvents(req.user.id);
//         return res.json({'status':'success','data':event.participantsSpot})
//     }

//     store = async (req,res) => {
//         const {event_id, couse} = req.body;
//         let eventId = event_id;
//         const notif = await this.NotificationService.findById(event_id);
//         if (notif) {
//             eventId = notif.event
//         }
//         await this.NotificationService.changeConfirmByEventId(eventId);
//         const event = await this.EventService.find(eventId);

//         if(!event){
//             return res.json({'status':false,'message':'событие не найдено'});
//         }

//         const evLink = `alleven://eventDetail/${event._id}`;

//         const userName = req.user.name ? req.user.name : '';
//         const userSurname = req.user.surname ? req.user.surname : '';
//         if(couse){
//             await this.EventService.storeDidNotCome({user:req.user.id,event:eventId,couse});

//             if(event && event.owner){
//                 notifEvent.emit('send',event.owner._id.toString(),JSON.stringify({type:'message',date_time:new Date(),message:`К сожалению, пользователь ${userName} ${userSurname} не пришел на ваше событие ${event.name}`,link:evLink,notif_type:'Я пойду'}));
//             }

//             notifEvent.emit('send','ADMIN',JSON.stringify({type:'К сожалению, пользователь не пришел на ваше событие',message:req.user.email}));
//         }else{
//             await this.EventService.addOrRemoveCollectionData(eventId,req.user.id,'participantSpot');

//             if(event && event.owner){
//                 notifEvent.emit('send',event.owner._id.toString(),JSON.stringify({type:'message',date_time:new Date(),message:`Пользователь ${userName} ${userSurname} пришел на ваше событие ${event.name}`,link:evLink,notif_type:'Я пойду'}));
//             }

//             notifEvent.emit('send','ADMIN',JSON.stringify({type:'Пользователь пришел на ваше событие',message:req.user.email}));
//         }
//         return res.json({'status':'success'})
//     }
// }

// export default new InPlaceController();