import EventImpressionImage from "../models/event/EventImpressionImages.js";
import UploadService from "./UploadService.js";
import EventService from "./EventService.js";
import NotificationService from "./NotificationService.js";
import notifEvent from "../events/NotificationEvent.js";


class EventImpressionImageService {
  constructor() {
    this.UploadService = new UploadService();
    this.EventService = new EventService();
    this.NotificationService = new NotificationService();
  }

  find = async (id) => {
    return await EventImpressionImage.findById(id);
  };
  store = async (data) => {
    const event = await this.EventService.findAndLean(data.event);
    const userName = data.userName ? data.userName : "";
    const userSurname = data.userSurname ? data.userSurname : "";

    // const msg = `${data.userName} ${data.userSurname} нравится ваше событие ${event.name}`;
    const msg = `Пользователь ${userName} ${userSurname} поделился впечатлениями с пройденного события ${event.name}`;

    if (event.owner && event.owner._id) {
      const evLink = `alleven://myEvent/${event._id}`;
      const notif = await this.NotificationService.store({
        type: "message",
        date_time: new Date(),
        status: 2,
        message: msg,
        user: event.owner._id.toString(),
        link: evLink,
        // categoryIcon: event.category.avatar,
        eventId: event._id,
      });
      if (event.owner.notifEvent) {
        notifEvent.emit(
          "send",
          event.owner._id.toString(),
          JSON.stringify({
            type: "message",
            date_time: new Date(),
            eventId: event._id,
            message: msg,
            notif_type: "Фото/Видео",
            link: evLink,
            // categoryIcon: event.category.avatar,
          })
        );
      }
    }

    const userImpImg = await EventImpressionImage.findOne({
      user: data.user,
      event: event._id,
    });

    if (userImpImg) {
      for (let p = 0; p < data.path.length; p++) {
        userImpImg.path.push(data.path[p]);
        await userImpImg.save();
      }
      return userImpImg;
    }

    return await EventImpressionImage.create(data);
  };

  findByUserEvent = async (user, event) => {
    return await EventImpressionImage.find({ user, event });
  };
}

export default EventImpressionImageService;
