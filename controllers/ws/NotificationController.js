// import notifColl from "../../ws_state/notification.js";

// class NotificationController {
//   index = async (ws, req) => {
//     ws.on("message", function (msg) {
//       console.log(msg);
//     });

//     ws.on("close", function (msg) {
//       notifColl[req.params.id] = [];
//       console.log("close");
//     });

//     ws.on("open", function (msg) {
//       console.log("open");
//     });

//     ws.on("error", function (msg) {
//       notifColl[req.params.id] = [];
//       console.log("error");
//     });

//     ws.on("upgrade", function (msg) {
//       console.log("upgrade");
//     });

//     ws.on("ping", function (msg) {
//       console.log("ping");
//     });

//     ws.on("pong", function (msg) {
//       console.log("pong");
//     });

//     notifColl[req.params.id] = ws;
//     ws.send("connected")
//   };
// }

// export default new NotificationController();

import notifColl from "../../ws_state/notification.js";

class NotificationController {
  index = async (ws, req) => {
    console.log(`New WebSocket connection for ID: ${req.params.id}`);

    notifColl[req.params.id] = ws; // Store WebSocket connection

    ws.on("message", (msg) => {
      console.log(`Received message from ${req.params.id}:`, msg);
    });

    ws.on("close", () => {
      console.log(`WebSocket closed for ID: ${req.params.id}`);
      delete notifColl[req.params.id]; // Remove disconnected WebSocket
    });

    ws.on("error", (error) => {
      console.error(`WebSocket error for ${req.params.id}:`, error);
    });

    // ws.send(JSON.stringify({ message: "WebSocket connected!" }));
  };
}

export default new NotificationController();

