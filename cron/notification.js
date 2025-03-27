import cron from "node-cron";
import NotificationService from "../services/NotificationService.js";
import EventService from "../services/EventService.js";
import moment from "moment";
import companyHotDeals from "../models/company/companyHotDeals.js";
import companyHotDealRegistration from "../models/company/companyHotDealRegistration.js";
import companyModel from "../models/company/companyModel.js";


//45
cron.schedule('*/10 * * * *', () => {
  let NotifService = new NotificationService()

  let nowDate = new Date().getTime();

  NotifService.cronByDate(nowDate);

});

cron.schedule('0 0 */15 * * *', () => {
  const EventServ = new EventService();
    EventServ.changeSituation();
});

cron.schedule('0 0-23/1 * * *', () => {
  const EventServ = new EventService();
  EventServ.sendEventNotif()
});

// Schedule a cron job to run every 1 hour   '0 * * * *'
// every 5 minute   */5 * * * *
cron.schedule('0 * * * *', () => {
  const EventServ = new EventService();
  EventServ.sendCreateEventNotif()
});

cron.schedule('0 0 * * *', async() => {
  const hotDealsDb=await companyHotDeals.find({situation:"passed"});

  for(let i=0;i<hotDealsDb.length;i++){
    for(let j=0;j<hotDealsDb[i].registration.length;j++){
       await companyHotDealRegistration.findByIdAndDelete(hotDealsDb[i].registration[j]._id)
    }
    await companyModel.findByIdAndUpdate(hotDealsDb[i].companyId,{$pull:{hotDeals:hotDealsDb[i]._id}})
  }
  await companyHotDeals.deleteMany({situation:"passed"})
});


export default cron;
























// import cron from "node-cron";
// import NotificationService from "../services/NotificationService.js";
// import EventService from "../services/EventService.js";
// import moment from "moment";
// import meetingParticipant from "../models/meeting/meetingParticipant.js";
// import notifEvent from "../events/NotificationEvent.js";
// import companyModel from "../models/company/companyModel.js";
// import meetingModel from "../models/meeting/meetingModel.js";

// //45
// cron.schedule("*/10 * * * *", () => {
//   let NotifService = new NotificationService();

//   let nowDate = new Date().getTime();

//   NotifService.cronByDate(nowDate);
// });

// cron.schedule("0 0 */15 * * *", () => {
//   const EventServ = new EventService();
//   EventServ.changeSituation();
// });

// cron.schedule("0 0-23/1 * * *", () => {
//   const EventServ = new EventService();
//   EventServ.sendEventNotif();
// });

// // Schedule a cron job to run every 1 hour   '0 * * * *'
// // every 5 minute   */5 * * * *
// cron.schedule("0 * * * *", () => {
//   console.log("0 * * * *");

//   const EventServ = new EventService();
//   EventServ.sendCreateEventNotif();
// });

// cron.schedule("*/5 * * * *", async () => {
//   try {
//     console.log("*/5 * * * *");
//     // const meetingParticipantDb =await meetingParticipant.find().populate("meetingId").populate({path:"user",select:"-password"}).exec();
//     const meetingDb = await meetingModel
//       .find()
//       .populate({ path: "user", select: "-password" })
//       .populate("participants")
//       .exec();

//     for (let i = 0; i < meetingDb.length; i++) {
//       const timeMoscow = moment.tz(process.env.TZ).format("YYYY-MM-DD HH:mm");
//       const eventTime = new Date(meetingDb[i].date);
//       const dateNow = new Date(timeMoscow);

//       const timeDifference = eventTime - dateNow;
//       // const timeDifference = data.started_time - timeMoscow;

//       // Convert milliseconds to minutes
//       const differenceInMinutes = timeDifference / 60000; // 60000 ms in one minute

//       if (differenceInMinutes > 0 && differenceInMinutes <= 60) {
//         for (let j = 0; j < meetingDb[i].participants.length; j++) {
//           const organizer = meetingDb[i].user;
//           const link = `alleven://myEvent/${meetingDb[i]._id.toString()}`;
//           notifEvent.emit(
//             "send",
//             meetingDb[i].participants[j].user._id.toString(),
//             JSON.stringify({
//               type: "create_new",
//               date_time: new Date(),
//               message: `Встреча  ${meetingDb[i].purpose} начнется через час. Не пропустите.`,
//               link,
//             })
//           );
//         }

//       }
//     }


//  /////////////////////////////////////////////////////////////


//   } catch (error) {
//     console.error(error);
//   }

// });


// cron.schedule("*/2 * * * *", async () => {
// try {
//   const meetingDb = await meetingModel
//   .find()
//   .populate({ path: "user", select: "-password" })
//   .populate("participants")
//   .exec();
//   for (let i = 0; i < meetingDb.length; i++) {
//     const timeMoscow = moment.tz(process.env.TZ).format("YYYY-MM-DD HH:mm");
//     const eventTime = new Date(meetingDb[i].date);
//     const dateNow = new Date(timeMoscow);

//     const timeDifference = eventTime - dateNow;

//     // Convert milliseconds to minutes
//     const differenceInMinutes = timeDifference / 60000;

//     // Check if the event starts in exactly 1 minute
//     if (differenceInMinutes > -1 && differenceInMinutes <= 1) {
//       for (let j = 0; j < meetingDb[i].participants.length; j++) {
//         const organizer = meetingDb[i].user;
//         const link = `alleven://myEvent/${meetingDb[i]._id.toString()}`;
//         notifEvent.emit(
//           "send",
//           meetingDb[i].participants[j].user._id.toString(),
//           JSON.stringify({
//             type: "create_new",
//             date_time: new Date(),
//             message: `Встреча ${meetingDb[i].purpose} началось.`,
//             link,
//           })
//         );
//       }
//     }
//   }
// } catch (error) {
//   console.error(error);
// }
// });

// cron.schedule("*/5 * * * *", async () => {
//   try {
//     console.log("*/5 * * * *");
//     const meetingParticipantDb = await meetingParticipant
//       .find()
//       .populate("meetingId")
//       .populate({ path: "user", select: "-password" })
//       .exec();

//     for (let i = 0; i < meetingParticipantDb.length; i++) {
//       const meeting = meetingParticipantDb[i].meetingId;
//       const organizer = meeting.user;
//       const link = `alleven://myEvent/${meeting._id.toString()}`;
//       notifEvent.emit(
//         "send",
//         organizer._id.toString(),
//         JSON.stringify({
//           type: "create_new",
//           date_time: new Date(),
//           message: `Разместите информацию о вашем будущем событии.`,
//           link,
//         })
//       );
//     }
//   } catch (error) {
//     console.error(error);
//   }

//   // const EventServ = new EventService();
//   // EventServ.sendCreateEventNotif()
// });

// export default cron;

// // const store = async (data) => {

// //   let ex_notif_type = true;

// //   if (data.user && data.notif_type) {
// //     const user = await UserService.findAndLeanCompany(data.user);
// //     if (
// //       user &&
// //       user.list_of_notifications &&
// //       user.list_of_notifications.length
// //     ) {
// //       for (let l = 0; l < user.list_of_notifications.length; l++) {
// //         if (data.notif_type == user.list_of_notifications[l].name) {
// //           ex_notif_type = true;
// //           break;
// //         }
// //       }
// //     }
// //   }
// //   const getNotificatationListByName = async (name) => {
// //     const getByName = async (name) => {
// //       return NotificatationList.findOne({ name });
// //     };
// //     return await getByName(name);
// //   };
// //   const notificationLists = await getNotificatationListByName(
// //     data.notif_type
// //   );

// //   if (!ex_notif_type && notificationLists) {
// //     return 1;
// //   }

// //   let roles = await Role.find({ name: data.sent }, { _id: 1 });
// //   data.sent = roles;
// //   return await Notification.create(data);
// // };

// // const db = await Company.findOne({
// //   companyName: data.name,
// // });
// // const evLink = `alleven://myEvent/${db._id}`;
// // // console.log("user.id,", user.id);

// // await store({
// //   status: 2,
// //   date_time: moment.tz(process.env.TZ).format("YYYY-MM-DD HH:mm:ss"),
// //   user: user.id,
// //   type: "Новая услуга",
// //   message: `Ваше событие ${db.companyName} находится на модерации`,
// //   categoryIcon: "db.images[0]",
// //   event: db._id,
// //   link: evLink,
// // });
// // const categor = await companyCategory.find({ _id: db.category });
// // notifEvent.emit(
// //   "send",
// //   db.owner.toString(),
// //   JSON.stringify({
// //     type: "Новая услуга",
// //     date_time: moment.tz(process.env.TZ).format("YYYY-MM-DD HH:mm:ss"),
// //     message: `Ваше событие ${db.companyName} находится на модерации`,
// //     categoryIcon: categor.avatar,
// //     link: evLink,
// //   })
// // );

// // const pushInCollection = async (user_id, col_id, col_name) => {
// //   let user = await User.findById(user_id);
// //   user[col_name].push(col_id);
// //   user.last_event_date = moment
// //     .tz(process.env.TZ)
// //     .format("YYYY-MM-DDTHH:mm");
// //   await user.save();
// //   return 1;
// // };

// // await pushInCollection(user.id, db._id, "events");

// // notifEvent.emit(
// //   "send",
// //   "ADMIN",
// //   JSON.stringify({
// //     type: "Новая услуга",
// //     message: "event",
// //     data: db,
// //   })
// // );
