import moment from "moment-timezone";
import Event from "../models/event/Event.js";
import EventImage from "../models/event/EventImage.js";
import UploadService from "./UploadService.js";
import UserService from "./UserService.js";
import EventDidNotComeUser from "../models/event/EventDidNotComeUser.js";
import NotificationService from "./NotificationService.js";
import notifEvent from "../events/NotificationEvent.js";
import EventImpressionImages from "../models/event/EventImpressionImages.js";
import EventCategoryService from "./EventCategoryService.js";
import companyModel from "../models/company/companyModel.js";
import companyImage from "../models/company/companyImage.js";
import mongoose from "mongoose";
import EventComment from "../models/event/EventComment.js";
import EventCommentLikes from "../models/event/EventCommentLikes.js";
import EventCommentAnswer from "../models/event/EventCommentAnswer.js";
import EventLikes from "../models/event/EventLike.js";
import EventFavorites from "../models/event/EventFavorites.js";
import EventParticipantsSpot from "../models/event/EventParticipantsSpot.js";
import EventViews from "../models/event/EventView.js";
import EventRating from "../models/event/EventRating.js";
import EventParticipants from "../models/event/EventParticipants.js";
import EventAnswerLikes from "../models/event/EventCommentAnswerLike.js";
import User from "../models/User.js";
import EventCommentAnswerLike from "../models/event/EventCommentAnswerLike.js";
import Role from "../models/Role.js";
import NotificatationList from "../models/NotificationList.js";
import EventCategory from "../models/event/EventCategory.js";
import Notification from "../models/Notification.js";
import path from "path";
import fs from "fs";
import { dirname } from "path";
import { fileURLToPath } from "url";
import Report from "../models/Report.js";
import ImpressionsEvent from "../models/ImpressionsEvent.js";
import deleteImage from "../helper/imageDelete.js";
import { __dirname } from "../index.js";
import { separateUpcomingAndPassedEvents } from "../helper/upcomingAndPassed.js";
// app.delete("/delete-file", async (req, res) => {
//   const filePathReq = req.query.path;

//   const delImgRes = deleteImage(filePathReq);

//   if (delImgRes.success) {
//     res.status(200).json({ message: "File deleted successfully." });
//   } else {
//     res.status(500).json({ error: delImgRes.error });
//   }
// });

class EventService {
  constructor() {
    this.UserService = new UserService();
    this.NotificationService = new NotificationService();
    this.EventCategoryService = new EventCategoryService();
  }

  myEvents = async (user_id) => {
    const events = await Event.find({ owner: user_id });



    const result = separateUpcomingAndPassedEvents(events);
    return result;
  };

  getByCollectionId = async (coll_obj) => {
    return await Event.find(coll_obj)
      .sort({ started_time: "desc" })
      .populate([
        {
          path: "category",
          select: {
            name: 1,
            description: 1,
            status: 1,
            createdAt: 1,
            updaedAt: 1,
            avatar: 1,
            map_avatar: 1,
            categoryIcon: "$avatar",
          },
        },
        "images",
        "owner",
      ]);
  };

  get = async (params = {}) => {
    let events = Event.find(params);

    // if(params.active){
    //     events = events.or({status:1},{status:2},{status:3},{status:"1"},{status:"2"},{status:"3"});
    // }

    events = events
      .sort({ started_time: "desc" })
      .populate([
        "images",
        {
          path: "category",
          select: {
            name: 1,
            description: 1,
            status: 1,
            createdAt: 1,
            updaedAt: 1,
            avatar: 1,
            map_avatar: 1,
            categoryIcon: "$avatar",
          },
        },
        {
          path: "owner",
          select: ["name", "surname", "email", "phone_number", "avatar"],
        },
      ])
      .lean();
    return await events;
  };

  find = async (id) => {
    return await Event.findById(id).populate([
      "images",
      {
        path: "category",
        select: {
          name: 1,
          description: 1,
          status: 1,
          createdAt: 1,
          updaedAt: 1,
          avatar: 1,
          map_avatar: 1,
          categoryIcon: "$avatar",
        },
      },
      {
        path: "owner",
        select: [
          "_id",
          "name",
          "surname",
          "email",
          "phone_number",
          "avatar",
          "notifEvent",
        ],
      },
      {
        path: "favorites",
        select: ["name", "surname", "email", "phone_number", "avatar"],
      },
      {
        path: "likes",
        select: ["name", "surname", "email", "phone_number", "avatar"],
      },
      // {
      //     path : 'in_place',
      //     select : ['name','surname','email','phone_number','avatar']
      // },
      {
        path: "comments",
        match: {
          parent: null,
        },
        // populate :
        // [
        //     {
        //         path : 'user',
        //         select : ['name','surname','email','phone_number','avatar']

        //     }
        // ]
      },
      "ratings",
      "impression_images",
      {
        path: "participants",
        populate: { path: "user" }[
          ("name", "surname", "email", "phone_number", "avatar")
        ],
      },
      //    {
      //     path : 'in_place',
      //     select : ['name','surname','email','phone_number','avatar']
      //    },
    ]);
  };

  getById = async (id) => {
    return await Event.findById(id)
      .populate([
        {
          path: "category",
          select: {
            name: 1,
            description: 1,
            status: 1,
            createdAt: 1,
            updaedAt: 1,
            avatar: 1,
            map_avatar: 1,
            categoryIcon: "$avatar",
          },
        },
        "images",
        "owner",
        "ratings",
        {
          path: "impression_images",
          populate: { path: "user", select: "name avatar surname" },
        },
        "likes",
        "favorites",
        {
          path: "comments",
          populate: { path: "user" },
        },
        {
          path: "participants",
          populate: { path: "user", select: "name avatar surname" },
          // select:{"name"}
        },
        {
          path: "participantsSpot",
          populate: { path: "user", select: "name avatar surname" },
          // select:{"name"}
        },
        {
          path: "views",
          populate: { path: "user", select: "name avatar surname" },
          // select:{"name"}
        },
      ])
      .lean();
  };

  store = async (data, user) => {
    const d = data.body;
    console.log(data.body,"data body store event");
    
    d.owner = user;

    if (d.images && d.images.length) {
      let imgArr = [];
      for (const image of d.images) {
        let img = await EventImage.create({ name: image });

        imgArr.push(img);
      }
      d.images = imgArr;
    }

    const category = await this.EventCategoryService.findById(d.category);

    let event = await Event.create(d);

    const evLink = `alleven://myEvent/${event._id}`;

    await this.NotificationService.store({
      status: 2,
      date_time: moment.tz(process.env.TZ).format("YYYY-MM-DD HH:mm"),
      user: d.owner,
      navigate: true,
      type: "Новая события",
      message: `Ваше событие ${d.name} находится на модерации`,
      categoryIcon: category.avatar,
      eventId: event._id.toString(),
      link: evLink,
    });

    const userDb = await User.findById(user);
    if (userDb.notifEvent) {
      notifEvent.emit(
        "send",
        d.owner,
        JSON.stringify({
          type: "Новая события",
          navigate: true,
          eventId: event._id.toString(),
          date_time: moment.tz(process.env.TZ).format("YYYY-MM-DD HH:mm"),
          message: `Ваше событие ${d.name} находится на модерации`,
          categoryIcon: category.avatar,
          link: evLink,
        })
      );
    }

    await this.UserService.pushInCollection(user, event._id, "events");
    return event;
  };

  pushInCollection = async (event_id, col_id, col_name) => {
    let event = await this.find(event_id);
    event[col_name].push(col_id);
    await event.save();
    return event[col_name];
  };

  destroyFromCollection = async (event_id, col_id, col_name) => {
    let event = await this.find(event_id);
    event[col_name].remove(col_id);
    await event.save();
    return event[col_name];
  };

  checkCollectionData = async (event_id, col_id, col_name) => {
    let event = await Event.findById(event_id);
    return event[col_name].includes(col_id);
  };

  addOrRemoveCollectionData = async (event_id, col_id, col_name) => {
    let checked = await this.checkCollectionData(event_id, col_id, col_name);
    if (checked) {
      await this.UserService.destroyFromCollection(
        col_id,
        event_id,
        "event_" + col_name
      );
      return await this.destroyFromCollection(event_id, col_id, col_name);
    } else {
      await this.UserService.pushInCollection(
        col_id,
        event_id,
        "event_" + col_name
      );
      return await this.pushInCollection(event_id, col_id, col_name);
    }
  };

  existsReturnCreated = async (event_id, col_id, col_name) => {
    let checked = await this.checkCollectionData(event_id, col_id, col_name);
    if (checked) {
      return 0;
    }

    return await this.pushInCollection(event_id, col_id, col_name);
  };

  // update = async (id, data) => {
  //   const d = data;
  //   if (typeof data.images[0] === "string") {
  //     await Event.findByIdAndUpdate(id, { $set: { images: [] } });

  //     let imgArr = [];
  //     for (let i = 0; i < data.images.length; i++) {
  //       // let img = await EventImage.create({ name: image });
  //       const newImage = new EventImage({ name: data.images[i] });
  //       await newImage.save();
  //       // imgArr.push(newImage);

  //       const dbRes = await Event.findByIdAndUpdate(id, {
  //         $push: { images: newImage._id },
  //       });
  //     }
  //     delete d.images;
  //     await Event.findByIdAndUpdate(id, { ...d });

  //     const eventDb = await Event.findById(id);

  //     return eventDb;
  //   } else {
  //     delete d.images;

  //     const eventDb = await Event.findByIdAndUpdate(
  //       id,
  //       { ...d },
  //       { new: true }
  //     );

  //     return eventDb;
  //   }
  // };

  updateAdmin = async (id, data) => {
    const eventDb = await Event.findById(id);
    const d = data;

    // d.owner = user;

    if (d.images && d.images.length) {
      let imgArr = [];
      for (const image of d.images) {
        let img = await EventImage.create({ name: image });

        imgArr.push(img);
      }
      d.images = imgArr;
    }

    // const category = await this.EventCategoryService.findById(d.category);

    await eventDb.updateOne(d);

    return eventDb;
  };

  update = async (id, data) => {
    const d = data;
    if (typeof data.images[0] === "string") {
      // const __filename = fileURLToPath(import.meta.url);
      // const __dirname = dirname(__filename);
      const eventDbforImg = await Event.findById(id).select({ images: 1 }).populate("images");
      eventDbforImg.images.map(async (imgId) => {
       
       const imageDel=await deleteImage(__dirname, imgId.name);
       
      });
      await Event.findByIdAndUpdate(id, { $set: { images: [] } });

      for (let i = 0; i < data.images.length; i++) {
        const newImage = new EventImage({ name: data.images[i] });
        await newImage.save();

        const dbRes = await Event.findByIdAndUpdate(id, {
          $push: { images: newImage._id },
        });
      }
      delete d.images;
      await Event.findByIdAndUpdate(id, { ...d });

      const eventDb = await Event.findById(id);

      return eventDb;
    } else {
      delete d.images;

      const eventDb = await Event.findByIdAndUpdate(
        id,
        { ...d },
        { new: true }
      );

      return eventDb;
    }
  };

  isValidDate = (d) => {
    return d instanceof Date && !isNaN(d);
  };

  getByDate = async (date_from, date_to) => {
    const dateFrom = new Date(date_from);
    const dateTo = new Date(date_to);

    if (!this.isValidDate(dateFrom) && !this.isValidDate(date_to)) {
      return 0;
    }
    const events = await Event.find({
      createdAt: {
        $gte: new Date(date_from).toISOString(),
        $lte: new Date(date_to).toISOString(),
      },
    }).count();

    return events;
  };

  findManyById = async (IDs) => {
    return Event.find({ _id: IDs });
  };

  // destroy = async (des_events) => {

  //   setTimeout(async () => {

  //   if (Array.isArray(des_events)) {
  //     for (let i = 0; i < des_events.length; i++) {
  //       const event = await Event.findById(des_events[i]);

  //       if (!event) {
  //         throw new Error("Event not found");
  //       }

  //       // Find all related comments
  //       const comments = await EventComment.find({
  //         event: des_events[i],
  //       });

  //       // For each comment, delete related answers and likes
  //       for (const comment of comments) {
  //         // Delete all likes related to the comment
  //         await EventCommentLikes.deleteMany({ commentId: comment._id });

  //         // Find all answers related to the comment
  //         const answers = await EventCommentAnswer.find({
  //           commentId: comment._id,
  //         });

  //         // For each answer, delete related likes
  //         for (const answer of answers) {
  //           await EventAnswerLikes.deleteMany({ answerId: answer._id });
  //         }

  //         // Delete all answers related to the comment
  //         await EventCommentAnswer.deleteMany({ commentId: comment._id });
  //       }

  //       // Delete all comments related to the meeting
  //       await EventComment.deleteMany({ meetingId: des_events[i] });
  //       await EventImage.deleteMany({ meetingId: des_events[i] });
  //       await EventLikes.deleteMany({ meetingId: des_events[i] });
  //       await EventFavorites.deleteMany({ meetingId: des_events[i] });
  //       await EventParticipantsSpot.deleteMany({ meetingId: des_events[i] });
  //       await EventViews.deleteMany({ meetingId: des_events[i] });
  //       await EventRating.deleteMany({ meetingId: des_events[i] });
  //       await EventParticipants.deleteMany({ meetingId: des_events[i] });

  //       await event.remove();
  //       console.log("Meetings and all related data deleted successfully");
  //     }
  //   }
  //   if (typeof des_events === "string") {
  //     const event = await Event.findById(des_events);

  //     if (!event) {
  //       throw new Error("Meeting not found");
  //     }

  //     // Find all related comments
  //     const comments = await EventComment.find({ meetingId: des_events });

  //     // For each comment, delete related answers and likes
  //     for (const comment of comments) {
  //       // Delete all likes related to the comment
  //       await EventCommentLikes.deleteMany({ commentId: comment._id });

  //       // Find all answers related to the comment
  //       const answers = await EventCommentAnswer.find({
  //         commentId: comment._id,
  //       });

  //       // For each answer, delete related likes
  //       for (const answer of answers) {
  //         await EventAnswerLikes.deleteMany({ answerId: answer._id });
  //       }

  //       // Delete all answers related to the comment
  //       await EventCommentAnswer.deleteMany({ commentId: comment._id });
  //     }

  //     // Delete all comments related to the meeting
  //     await EventComment.deleteMany({ meetingId: des_events });
  //     await EventImage.deleteMany({ meetingId: des_events });
  //     await EventLikes.deleteMany({ meetingId: des_events });
  //     await EventFavorites.deleteMany({ meetingId: des_events });
  //     await EventParticipantsSpot.deleteMany({ meetingId: des_events });
  //     await EventViews.deleteMany({ meetingId: des_events });
  //     await EventRating.deleteMany({ meetingId: des_events });
  //     await EventParticipants.deleteMany({ meetingId: des_events });

  //     await event.remove();

  //     console.log("Meeting and all related data deleted successfully");
  //   }
  // },2000)

  //   console.log("successfully deleted");

  //   return { message: "success" };
  // };

  destroy = async (des_events) => {
    if (Array.isArray(des_events)) {
      for (let i = 0; i < des_events.length; i++) {
        const event = await Event.findById(des_events[i]);
        await Notification.deleteMany({ eventId: des_events[i] });
        await Report.deleteMany({ event: des_events[i] });

        if (!event) {
          throw new Error("Event not found");
        }

        for (const imageId of event.images) {
          await EventImage.findByIdAndDelete(imageId);
        }

        const comments = await EventComment.find({
          event: des_events[i],
        });

        for (const comment of comments) {
          await EventCommentLikes.deleteMany({ commentId: comment._id });

          const answers = await EventCommentAnswer.find({
            commentId: comment._id,
          });

          for (const answer of answers) {
            await EventCommentAnswerLike.deleteMany({ answerId: answer._id });
          }

          await EventCommentAnswer.deleteMany({ commentId: comment._id });
        }
        await ImpressionsEvent.deleteMany({ event: des_events[i] });

        await EventComment.deleteMany({ event: des_events[i] });
        // await EventImage.deleteMany({ event: des_events[i] });
        await EventLikes.deleteMany({ eventId: des_events[i] });
        await EventFavorites.deleteMany({ eventId: des_events[i] });
        await EventViews.deleteMany({ eventId: des_events[i] });
        await EventRating.deleteMany({ event: des_events[i] });
        await EventImpressionImages.deleteMany({ event: des_events[i] });
        await EventParticipantsSpot.deleteMany({ eventId: des_events[i] });
        await EventParticipants.deleteMany({ eventId: des_events[i] });
        await User.findByIdAndUpdate(event.owner.toString(), {
          $pull: { events: des_events[i] },
        });
        await event.remove();
        console.log("Event and all related data deleted successfully");
      }
    } else if (typeof des_events === "string") {
      const event = await Event.findById(des_events);
      await Notification.deleteMany({ eventId: des_events });
      await Report.deleteMany({ event: des_events });
      if (!event) {
        throw new Error("Event not found");
      }

      for (const imageId of event.images) {
        await EventImage.findByIdAndDelete(imageId);
      }

      const comments = await EventComment.find({
        companyId: des_events,
      });

      for (const comment of comments) {
        await EventCommentLikes.deleteMany({ commentId: comment._id });

        const answers = await EventCommentAnswer.find({
          commentId: comment._id,
        });

        for (const answer of answers) {
          await EventCommentAnswerLike.deleteMany({ answerId: answer._id });
        }

        await EventCommentAnswer.deleteMany({ commentId: comment._id });
      }
      await ImpressionsEvent.deleteMany({ event: des_events });

      await EventComment.deleteMany({ event: des_events });
      await EventLikes.deleteMany({ eventId: des_events });
      await EventFavorites.deleteMany({ eventId: des_events });
      await EventViews.deleteMany({ eventId: des_events });
      await EventRating.deleteMany({ event: des_events });
      await EventImpressionImages.deleteMany({ event: des_events });
      await EventParticipantsSpot.deleteMany({ eventId: des_events });
      await EventParticipants.deleteMany({ eventId: des_events });
      await User.findByIdAndUpdate(event.owner.toString(), {
        $pull: { events: des_events },
      });
      await event.remove();
    }

    return Event.deleteMany({ _id: des_events });
  };
  nearEvent = async (data) => {
    const user = await this.UserService.find(data.user_id);
    if (
      user.roles.name == "USER" &&
      user.event_favorite_categories &&
      user.event_favorite_categories.length
    ) {
      const categories = [];

      for (let fc = 0; fc < user.event_favorite_categories.length; fc++) {
        categories.push(user.event_favorite_categories[fc]._id.toString());
      }

      var events = Event.find({
        category: { $in: categories },
        location: {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: [data.latitude, data.longitude],
            },
            $maxDistance: 10000,
          },
        },
        $or: [{ status: 1 }, { status: 2 }, { status: 3 }],
      }).sort({ started_time: "desc" });
    } else {
      var events = Event.find({
        location: {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: [data.latitude, data.longitude],
            },
            $maxDistance: 10000,
          },
        },
        $or: [{ status: 1 }, { status: 2 }, { status: 3 }],
      }).sort({ started_time: "desc" });
    }

    events
      .populate([
        "images",
        {
          path: "category",
          select: {
            name: 1,
            description: 1,
            status: 1,
            createdAt: 1,
            updaedAt: 1,
            avatar: 1,
            map_avatar: 1,
            categoryIcon: "$avatar",
          },
        },
        {
          path: "owner",
          select: ["name", "surname", "email", "phone_number", "avatar"],
        },
        {
          path: "favorites",
          select: ["name", "surname", "email", "phone_number", "avatar"],
        },
        {
          path: "likes",
          select: ["name", "surname", "email", "phone_number", "avatar"],
        },
      ])
      .lean();

    return await events;
  };

  changeSituation = async () => {
    const events = await Event.find({})
      .populate([
        {
          path: "category",
          select: {
            name: 1,
            description: 1,
            status: 1,
            createdAt: 1,
            updaedAt: 1,
            avatar: 1,
            map_avatar: 1,
            categoryIcon: "$avatar",
          },
        },
        {
          path: "participants",
          populate: { path: "user", populate: "roles" },
        },
        // {
        //     path : 'in_place',
        //     populate  : 'roles'

        // },
      ])
      .lean();

    const nowDate = new Date();
    const nowMonth = nowDate.getMonth();
    const nowDay = nowDate.getDate();
    const nowYear = nowDate.getFullYear();

    for (let e = 0; e < events.length; e++) {
      let situation = "upcoming";
      let eventDate = new Date(events[e].started_time);
      let eventMonth = eventDate.getMonth();
      let eventDay = eventDate.getDate();
      let eventYear = eventDate.getFullYear();
      let eventMinute = eventDate.getMinutes();
      let eventSecunde = eventDate.getSeconds();

      if (nowYear == eventYear && nowMonth == eventMonth) {
        if (nowDay == eventDay - 1) {
          for (let v = 0; v < events[e].participants.length; v++) {
            if (
              (events[e].participants[v].user.roles.name =
                "USER" && !events[e].situation === "passed")
            ) {
              let ev_st_time = new Date(events[e].started_time);
              ev_st_time.setHours(+ev_st_time.getHours() - 1);
              const evLink = `alleven://myEvent/${events[e]._id}`;

              await this.NotificationService.store({
                status: 1,
                link: evLink,
                date_time: ev_st_time,
                user: events[e].participants[v],
                type: "confirm_come",
                event: events[e]._id,
                message: `Событие ${events[e].name}, начнется через 1 час. Если вы пойдете, не забудьте поделиться впечатлениями!`,
                notif_type: "Событие началось",
                categoryIcon: events[e].category.avatar,
                event: events[e]._id,
              });
            }
          }
        }

        if (nowDay == eventDay) {
          situation = "upcoming";
        } else if (nowDay > eventDay) {
          let evn = await this.find(events[e]._id);
          // evn.status = 3;
          await evn.save();

          situation = "passed";

          for (let p = 0; p < events[e].participantsSpot.length; p++) {
            let evnt = await this.find(events[e]._id);
            evnt.situation = "passed";
            await evnt.save();
          }
        }
      } else if (eventDate.getTime() < nowDate.getTime()) {
        situation = "passed";
      }
      let ev = await this.find(events[e]._id);
      ev.situation = situation;
      await ev.save();
    }
  };

  storeDidNotCome = async (data) => {
    return EventDidNotComeUser.create(data);
  };

  findAndLean = async (id) => {
    return await Event.findById(id)
      .populate([
        "images",
        {
          path: "category",
          select: {
            name: 1,
            description: 1,
            status: 1,
            createdAt: 1,
            updaedAt: 1,
            avatar: 1,
            map_avatar: 1,
            categoryIcon: "$avatar",
          },
        },
        {
          path: "owner",
          select: ["name", "surname", "email", "phone_number", "avatar"],
        },
        {
          path: "favorites",
          select: ["name", "surname", "email", "phone_number", "avatar"],
        },
        {
          path: "likes",
          select: ["name", "surname", "email", "phone_number", "avatar"],
        },
        {
          path: "comments",
          match: {
            parent: null,
          },
          // populate :
          // [
          //     {
          //         path : 'user',
          //         select : ['name','surname','email','phone_number','avatar']

          //     }
          // ]
        },
        "ratings",
        "impression_images",
        "participants",
        //   {
        //     path : 'in_place',
        //     select : ['name','surname','email','phone_number','avatar']
        //   },
      ])
      .lean();
  };

  destroyImage = async (id) => {
    return await EventImage.findByIdAndDelete(id);
  };

  destroyByuser = async (user_id) => {
    return await Event.deleteMany({ owner: user_id });
  };

  sendEventNotif = async () => {
    const events = await Event.find({})
      .populate([
        {
          path: "category",
          select: {
            name: 1,
            description: 1,
            status: 1,
            createdAt: 1,
            updaedAt: 1,
            avatar: 1,
            map_avatar: 1,
            categoryIcon: "$avatar",
          },
        },
        {
          path: "participants",
          populate: { path: "user", populate: "_id roles" },
        },
        // {
        //     path : 'in_place',
        //     populate  : 'roles'

        // },
      ])
      .lean();

    for (let e = 0; e < events.length; e++) {
      let isTodayAndLessOneHours = await this.isTodayAndLessOneHours(
        events[e].started_time
      );
      let isTodayAndMoreHours = await this.isTodayAndLessMoreHours(
        events[e].started_time
      );
      let isTodayNow = await this.isToday(events[e].started_time);

      if (isTodayAndLessOneHours) {
        for (let v = 0; v < events[e].participants.length; v++) {
          if (
            (events[e].participants[v].user.roles.name =
              "USER" && !events[e].situation === "passed")
          ) {
            // let ev_st_time = new Date(events[e].started_time);
            let ev_st_time = moment
              .tz(events[e].started_time, process.env.TZ)
              .format("YYYY-MM-DD HH:mm");

            const evLink = `alleven://myEvent/${events[e]._id}`;
            if (events[e].participants[v].notifEvent) {
              notifEvent.emit(
                "send",
                events[e].participants[v].user._id.toString(),
                JSON.stringify({
                  link: evLink,
                  status: 2,
                  date_time: ev_st_time,
                  user: events[e].participants[v].user._id,
                  type: "confirm_come",
                  message: `Событие ${events[e].name}, начнется через 1 час. Если вы пойдете, не забудьте поделиться впечатлениями!`,
                  // categoryIcon: events[e].category.avatar,
                  eventId: events[e]._id,
                })
              );
            }
            await this.NotificationService.store({
              status: 2,
              date_time: ev_st_time,
              user: events[e].participants[v].user._id,
              type: "confirm_come",
              eventId: events[e]._id,
              message: `Событие ${events[e].name}, начнется через 1 час. Если вы пойдете, не забудьте поделиться впечатлениями!`,
              // type: "Событие началось",
              // categoryIcon: events[e].category.avatar,
              link: evLink,
            });
          }
        }
      } else if (isTodayNow) {
        // for(let v=0;v<events[e].visits.length;v++){
        //     if(events[e].visits[v].roles.name = 'VISITOR' && !events[e].end){
        //         await this.NotificationService.store({status:2,date_time:new Date().toLocaleString(),user:events[e].visits[v],type:'confirm_come',event:events[e]._id,message:`Пожалуйста, подтвердите, что вы придете на ${events[e].name}`, categoryIcon: events[e].category.avatar, event: events[e]._id});
        //         notifEvent.emit('send',events[e].visits[v],JSON.stringify({status:2,date_time:new Date().toLocaleString(),user:events[e].visits[v],type:'confirm_come',event:events[e]._id,message:`Пожалуйста, подтвердите, что вы придете на ${events[e].name}`, categoryIcon: events[e].category.avatar}));
        //     }
        // }
      } else if (isTodayAndMoreHours) {
        for (let p = 0; p < events[e].participantsSpot.length; p++) {
          if (
            events[e].participantsSpot.length &&
            events[e].participantsSpot[p].roles &&
            events[e].participantsSpot[p].roles.name == "USER" &&
            !events[e].situation === "passed"
          ) {
            let msg = `Оцените прошедшее событие ${events[e].name}`;
            const evLink = `alleven://myEvent/${events[e]._id}`;
            await this.NotificationService.store({
              type: "message",
              link: evLink,
              date_time: moment.tz(process.env.TZ).format("YYYY-MM-DD HH:mm"),
              status: 2,
              message: msg,
              user: events[e].participantsSpot[p]._id.toString(),
              situation: "passed",
              // categoryIcon: events[e].category.avatar,
              eventId: events[e]._id,
            });
            if (events[e].participantsSpot[p].notifEvent) {
              notifEvent.emit(
                "send",
                events[e].participantsSpot[p]._id.toString(),
                JSON.stringify({
                  link: evLink,
                  status: 2,
                  date_time: new Date().toLocaleString(),
                  type: "message",
                  message: msg,
                  situation: "passed",
                  // categoryIcon: events[e].category.avatar,
                  eventId: events[e]._id,
                })
              );
            }
          }
        }
      }
    }
  };

  isTodayAndLessOneHours = async (date) => {
    const now = new Date();
    date = new Date(date);

    return (
      date.getDate() === now.getDate() &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear() &&
      date.getHours() - 1 == now.getHours()
    );
  };

  isTodayAndLessMoreHours = async (date) => {
    const now = new Date();
    date = new Date(date);

    return (
      date.getDate() === now.getDate() &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear() &&
      date.getHours() + 3 == now.getHours()
    );
  };

  isToday = async (date) => {
    const now = new Date();
    date = new Date(date);

    return (
      date.getDate() === now.getDate() &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear() &&
      date.getHours() == now.getHours()
    );
  };

  findOwnerImpressions = async (user) => {
    const eventIds = await Event.find({
      owner: user,
      status: 1,
    }).distinct("_id");

    const impressionsIds = await EventImpressionImages.find({
      event: {
        $in: eventIds,
      },
    }).distinct("event");

    return await Event.find({
      _id: { $in: impressionsIds },
    })
      .sort({ started_time: "desc" })
      .populate({
        path: "impression_images",
        select: { images: "$path" },
      })
      .populate([
        "images",
        {
          path: "owner",
          select: ["_id", "avatar", "email", "name", "surname", "phone_number"],
        },
        {
          path: "category",
          select: {
            name: 1,
            description: 1,
            status: 1,
            createdAt: 1,
            updaedAt: 1,
            avatar: 1,
            map_avatar: 1,
            categoryIcon: "$avatar",
          },
        },
      ]);
  };

  findVisitorImpressions = async (user) => {
    const impressionsIds = await EventImpressionImages.find({
      user: user,
    }).distinct("event");
    return await Event.find({
      _id: { $in: impressionsIds },
      status: 1,
    })
      .sort({ started_time: "desc" })
      .populate([
        "images",
        {
          path: "impression_images",
          select: { images: "$path" },
        },
        {
          path: "category",
          select: {
            name: 1,
            description: 1,
            status: 1,
            createdAt: 1,
            updaedAt: 1,
            avatar: 1,
            map_avatar: 1,
            categoryIcon: "$avatar",
          },
        },
        {
          path: "owner",
          select: ["_id", "avatar", "email", "name", "surname", "phone_number"],
        },
      ]);
  };

  sendCreateEventNotif = async () => {
    const organizers = await this.UserService.getUsersForLastEvent(["USER"]);
    for (const organizer of organizers) {
      if (organizer.last_event_date) {
        const lastDate = moment.tz(
          organizer.last_event_date,
          "YYYY-MM-DD HH:mm",
          process.env.TZ
        );
        const dateNow = moment.tz(process.env.TZ).format("YYYY-MM-DD HH:mm");
        const difference = dateNow.diff(lastDate);
        const differenceInHours = Math.round(
          moment.duration(difference).asHours()
        );
        if (differenceInHours == 48) {
          const evLink = `alleven://createEvent`;
          const date_time = moment
            .tz(process.env.TZ)
            .format("YYYY-MM-DD HH:mm");
          const dataNotif = {
            status: 2,
            date_time,
            user: organizer._id.toString(),
            type: "create_new",
            navigate: true,
            message: `Разместите информацию о вашем будущем событии.`,
            link: evLink,
          };
          const nt = new Notification(dataNotif);
          await nt.save();

          notifEvent.emit(
            "send",
            organizer._id.toString(),
            JSON.stringify({
              type: "create_new",
              navigate: true,
              date_time,
              message: `Разместите информацию о вашем будущем событии.`,
              link: evLink,
            })
          );
        }
      }
    }
    //////////////////////////////////////////////////////
    const roleDb = await Role.findOne({ name: "USER" });
    const usersDb = await User.find({ roles: roleDb._id });
    for (let i = 0; i < usersDb.length; i++) {
      const element = usersDb[i];
      if (element.last_meeting_date) {
        const lastDate = moment.tz(
          element.last_meeting_date,
          "YYYY-MM-DD HH:mm",
          process.env.TZ
        );
        const dateNow = moment.tz(process.env.TZ).format("YYYY-MM-DD HH:mm");
        const difference = dateNow.diff(lastDate);
        const differenceInHours = Math.round(
          moment.duration(difference).asHours()
        );
        if (differenceInHours === 48) {
          const link = `alleven://step1`;
          await this.NotificationService.store({
            status: 2,
            date_time: dateNow,
            user: element._id.toString(),
            type: "create_new",
            navigate: true,
            message: `Разместите информацию о вашей будущей встречe.`,
            link,
          });
          if (element.notifMeeting) {
            notifEvent.emit(
              "send",
              element._id.toString(),
              JSON.stringify({
                type: "create_new",
                date_time: dateNow,
                navigate: true,
                message: `Разместите информацию о вашей будущей встречe.`,
                link,
              })
            );
          }
        }
      }

      // if (element.last_meeting_date) {
      //   const lastDate = moment.tz(
      //     element.last_meeting_date,
      //     "YYYY-MM-DD HH:mm:ss",
      //     process.env.TZ
      //   );
      //   const dateNow = moment.tz(process.env.TZ).format("YYYY-MM-DD HH:mm:ss");
      //   const difference = dateNow.diff(lastDate);
      //   const differenceInHours = Math.round(
      //     moment.duration(difference).asHours()
      //   );
      //   if (differenceInHours === 48) {
      //     const evLink = `alleven://create`;
      //     const dataNotif = {
      //       status: 2,
      //       date_time: moment.tz(process.env.TZ).format("YYYY-MM-DD HH:mm"),
      //       user: element._id.toString(),
      //       type: "create_new",
      //       navigate: true,
      //       message: `Разместите информацию о вашем будущем событии.`,
      //       link: evLink,
      //     };
      //     const nt = new Notification(dataNotif);
      //     await nt.save();
      //     notifEvent.emit(
      //       "send",
      //       element._id.toString(),
      //       JSON.stringify({
      //         type: "create_new",
      //         date_time: moment.tz(process.env.TZ).format("YYYY-MM-DD HH:mm"),
      //         navigate: true,
      //         message: `Разместите информацию о вашем будущем событии.`,
      //         link: evLink,
      //       })
      //     );
      //   }
      // }
    }

    return 1;
  };

  destroyByUserId = async (id) => {
    const events = await Event.find({
      owner: id,
    });

    for (let i = 0; i < events.length; i++) {
      if (!events) {
        throw new Error("Event not found");
      }

      const comments = await EventComment.find({
        event: events[i]._id,
      });

      for (const comment of comments) {
        await EventCommentLikes.deleteMany({ commentId: comment._id });

        const answers = await EventCommentAnswer.find({
          commentId: comment._id,
        });

        for (const answer of answers) {
          await EventCommentAnswerLike.deleteMany({ answerId: answer._id });
        }

        await EventCommentAnswer.deleteMany({ commentId: comment._id });
      }

      await EventComment.deleteMany({ event: events[i]._id });
      await EventLikes.deleteMany({ eventId: events[i]._id });
      await EventFavorites.deleteMany({ eventId: events[i]._id });
      await EventViews.deleteMany({ eventId: events[i]._id });
      await EventRating.deleteMany({ event: events[i]._id });
      await EventImpressionImages.deleteMany({ event: events[i]._id });
      await EventParticipantsSpot.deleteMany({ eventId: events[i]._id });
      await EventParticipants.deleteMany({ eventId: events[i]._id });
      await User.findByIdAndUpdate(events[i]._id, {
        $pull: { events: events[i]._id },
      });
      await events.remove();
      console.log("Meetings and all related data deleted successfully");
    }
    return 1;
  };
}

export default EventService;
