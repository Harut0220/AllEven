import { EventEmitter } from 'node:events';
import notifCol from "../ws_state/notification.js";
import { admin } from '../config/firebase/messaging.js';
import UserService from '../services/UserService.js';


// Create an instance of UserService
const UserServ = new UserService();

// Create an instance of EventEmitter
const notifEvent = new EventEmitter();

notifEvent.on('send', async (id, data) => {
  try {
    console.log(id,data,"id,data new");
  
    if (id !== 'ADMIN') {
      // Find and lean user data
      let user = await UserServ.findAndLean(id);
      let ex_notif_type = false;
      let json_data = JSON.parse(data);
      
      // Check if notification type already exists in user list
      if (user && user.list_of_notifications && user.list_of_notifications.length) {
        for (let l = 0; l < user.list_of_notifications.length; l++) {
          if (json_data.notif_type === user.list_of_notifications[l].name) {
            ex_notif_type = true;
            break;
          }
        }
      }
  
      // Get notification list by name
      const notificationLists = await UserServ.getNotificatationListByName(json_data.notif_type);
  
      if (!ex_notif_type && notificationLists) {
        return 1;
      }
    }
  
    // Send notification through the socket if connected
    if (notifCol[id]) {
      console.log("123");
      
      if (Object.keys(notifCol[id]).length) {
        notifCol[id].send(data);
      } else {
        console.log('No connected socket id');
      }
    } else {
      if (id !== 'ADMIN') {
        UserServ.sendPushNotif(id, data);
      }
    }
  } catch (error) {
    console.error(error)
  }

});

export default notifEvent;
