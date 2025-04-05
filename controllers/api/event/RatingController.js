import moment from "moment-timezone";
import Event from "../../../models/event/Event.js";
import EventRating from "../../../models/event/EventRating.js";
import ImpressionsEvent from "../../../models/ImpressionsEvent.js";
import User from "../../../models/User.js";
import EventRatingService from "../../../services/EventRatingService.js";
import jwt from "jsonwebtoken";
import Notification from "../../../models/Notification.js";
import calculateAverageRating from "../../../helper/ratingCalculate.js";
class RatingController {
  constructor() {
    this.EventRatingService = new EventRatingService();
  }

  addRating = async (req, res) => {
    const authHeader = req.headers.authorization;
    const token = authHeader.split(" ")[1];
    const user = jwt.decode(token);

    const { id, rating } = req.body;

    const ev = await Event.findById(id).populate("ratings").exec();

    if (ev) {
      const r = new EventRating({ event: id, user: user.id, rating });
      await r.save();
      const result = await Event.findByIdAndUpdate(
        id,
        { $push: { ratings: r._id } },
        { new: true }
      )
        .populate("ratings")
        .exec();


      const averageRating = calculateAverageRating(result.ratings);

      const userDb = await User.findById(user.id);
      const eventDb = await Event.findById(id)
        .populate("images")
        .populate("category")
        .exec();
      const userEventDb = await User.findById(eventDb.owner._id);
      const ifImpressions = await ImpressionsEvent.findOne({
        event: id,
        user: user.id,
      });
      const date = moment.tz(process.env.TZ).format("YYYY-MM-DD HH:mm");

      if (ifImpressions) {
        await ImpressionsEvent.findByIdAndUpdate(ifImpressions._id, {
          // $set: { rating },
          $set: { date, rating },
        });
      } else {
        const eventImpression = new ImpressionsEvent({
          rating,
          comments: [],
          images: [],
          name: userDb.name,
          surname: userDb.surname,
          avatar: userDb.avatar,
          eventName: eventDb.name,
          eventImage: eventDb.images[0].name,
          event: eventDb._id,
          category: eventDb.category.name,
          user: user.id,
          date,
        });
        await eventImpression.save();
      }
      const updatetedEvent = await Event.findById(id).select("ratings");
      const ratings = updatetedEvent.ratings;

      if (userEventDb._id.toString() !== user.id) {
        const evLink = `alleven://myEvent/${id}`;
        const dataNotif = {
          status: 2,
          date_time: moment.tz(process.env.TZ).format("YYYY-MM-DD HH:mm"),
          user: userEventDb._id.toString(),
          type: "Присоединение",
          navigate: true,
          message: `У вас новое сообщение.`,
          eventId: id,
          link: evLink,
        };
        const nt = new Notification(dataNotif);
        await nt.save();
        if (userEventDb.notifEvent) {
          notifEvent.emit(
            "send",
            userEventDb._id.toString(),
            JSON.stringify({
              type: "Присоединение",
              eventId: id,
              date_time: moment.tz(process.env.TZ).format("YYYY-MM-DD HH:mm"),
              message: `У вас новое сообщение .`,
              navigate: true,
              link: evLink,
            })
          );
        }
      }

      return res
        .status(200)
        .send({ status: "success", ratings, averageRating });
    } else {
      return res
        .status(404)
        .send({ status: "error", message: "Event not found" });
    }
  };
}

export default new RatingController();
