import moment from "moment";
import Notification from "../../../models/Notification.js";
import User from "../../../models/User.js";
import NotificationService from "../../../services/NotificationService.js";
import jwt from "jsonwebtoken";
import Event from "../../../models/event/Event.js";
import meetingModel from "../../../models/meeting/meetingModel.js";
import companyModel from "../../../models/company/companyModel.js";
import servicesRegistrations from "../../../models/services/servicesRegistrations.js";
import meetingParticipantSpot from "../../../models/meeting/meetingParticipantSpot.js";
import meetingDidNotComeUser from "../../../models/meeting/meetingDidNotComeUser.js";
import EventParticipantsSpot from "../../../models/event/EventParticipantsSpot.js";
import EventDidNotComeUser from "../../../models/event/EventDidNotComeUser.js";

class NotificationController {
  constructor() {
    this.NotificationService = new NotificationService();
  }

  opportunity = async (req, res) => {
    const authHeader = req.headers.authorization;
    // if(authHeader&&authHeader!=="null"){
    const token = authHeader.split(" ")[1];

    const user = jwt.decode(token);

    const userDb = await User.findById(user.id);

    return res
      .status(200)
      .send({
        message: "success",
        eventNotif: userDb.notifEvent,
        companyNotif: userDb.notifCompany,
        meetingNotif: userDb.notifMeeting,
        hotOfferNotif: userDb.notifHotOffer,
      });
    // }else{
    //     return res.status(403).send({message:"Unauthorized"})
    // }
  };

  index = async (req, res) => {
    const notifications = await Notification.find({ user: req.user.id });
    notifications.map(async (el) => {
      el.date_time = moment(el.date_time).tz(process.env.TZ).toDate();
      if (el.type === "confirm_come") {
        const type = el.link.split("/");
        if ((type[2] = "myEvent")) {
          const eventDb = await meetingModel.findById(el.meetingId);
          const eventParticipantSpotDb = await EventParticipantsSpot.findOne({
            eventId: el.eventId,
            user: el.user,
          });
          const eventDidNotComeDb = await EventDidNotComeUser.findOne({
            event: eventDb._id,
            user: el.user,
          });
          if (eventParticipantSpotDb || eventDidNotComeDb) {
            await Notification.findByIdAndUpdate(el._id, {
              $set: { confirmed: true },
            });
            el.confirmed = true;
          }
        }

        if ((type[2] = "singleEvent")) {
          const eventDb = await meetingModel.findById(el.meetingId);
          const eventParticipantSpotDb = await EventParticipantsSpot.findOne({
            eventId: el.eventId,
            user: el.user,
          });
          const eventDidNotComeDb = await EventDidNotComeUser.findOne({
            event: eventDb._id,
            user: el.user,
          });
          if (eventParticipantSpotDb || eventDidNotComeDb) {
            await Notification.findByIdAndUpdate(el._id, {
              $set: { confirmed: true },
            });
            el.confirmed = true;
          }
        }

        if (type[2] === "myMeeting") {
          const meetingDb = await meetingModel.findById(el.meetingId);
          const meetingParticipantSpotDb = await meetingParticipantSpot.findOne(
            { meetingId: el.meetingId, user: el.user }
          );
          const meetingDidNotComeDb = await meetingDidNotComeUser.findOne({
            meeting: meetingDb._id,
            user: el.user,
          });
          if (meetingParticipantSpotDb || meetingDidNotComeDb) {
            await Notification.findByIdAndUpdate(el._id, {
              $set: { confirmed: true },
            });
            el.confirmed = true;
          }
        }

        if (type[2] === "singleCompany") {
          // const eventDb=await companyModel.findById(el.serviceId)
          const register = await servicesRegistrations.findOne({
            _id: el.register,
            pay: true,
          });
          if(register.status===1){
            el.confirmed=true
          }
        }
      }

      if (el.read && el.read.length) {
        for (let n = 0; n < el.read.length; n++) {
          if (el.read[n].toString() == req.user.id) {
            el.read = true;
          } else {
            el.read = false;
          }
        }
      } else {
        el.read = false;
      }
    });
    await this.NotificationService.toRead(req.user);
    notifications.reverse();
    return res.json({ status: "success", data: notifications });
  };

  read = async (req, res) => {
    await this.NotificationService.toRead(req.user);
    return res.json({ status: "success" });
  };

  readOne = async (req, res) => {
    const notifId = req.params.id;
    await this.NotificationService.toReadOne(req.user, notifId);
    return res.json({ status: "success" });
  };

  destroyOne = async (req, res) => {
    const notifId = req.params.id;
    await this.NotificationService.destroy(notifId);
    return res.json({ status: "success" });
  };

  destroy = async (req, res) => {
    const authHeader = req.headers.authorization;

    const token = authHeader.split(" ")[1];
    const user = jwt.decode(token);
    await Notification.deleteMany({ user: user.id });
    return res.json({ status: "success" });
  };
}

export default new NotificationController();
