import EventService from "../../../services/EventService.js";
import notifEvent from "../../../events/NotificationEvent.js";
import NotificationService from "../../../services/NotificationService.js";
import EventFavorites from "../../../models/event/EventFavorites.js";
import Event from "../../../models/event/Event.js";
import jwt from "jsonwebtoken";
import User from "../../../models/User.js";
import moment from "moment";
class FavoriteController {
  constructor() {
    this.EventService = new EventService();
    this.NotificationService = new NotificationService();
  }

  index = async (req, res) => {
    let datas = await this.EventService.getByCollectionId({
      favorites: req.user.id,
    });
    return res.json({ status: "success", data: datas });
  };

  store = async (req, res) => {
    const { event_id } = req.body;
    const event = await this.EventService.find(event_id);
    let evEx = 0;

    for (let e = 0; e < event.favorites.length; e++) {
      if (event.favorites[e]._id == req.user.id) {
        evEx = 1;
      }
    }

    const userName = req.user.name ? req.user.name : "";
    const userSurname = req.user.surname ? req.user.surname : "";

    if (!evEx && event.owner) {
      const evLink = `alleven://eventDetail/${event._id}`;
      const msg = `Пользователь ${userName} ${userSurname} добавил в «избранное» ваше событие ${event.name}`;
      const notif = await this.NotificationService.store({
        type: "message",
        date_time: new Date(),
        status: 2,
        message: msg,
        user: event.owner._id.toString(),
        link: evLink,
        notif_type: "Добавлено в избранное",
        categoryIcon: event.category.avatar,
        createId: event._id,
      });
    //   if(event.owner.notifEvent){

    //   }
      notifEvent.emit(
        "send",
        event.owner._id.toString(),
        JSON.stringify({
          type: "message",
          date_time: new Date(),
          message: msg,
          createId: event._id,
          link: evLink,
          notif_type: "Добавлено в избранное",
          categoryIcon: event.category.avatar,
        })
      );
    }

    let ev = await this.EventService.addOrRemoveCollectionData(
      event_id,
      req.user.id,
      "favorites"
    );
    return res.json({ status: "success" });
  };

  favorite = async (req, res) => {
    const authHeader = req.headers.authorization;
    const token = authHeader.split(" ")[1];

    const user = jwt.decode(token);
    const { id } = req.body;

    if (id) {
      const isFavorite = await EventFavorites.findOne({
        user: user.id,
        eventId: id,
      });
      if (isFavorite) {
       const event= await Event.findByIdAndUpdate(id, {
          $pull: { favorites: isFavorite._id },
        } , { new: true });
        await User.findByIdAndUpdate(user.id, {
          $pull: { event_favorites: id },
        });
        await EventFavorites.findByIdAndDelete(isFavorite._id);
        return res.json({ status: "success", message: "remove favorite",favorites:event.favorites });
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
       const event= await Event.findByIdAndUpdate(id, {
          $push: { favorites: favorite._id },
        },
        { new: true }
      );

        return res.json({ status: "success", message: "add favorite",favorites:event.favorites });
      }
    } else {
      return res.json({ status: "error", message: "error" });
    }
  };
}

export default new FavoriteController();
