import EventService from "../../../services/EventService.js";
import EventCategoryService from "../../../services/EventCategoryService.js";
import companyModel from "../../../models/company/companyModel.js";
import companyCategory from "../../../models/company/companyCategory.js";
import { images } from "mammoth";
import User from "../../../models/User.js";
import meetingModel from "../../../models/meeting/meetingModel.js";
import meetingVerify from "../../../models/meeting/meetingVerify.js";
import companyFavorit from "../../../models/company/companyFavorit.js";
import companyService from "../../../models/company/companyService.js";
import servicesRegistrations from "../../../models/services/servicesRegistrations.js";
import companyComment from "../../../models/company/companyComment.js";
import EventCategory from "../../../models/event/EventCategory.js";
import Event from "../../../models/event/Event.js";
import moment from "moment";
import NotificationService from "../../../services/NotificationService.js";
import notifEvent from "../../../events/NotificationEvent.js";
class EventController {
  constructor() {
    this.EventService = new EventService();
    this.EventCategoryService = new EventCategoryService();
  }





  index = async (req, res) => {
    const { name, category, date_from } = req.query;
    let params = {};
    if (name) {
      params.name = name;
    }

    if (category) {
      params.category = category;
    }

    if (date_from) {
      params.started_time = {
        $gte: new Date(date_from).toISOString(),
      };
    }
    let eventCats = await EventCategory.find({status:1}).sort({createdAt: 'desc'}).populate(['owner','name'])
    let events = await this.EventService.get(params);
    function separateUpcomingAndPassed(events) {
      // const now = moment.tz(process.env.TZ).format("YYYY-MM-DD HH:mm");
      const upcoming = [];
      const passed = [];

      events.forEach((event) => {
        // const eventDate = new Date(event.date);
        if (event.started_time > moment.tz(process.env.TZ).format("YYYY-MM-DD HH:mm")) {
          upcoming.push(event);
        } else {
          passed.push(event);
        }
      });

      return { upcoming, passed };
    }
    const separatedEvents = separateUpcomingAndPassed(events);
    for (let i = 0; i < separatedEvents.passed.length; i++) {
      await Event.findByIdAndUpdate(separatedEvents.passed[i]._id,{$set:{situation:"passed"}})
    }
    let eventsRes = await this.EventService.get(params);
    eventsRes.sort((a, b) => moment(a.createdAt).valueOf() - moment(b.createdAt).valueOf());
    eventsRes.reverse()
     
    res.render("profile/event", {
      layout: "profile",
      title: "Event",
      user: req.user,
      events:eventsRes,
      eventCats,
      eventsCatsLength:eventCats.length,
      q: req.query,
    });
  };

  single = async (req, res) => {
    let template = "profile/event-single";
    let event = await this.EventService.getById(req.params.id);
    let eventCats = await this.EventCategoryService.get();
    if (event.status && event.status != 0 && event.status != 1) {
      template += "-rejected";
    }

    res.render(template, {
      layout: "profile",
      title: "Event Single",
      user: req.user,
      event,
      eventCats,
      favorites:event.favorites.length,
      description:event.description,
      images:event.images,
      views:event.views.length,
      website_link:event.website_link,
      address:event.address,
      participants:event.participants.length,
      likes:event.likes.length,
      started_time:event.started_time,
      // tickets_link:event.tickets_link,
      phone_number:req.user.phone_number,
      category:event.category.name
    });
  };



  singleMeeting=async(req,res)=>{
    let template = "profile/meeting-verify-page";
    let meetVerify = await meetingVerify.findById(req.params.id)
    
    const user=await User.findById(meetVerify.user)
    if (meetVerify.status && meetVerify.status != 0 && meetVerify.status != 1) {
      template += "-rejected";
    }
 
   
    
    res.render(template, {
      layout: "profile",
      title: "Verification",
      user: req.user,
      userMeet: user,
      event:meetVerify,
    });
  }

  edit = async (req, res) => {
    const { name, category, date_from } = req.query;
    let params = {};
    if (name) {
      params.name = name;
    }

    if (category) {
      params.category = category;
    }

    if (date_from) {
      params.started_time = {
        $gte: new Date(date_from).toISOString(),
      };
    }
    let eventCats = await EventCategory.find({status:1}).sort({createdAt: 'desc'}).populate(['owner','name'])
    let events = await this.EventService.get(params);
    function separateUpcomingAndPassed(events) {
      // const now = moment.tz(process.env.TZ).format("YYYY-MM-DD HH:mm");
      const upcoming = [];
      const passed = [];

      events.forEach((event) => {
        // const eventDate = new Date(event.date);
        if (event.started_time > moment.tz(process.env.TZ).format("YYYY-MM-DD HH:mm")) {
          upcoming.push(event);
        } else {
          passed.push(event);
        }
      });

      return { upcoming, passed };
    }
    const separatedEvents = separateUpcomingAndPassed(events);
    for (let i = 0; i < separatedEvents.passed.length; i++) {
      await Event.findByIdAndUpdate(separatedEvents.passed[i]._id,{$set:{situation:"passed"}})
    }
    let eventsRes = await this.EventService.get(params);
    let data = req.body;
    data.status = 1;
    let template = "profile/event-single";
    data.tickets_link_active = data.tickets_link_active ? 1 : 0;
    let event = await this.EventService.update(req.params.id, data);
    const ifEvent=await Event.findById(req.params.id).populate("category").populate("images");
    // let eventCats = await this.EventCategoryService.get();
    if (ifEvent.status &&  ifEvent.status === 2) {
      template = "profile/event-single-rejected";
    }


    
    
    // res.render("profile/event", {
    //   layout: "profile",
    //   title: "Event",
    //   user: req.user,
    //   events:eventsRes,
    //   eventCats,
    //   eventsCatsLength:eventCats.length,
    //   q: req.query,
    // });
   return res.redirect('back')
  };

  reject = async (req, res) => {
    let rejectMessage = req.body.status;
    
    let event = await Event.findByIdAndUpdate(req.params.id, { $set: { status: 2, rejectMessage } });
    const eventIf=await Event.findById(req.params.id).populate("category").populate("images");

    const evLink = `alleven://eventDetail/${event._id}`;


    const dataNotif = {
      status: 2,
      date_time: moment.tz(process.env.TZ).format("YYYY-MM-DD HH:mm"),
      user: event.owner.toString(),
      type: "Новая услуга",
      message: `${event.name} и услуги добавлены в приложение.`,
      createId: event._id,
      categoryIcon: eventIf.category.avatar, //sarqel
      link: evLink,
    };
    const nt = new Notification(dataNotif);
    await nt.save();
    if (dbCompany.owner.notifCompany) {
      notifEvent.emit(
        "send",
        event.owner.toString(),
        JSON.stringify({
          type: "Новая услуга",
          createId: event._id,
          date_time: moment.tz(process.env.TZ).format("YYYY-MM-DD HH:mm"),
          message: `${event.name} и услуги добавлены в приложение.`,
          categoryIcon: eventIf.category.avatar, //sarqel
          link: evLink,
        })
      );
    }
    // if (eventIf.status===2) {
      let eventCats = await this.EventCategoryService.get();

      const template = "profile/event-single-rejected";




    return res.redirect("back");
    //  return  res.render(template, {
    //   layout: "profile",
    //   title: "Event Single",
    //   user: req.user,
    //   event:eventIf,
    //   images:eventIf.images,
    //   eventCats,
    //   category:event.category.name,
    //   phone_number:req.user.phone_number,
    //   key:"1",
    //   category:event.category.name,
    //   participants:event.participants.length,
    //   favorites:event.favorites.length,
    //   views:event.views.length,
    //   likes:event.likes.length,
    //   description:event.description,
    //   started_time:event.started_time,
    //   website_link:event.website_link,
    //   address:event.address

    // });
    // }else{
    //   return res.redirect("back");
    // }
    // return res.redirect("back");
  };


  destroy = async (req,res) => {
    const des_events = req.body.des_events;
    let event = await this.EventService.destroy(des_events);
    return res.redirect('back')
}


  destroyImage = async (req, res) => {
    const eventImgId = req.params.id;
    await this.EventService.destroyImage(eventImgId);
    return res.json({ status: "success" });
  };


  show = async (req, res) => {
    const event = await this.EventService.getById(req.params.id);
    
    const participants=event.participants
    const views=event.views
    res.render("profile/event-show", {
      layout: "profile",
      title: "Event View",
      user: req.user,
      event,
      q: req.query,
      participants,
      views
    });
  };
}

export default new EventController();
