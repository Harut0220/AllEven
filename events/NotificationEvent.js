import { EventEmitter } from 'node:events';
import notifCol from "../ws_state/notification.js";
import { admin } from '../config/firebase/messaging.js';
import UserService from '../services/UserService.js';

const UserServ = new UserService();

class NotificationEvent extends EventEmitter{}

const notifEvent = new NotificationEvent();

notifEvent.on('send', async (id,data) => {
  console.log(id,data,"id,data");
  
  if(id !='ADMIN'){
    let user = await UserServ.findAndLean(id);
    let ex_notif_type = false;
    let json_data = JSON.parse(data)
    
    if(user && user.list_of_notifications && user.list_of_notifications.length){
      for(let l=0;l<user.list_of_notifications.length;l++){
        if(json_data.notif_type == user.list_of_notifications[l].name){
          ex_notif_type = true;
          break;
        }
      }
    }

    const notificationLists = await UserServ.getNotificatationListByName(json_data.notif_type);

    if(!ex_notif_type && notificationLists){
      return 1
    }
  }

  if(notifCol[id]){
    console.log("admin if");
    
    if(Object.keys(notifCol[id]).length){
      console.log("1");
      
      notifCol[id].send(data);
    }else{
      console.log('no connected socket id')
    }
  }else{
    if(id != 'ADMIN'){
      UserServ.sendPushNotif(id,data)
    }
  }
});



export default notifEvent;

// notifEvent.on('send', (id,data) => {
//   if(Object.keys(notifCol).length && notifCol[id]){
//     notifCol[id].send(data);
//   }
// });

