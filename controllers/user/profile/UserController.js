import UserService from "../../../services/UserService.js";
import notifEvent from "../../../events/NotificationEvent.js";
import User from "../../../models/User.js";
import Event from "../../../models/event/Event.js";
import meetingModel from "../../../models/meeting/meetingModel.js";
import companyModel from "../../../models/company/companyModel.js";
import Role from "../../../models/Role.js";

class UserController {
  constructor() {
    this.UserService = new UserService();
  }

  index = async (req, res) => {
    let view = "";
    let usersInfo = {};

    if (req.user.roles.name == "MODERATOR") {

      const getUsers= async(roles, params = {})=>{
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
      }


      usersInfo.users = await getUsers(
        ["USER", "USER"],
        req.query
      );
   
      
      
      view = "profile/moderator/users";
      res.render(view, {
        layout: "profile",
        title: "Profile",
        user: req.user,
        users: usersInfo.users.users,
        usersCount: usersInfo.usersCount,
        q: req.query,
      });
    } else if (req.user.roles.name == "ADMIN") {
      let roles = ["USER", "USER"];
      if (req.query.role) {
        roles = [req.query.role];
      }
      const [users, organizers, visitors, moderators] = await Promise.all([
        this.UserService.getUsersByRole(roles, req.query),
        this.UserService.getUsersByRole(["USER"], req.query),
        this.UserService.getUsersByRole(["USER"], req.query),
        this.UserService.getUsersByRole(["MODERATOR"], req.query),
      ]);
      usersInfo.users = users.users;
      usersInfo.usersCount = users.usersCount;
      usersInfo.organizers = organizers.users;
      usersInfo.visitors = visitors.users;
      usersInfo.moderators = moderators.users;
      view = "profile/admin/users";
      res.render(view, {
        layout: "profile",
        title: "Profile",
        user: req.user,
        users: usersInfo,
        usersCount: usersInfo.usersCount,
        q: req.query,
      });
    }

  };

  single = async (req, res) => {
    // let singleUser1 = await this.UserService.getById(req.params.id);
    let singleUser = await User.findById(req.params.id)
      .populate("event_categories")
      .populate("roles")
      .populate({
        path: "event_visits",
        populate: [
          {
            path: "images",
          },
        ],
      })
      .populate({
        path: "event_likes",
        populate: [
          {
            path: "images",
          },
        ],
      })
      .populate({
        path: "event_favorites",
        populate: [
          {
            path: "images",
          },
        ],
      })
      .populate("event_impression_image")
      .populate("event_comment")
      .lean();
    const events = await Event.find({ owner: req.params.id })
      .populate("images")
      .populate("category")
      .populate({path:"owner",select:"-password"})
      .lean();
      const meetings = await meetingModel.find({ owner: req.params.id })
      .populate("images")
      .populate({path:"userId",select:"-password"})
      .lean();

    const company=await companyModel.find({ owner: req.params.id })
      .populate("images")
      .populate("category")
      .populate("phoneNumbers")
      .populate({path:"services",populate:{path:"serviceRegister",select:"serviceId date status userId text time"}})
      .lean();
    let view = "profile/users-profile/moderator";
    let partCount=0
    for (let z = 0; z < company.length; z++) {
        
        for (let x = 0; x < company[z].services.length; x++) {
            
            partCount=company[z].services[x].serviceRegister.length+partCount
            
            // for (let e = 0; e < company[z].services[x].serviceRegister.length; e++) {
            //   partCount++
              
            // }
        }
        company[z].participantsCount=partCount
        
    }
    
    // for (let i = 0; i < company.services.length; i++) {

    // }
      
    if (singleUser.roles.name == "USER") {
      view = "profile/users-profile/organizer";
    }
    // else if(singleUser.roles.name == 'USER'){
    //     view = 'profile/users-profile/visitor'
    // }

    if (req.query.type && req.query.type == "json") {
      return res.json({ dataEvent: events,dataMeet:meetings,dataComp:company });
    }


    res.render(view, {
      layout: "profile",
      title: "Profile Visitor",
      user: req.user,
      singleUser,
      event_categories: singleUser.event_categories,
      events,
      meetings,
      company,
    });
  };

  block = async (req, res) => {
    let user = await this.UserService.blockOrUnblock(req.params.id);
    
    let msg = "Ваш аккаунт заблокирован администратором";
    if (user.block == 1) {
      msg = "Ваш аккаунт разблокирован администратором";
    }

    notifEvent.emit(
      "send",
      user._id.toString(),
      JSON.stringify({
        type: "message",
        date_time: new Date(),
        message: msg,
        notif_type: "",
      })
    );
    return res.redirect("back");
  };

  destroy = async (req, res) => {
    let user = await this.UserService.destroy(req.params.id);
    return res.redirect("back");
  };

  edit = async (req, res) => {
    const { name, surname, phone_number, email } = req.body;
    let id = req.params.id;
    await this.UserService.update(id, { name, surname, phone_number, email });
    return res.redirect("back");
  };
}

export default new UserController();
