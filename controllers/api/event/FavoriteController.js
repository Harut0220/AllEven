import EventService from "../../../services/EventService.js";
import notifEvent from "../../../events/NotificationEvent.js";
import NotificationService from "../../../services/NotificationService.js";
import EventFavorites from "../../../models/event/EventFavorites.js";
import Event from "../../../models/event/Event.js";
import jwt from "jsonwebtoken";
import User from "../../../models/User.js";
import moment from "moment-timezone";
import Notification from "../../../models/Notification.js";
class FavoriteController {
  constructor() {
    this.EventService = new EventService();
    this.NotificationService = new NotificationService();
  }





  favorite = async (req, res) => {
    const authHeader = req.headers.authorization;
    const token = authHeader.split(" ")[1];

    const user = jwt.decode(token);
    const userDb = await User.findById(user.id).select("name surname");
    const { id } = req.body;

    if (id) {
      const isFavorite = await EventFavorites.findOne({
        user: user.id,
        eventId: id,
      });
      if (isFavorite) {
        const event = await Event.findByIdAndUpdate(
          id,
          {
            $pull: { favorites: isFavorite._id },
          },
          { new: true }
        );
        await User.findByIdAndUpdate(user.id, {
          $pull: { event_favorites: id },
        });
        await EventFavorites.findByIdAndDelete(isFavorite._id);
        return res.json({
          status: "success",
          message: "remove favorite",
          favorites: event.favorites,
        });
      } else {
        const favorite = new EventFavorites({
          user: user.id,
          eventId: id,
          date: moment.tz(process.env.TZ).format("YYYY-MM-DD HH:mm"),
        });
        await favorite.save();
        await User.findByIdAndUpdate(user.id, {
          $push: { event_favorites: id },
        });
        const event = await Event.findByIdAndUpdate(
          id,
          {
            $push: { favorites: favorite._id },
          },
          { new: true }
        ).populate("owner");


        if(user.id !== event.owner._id.toString()){
          const evLink = `alleven://myEvent/${id}`;
          const message=`${userDb.name} ${userDb.surname} добавил(a) в избранное ваше событие.`
          const dataNotif = {
            status: 2,
            date_time: moment.tz(process.env.TZ).format("YYYY-MM-DD HH:mm"),
            user: event.owner._id.toString(),
            type: "Присоединение",
            navigate: true,
            message,
            eventId: id,
            link: evLink,
          };
          const nt = new Notification(dataNotif);
          await nt.save();
          if (event.owner.notifEvent) {
            // const UserDb = await User.findById(user.id);
  
            notifEvent.emit(
              "send",
              event.owner._id.toString(),
              JSON.stringify({
                type: "Присоединение",
                eventId: id,
                date_time: moment.tz(process.env.TZ).format("YYYY-MM-DD HH:mm"),
                message,
                navigate: true,
                link: evLink,
              })
            );
          }
        }


        return res.json({
          status: "success",
          message: "add favorite",
          favorites: event.favorites,
        });
      }
    } else {
      return res.json({ status: "error", message: "error" });
    }
  };
}

export default new FavoriteController();
