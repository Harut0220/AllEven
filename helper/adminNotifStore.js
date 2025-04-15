import NotificationAdmin from "../models/NotificationAdmin.js";

const adminNotifStore = async (data) => {
  try {
    let notif;
    if (data.data) {
      const newMessage = new NotificationAdmin({
        type: data.type,
        message: data.message,
        data: data.data,
      });
      await newMessage.save();
      notif = newMessage;
    } else {
      const newMessage = new NotificationAdmin({
        type: data.type,
        message: data.message,
        data: data.data,
      });
      await newMessage.save();
      notif = newMessage;
    }

    return notif;
  } catch (error) {
    console.error(error);

    return false;
  }
};

export default adminNotifStore;
