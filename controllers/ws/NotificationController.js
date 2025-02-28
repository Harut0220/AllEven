import notifColl from "../../ws_state/notification.js";

class NotificationController{

    index = async (ws,req) => {
          ws.on('message', function(msg) {
            console.log(msg);
          });
      
          ws.on('close', function(msg) {
              notifColl[req.params.id] = []
              console.log('close');
          });
          
          ws.on('open', function(msg) {
              console.log('open');
          });
      
          ws.on('error', function(msg) {
              notifColl[req.params.id] = []
              console.log('error');
          });
          
          ws.on('upgrade', function(msg) {
              console.log('upgrade');
          });
          
          ws.on('ping', function(msg) {
              console.log('ping');
          });
          
          ws.on('pong', function(msg) {
              console.log('pong');
          });

          notifColl[req.params.id] = ws
    }
}


export default new NotificationController;