import EventService from "../../../services/EventService.js";
import NotificationService from "../../../services/NotificationService.js";
import notifEvent from "../../../events/NotificationEvent.js";
import UserService from "../../../services/UserService.js";
import jwt from "jsonwebtoken";
import Notification from "../../../models/Notification.js";
import Event from "../../../models/event/Event.js";
import EventParticipants from "../../../models/event/EventParticipants.js";
import moment from "moment-timezone";
class InPlaceController {
  constructor() {
    this.EventService = new EventService();
    this.UserService = new UserService();
    this.NotificationService = new NotificationService();
  }

  index = async (req, res) => {
    const event = await this.EventService.find(req.query.event_id);

    // const datas = await this.UserService.comeEvents(req.user.id);
    return res.json({ status: "success", data: event.participantsSpot });
  };

  store = async (req, res) => {
    const { id, couse } = req.body;
    console.log(couse,id, "couse");

    const notif = await this.NotificationService.findById(id);
    const  eventId = notif.eventId;
    await this.NotificationService.changeConfirmByEventId(eventId);
    const event = await this.EventService.find(eventId);
    const EventParticipantsDb=await EventParticipants.findOne({user:req.user.id,eventId})
    await Event.findByIdAndUpdate(eventId,{$push:{did_not_come_events:EventParticipantsDb._id}})


    if (!event) {
      return res.status(404).send({ status: false, message: "событие не найдено" });
    }

    const evLink = `alleven://myEvent/${event._id}`;

    const userName = req.user.name ? req.user.name : "";
    const userSurname = req.user.surname ? req.user.surname : "";
      await this.EventService.storeDidNotCome({
        user: req.user.id,
        event: eventId,
        couse,
      });

      const date_time = moment.tz(process.env.TZ).format();
      const dataNotif = {
        status: 2,
        date_time: moment.tz(process.env.TZ).format("YYYY-MM-DD HH:mm"),
        user: event.owner._id.toString(),
        type: "message",
        navigate:true,
        message: `К сожалению, пользователь ${userName} ${userSurname} не пришел на ваше событие ${event.name}.`,
        eventId: event._id.toString(),
        link: evLink,
        date_time,
      };
      const nt = new Notification(dataNotif);
      await nt.save();

      if (event && event.owner&&event.owner._id) {
        notifEvent.emit(
          "send",
          event.owner._id.toString(),
          JSON.stringify({
            type: "message",
            eventId,
            date_time,
            navigate:true,
            message: `К сожалению, пользователь ${userName} ${userSurname} не пришел на ваше событие ${event.name}`,
            link: evLink,
            date_time
          })
        );
      }
    
    return res.status(200).send({ status: "success" });
  };
}

export default new InPlaceController();
