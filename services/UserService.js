import moment from "moment";
import User from "../models/User.js";
import Role from "../models/Role.js";
import bcrypt from "bcryptjs";
import { transporter } from "../config/nodemailer.js";
import GenerateRand from "./GenerateRand.js";
import UploadService from "./UploadService.js";
import { admin } from "../config/firebase/messaging.js";
import Notification from "../models/Notification.js";
import NotificatationListService from "./NotificationListService.js";
import EventCategoryService from "./EventCategoryService.js";

// const allUsers = async function (){
//     let users = await User.find({}).populate({
//         path: 'Role'}).exec();
//     return users;
// }

class UserService {
  constructor() {
    this.GenerateRand = new GenerateRand();
    this.UploadService = new UploadService();
    this.NotificatationListService = new NotificatationListService();
    this.EventCategoryService = new EventCategoryService();
  }

  getAll = async () => {
    let users = await User.find().populate("roles").lean();
    return users;
  };

  getRoleByuser = async (id) => {
    const user = await User.findById(id)
      .select("roles")
      .populate("roles")
      .lean();
    return user.roles.name;
  };

  async create(data, r = "MODERATOR") {
    const role = await Role.findOne({ name: r });
    data.roles = role;

    var salt = bcrypt.genSaltSync(8);
    data.password = bcrypt.hashSync(data.password, salt);
    const user = await User.create(data);
    return user;
  }

  getUsersByRoleObjId = async (roles) => {
    return await User.find({ roles }).lean();
  };

  getUsersByRole = async (roles, params = {}) => {
    let limit = params.limit ? +params.limit : 10;
    let skip = params && +params.page ? +params.page * limit - limit : 0;
    let r = await Role.find({ name: roles }, { _id: 1 }).lean();
    const findObj = {
      roles: r,
    };
    if (params.name) {
      findObj.name = params.name;
    }
    if (params.surname) {
      findObj.surname = params.surname;
    }
    if (params.phone_number) {
      findObj.phone_number = params.phone_number;
    }
    if (params.date_from && params.date_to) {
      findObj.createdAt = {
        $gte: new Date(params.date_from).toISOString(),
        $lte: new Date(params.date_to).toISOString(),
      };
    } else if (params.date_from) {
      findObj.createdAt = {
        $gte: new Date(params.date_from).toISOString(),
      };
    } else if (params.date_to) {
      findObj.createdAt = {
        $lte: new Date(params.date_to).toISOString(),
      };
    }
    let users = User.find(findObj).sort({ createdAt: "desc" });
    let usersCount = await User.countDocuments({ roles: r });
    users = await users.populate("roles").limit(limit).skip(skip).lean();
    return { users, usersCount };
  };

  getById = async (id) => {
    return await User.findById(id)
      .populate([
        "roles",
        {
          path: "events",
          populate: [
            {
              path: "images",
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
              path: "impression_images",
            },
          ],
        },
        {
          path: "event_likes",
          populate: [
            {
              path: "images",
            },
          ],
        },
        {
          path: "event_visits",
          populate: [
            {
              path: "images",
            },
          ],
        },
        {
          path: "event_favorites",
          populate: [
            {
              path: "images",
            },
          ],
        },
        {
          path: "event_impression_image",
        },
        {
          path: "event_comment",
        },
        "event_categories",
      ])
      .lean();
  };

  blockOrUnblock = async (id) => {
    try {
      let user = await User.findById(id);
      await user.updateOne({ block: !user.block });
      await user.save();
      console.log("block or unblock");
      if (user.block) {
        await transporter.sendMail({
          from: process.env.MAIL_USERNAME,
          to: user.email,
          subject: "Hello",
          template: "confirm-user",
        });
      } else {
        await transporter.sendMail({
          from: process.env.MAIL_USERNAME,
          to: user.email,
          subject: "Hello",
          template: "block-user",
        });
      }

      return user;
    } catch (error) {
      console.error(error);
    }
  };

  destroy = async (id) => {
    return await User.findOneAndDelete({ _id: id });
  };

  storeUserByPhoneNumber = async (
    phone_number,
    name,
    surname,
    password,
    role = "USER"
  ) => {
    // let password="12345678"
    const r = await Role.findOne({ name: role });
    let salt = bcrypt.genSaltSync(8);
    password = bcrypt.hashSync(password, salt);
    const user = await User.create({
      phone_number,
      name,
      surname,
      block: 0,
      roles: r,
      password,
    });
    const notificationLists = await this.NotificatationListService.getByRole(r);
    const eventCategories = await this.EventCategoryService.get();

    for (let n = 0; n < notificationLists.length; n++) {
      user.list_of_notifications.push(notificationLists[n]._id);
    }

    for (let ec = 0; ec < eventCategories.length; ec++) {
      user.event_favorite_categories.push(eventCategories[ec]._id);
    }

    await user.save();

    return user;
  };

  storeUserByPhoneNumberImage = async (
    phone_number,
    name,
    surname,
    imagePath,
    password,
    role = "USER"
  ) => {
    const r = await Role.findOne({ name: role });
    let salt = bcrypt.genSaltSync(8);
    password = bcrypt.hashSync(password, salt);
    const user = await User.create({
      phone_number,
      name,
      surname,
      avatar: imagePath,
      block: 0,
      roles: r,
      password,
    });
    const notificationLists = await this.NotificatationListService.getByRole(r);
    const eventCategories = await this.EventCategoryService.get();

    for (let n = 0; n < notificationLists.length; n++) {
      user.list_of_notifications.push(notificationLists[n]._id);
    }

    for (let ec = 0; ec < eventCategories.length; ec++) {
      user.event_favorite_categories.push(eventCategories[ec]._id);
    }

    await user.save();

    return user;
  };

  find = async (id) => {
    const user = await User.findById(id)
      .select(["-password", "-block", "-fcm_token"])
      .populate([
        "event_categories",
        "roles",
        "event_favorite_categories",
        {
          path: "events",
          options: { sort: { createdAt: "desc" } },
          populate: [
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
            // {
            //   path: "favorites",
            //   options: { sort: { createdAt: "desc" } },
            //   select: ["name", "surname", "email", "phone_number", "avatar"],
            // },
            // {
            //   path: "likes",
            //   options: { sort: { createdAt: "desc" } },
            //   select: ["name", "surname", "email", "phone_number", "avatar"],
            // },
            // {
            // path : 'visits',
            // options: { sort: { createdAt: 'desc'  }},
            // select : ['name','surname','email','phone_number','avatar']
            // },
            // {
            // path : 'in_place',
            // options: { sort: { createdAt: 'desc'  }},
            // select : ['name','surname','email','phone_number','avatar']
            // },
          ],
        },
      ]);

    return user;
  };

  findAndLeanCompany = async (id) => {
    return await User.findById(id)
      .select(["-password", "-block", "-fcm_token"])
      .populate([
        "list_of_notifications",
        // "company_favorite_categories",
        "roles",
      ]);
  };

  findAndLean = async (id) => {
    return await User.findById(id)
      .select(["-password", "-block", "-fcm_token"])
      .populate([
        "event_categories",
        "roles",
        "event_favorite_categories",
        "list_of_notifications",
        {
          path: "events",
          options: { sort: { createdAt: "desc" } },
          populate: [
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
              path: "favorites",
              options: { sort: { createdAt: "desc" } },
              select: ["name", "surname", "email", "phone_number", "avatar"],
            },
            {
              path: "likes",
              options: { sort: { createdAt: "desc" } },
              select: ["name", "surname", "email", "phone_number", "avatar"],
            },
            // {
            // path : 'visits',
            // options: { sort: { createdAt: 'desc'  }},
            // select : ['name','surname','email','phone_number','avatar']
            // },
            // {
            // path : 'in_place',
            // options: { sort: { createdAt: 'desc'  }},
            // select : ['name','surname','email','phone_number','avatar']
            // },
          ],
        },
        {
          path: "event_in_place",
          options: { sort: { createdAt: "desc" } },
          populate: [
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
              path: "favorites",
              options: { sort: { createdAt: "desc" } },
              select: ["name", "surname", "email", "phone_number", "avatar"],
            },
            {
              path: "likes",
              options: { sort: { createdAt: "desc" } },
              select: ["name", "surname", "email", "phone_number", "avatar"],
            },
            // {
            // path : 'visits',
            // options: { sort: { createdAt: 'desc'  }},
            // select : ['name','surname','email','phone_number','avatar']
            // },
            // {
            // path : 'in_place',
            // options: { sort: { createdAt: 'desc'  }},
            // select : ['name','surname','email','phone_number','avatar']
            // },
          ],
        },
      ])
      .lean();
  };

  pushInCollection = async (user_id, col_id, col_name) => {
    let user = await this.find(user_id);
    user[col_name].push(col_id);
    user.last_event_date = moment().format("YYYY-MM-DDTHH:mm");
    await user.save();
    return 1;
  };

  destroyFromCollection = async (user_id, col_id, col_name) => {
    let user = await this.find(user_id);

    if (user && user[col_name]) {
      user[col_name].remove(col_id);
      await user.save();

      return user[col_name];
    }
  };

  passwordReset = async (phone_number) => {
    let salt = bcrypt.genSaltSync(8);
    let g = await this.GenerateRand.pin();
    let newPass = bcrypt.hashSync(g, salt);
    let user = await User.findOne({ phone_number }).updateOne({
      password: newPass,
    });
    return g;
  };

  update = async (id, data) => {
    if (data.password) {
      let salt = bcrypt.genSaltSync(8);
      data.password = bcrypt.hashSync(data.password, salt);
    }
    await User.findById(id).updateOne(data);
    return await this.find(id);
  };

  updateByPhone = async (phone_number, data) => {
    if (data.password) {
      let salt = bcrypt.genSaltSync(8);
      data.password = bcrypt.hashSync(data.password, salt);
    }
    return await User.findOne({ phone_number }).updateOne(data);
  };

  getUsersCountByRole = async (roles) => {
    let r = await Role.find({ name: roles }, { _id: 1 }).lean();
    let users = await User.find({ roles: r }).count();

    return users;
  };

  updateAvatar = async (id, avatar) => {
    let user = await this.find(id);

    if (user.avatar) {
      this.UploadService.destroy(user.avatar);
    }

    let path = this.UploadService.store(avatar, "/users");
    user.avatar = path;
    await user.save();
    return user;
  };

  findWithSpec = async (id, spec = []) => {
    let user = User.findById(id);

    if (spec.length && user) {
      user = user.select(spec);
    }
    return await user;
  };

  passwordResetByEmail = async (email) => {
    const user = await User.findOne({ email });
    if (!user) {
      return 0;
    }
    let salt = bcrypt.genSaltSync(8);
    let g = await this.GenerateRand.string(8);
    let newPass = bcrypt.hashSync(g, salt);
    transporter.sendMail({
      from: process.env.MAIL_USERNAME,
      to: user.email,
      subject: "Hello",
      template: "password-reset",
      context: {
        message: g,
      },
    });
    return 1;
  };

  findByPhoneNumber = async (phone_number) => {
    return await User.findOne({ phone_number });
  };

  getDocuments = async (id) => {
    return await User.findById(id).select("documents").lean();
  };

  getSpecCol = async (id, spec) => {
    return User.findById(id).select(spec).populate(spec).lean();
  };

  comeEvents = async (id) => {
    return User.findById(id)
      .select(["event_in_place", "did_not_come"])
      .populate([
        {
          path: "did_not_come",
        },
        {
          path: "event_in_place",
          select: ["_id"],
        },
      ])
      .lean();
  };

  getFcmTokens = async (id) => {
    const user = await User.findById(id).select("fcm_token").lean();
    return user.fcm_token;
  };

  getCountNotif = async (id) => {
    const usr = await this.find(id);
    // console.log(usr, "usr count notif");

    console.log(usr.name, "usr count notif");

    const usrNotifCount = await Notification.find({
      $or: [
        { sent: usr.roles._id, status: 2, read: { $ne: usr._id } },
        { user: usr._id, status: 2, read: { $ne: usr._id } },
      ],
    }).lean();
    console.log(usrNotifCount.length, "usr notif count baza");

    return usrNotifCount.length ? usrNotifCount.length : 0;
  };

  //stexinna
  ////////////////////////////////////////////////////////////////

  // sendPushNotif = async (id, data) => {

  //   const notifConut = await this.getCountNotif(id);
  //   const d = JSON.parse(data);
  //   const tokens = await this.getFcmTokens(id);

  //   if (tokens && tokens.length) {
  //     // const condition = "'stock-GOOG' in topics || 'industry-tech' in topics";
  //     const message = {
  //       data: {
  //         link: d.link ? d.link : "",
  //         categoryIcon: d.categoryIcon ? d.categoryIcon : "",
  //       },
  //       tokens: tokens,
  //       notification: {
  //         title: "AllEven",
  //         body: d.message,
  //         // badge: "1"
  //       },
  //       apns: {
  //         payload: {
  //           aps: {
  //             badge: notifConut,
  //           },
  //         },
  //       },
  //       // condition: condition,
  //     };

  //     admin
  //       .messaging()
  //       .sendMulticast(message)
  //       .then((response) => {
  //         console.log(
  //           response.successCount + " messages were sent successfully"
  //         );
  //       })
  //       .catch((e) => {
  //         console.log(e);
  //         admin
  //           .messaging()
  //           .sendMulticast(message)
  //           .then((response) => {
  //             console.log(
  //               response.successCount + " messages were sent successfully"
  //             );
  //           })
  //           .catch((e) => {
  //             console.log(e);
  //           });
  //       });
  //   }
  // };

  //////////////////////////////////////////////////////////////////////
  //stexinna

  sendPushNotif = async (id, data) => {
    const notifConut = await this.getCountNotif(id);
    const d = JSON.parse(data);
    const tokens = await this.getFcmTokens(id);
    const user = await User.findById(id);
    const token = user.fcm_token;
    if (token.length) {
      for (let i = 0; i < token.length; i++) {
        const element = token[i];

        console.log("Sending notification to:", element);

        const message = {
          notification: {
            title: d.type,
            body: d.message,
          },
          token: element,
          data: {
            link: d.link ? d.link : "",
            categoryIcon: d.categoryIcon ? d.categoryIcon : "",
          },
  
          apns: {
            headers: {
              "apns-priority": "10",
              "apns-push-type": "alert",
            },
            payload: {
              aps: {
                alert: {
                  title: d.type,
                  body: d.message,
                },
                sound: "default",
              },
            },
          },
        };
  
        try {
          const response = await admin.messaging().send(message);
          console.log("Successfully sent message:", response);
        } catch (error) {
          console.error("Error sending message:", error);
  
          if (
            error.errorInfo &&
            error.errorInfo.code === "messaging/registration-token-not-registered"
          ) {
            console.log(`Removing invalid token for user `);
            try {
              console.log(`Token removed for user `);
            } catch (error) {
              console.error(`Error updating database for user:`);
            }
          }
        }
        
      }
    }
  };

  getNotificatationListsAndLean = async () => {
    return await this.NotificatationListService.getAndLean();
  };

  getNotificatationListByName = async (name) => {
    return await this.NotificatationListService.getByName(name);
  };

  getUsersForLastEvent = async (roles) => {
    let r = await Role.find({ name: roles }).distinct("_id");
    console.log(r);
    return await User.find({
      roles: { $in: r },
    }).select(["_id", "name", "last_event_date"]);
  };
}

export default UserService;
