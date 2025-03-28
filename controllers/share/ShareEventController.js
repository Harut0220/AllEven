import companyModel from "../../models/company/companyModel.js";
import meetingModel from "../../models/meeting/meetingModel.js";
import EventService from "../../services/EventService.js";
import CompanyServiceModel from "../../models/company/companyService.js";
class ShareEventController {
  constructor() {
    this.EventService = new EventService();
  }

  index = async (req, res) => {
    const eventId = req.params.id;
    const event = await this.EventService.findAndLean(eventId);
    const images = event.images;
    const imageHeader = event.images[0].name;
    const baseUrl = req.protocol + "://" + req.get("host");
    res.render("profile/event-share", {
      title: event.name,
      event,
      images,
      imageHeader: event.images[0].name,
      imageHeader,
      baseUrl,
    });
  };

  meetIndex = async (req, res) => {
    const meetingId = req.params.id;
    console.log(meetingId,"meetingId");

    const event = await meetingModel.findById(meetingId).populate("images").populate({path:"user",select:"phone_number"});
    console.log(event,"event");
    const date=event.date.split(" ")[0]
    const time=event.date.split(" ")[1]
    res.render("profile/meeting-share", {
      title: event.purpose,
      event,
      date,
      time,
      images:event.images,
      phone_number:event.user.phone_number,
      imageHeader: event.images[0].path,
      image: event.images[0].path,
      images: event.images,
      category: "",
    });
  };

  companyIndex = async (req, res) => {
    const companyId = req.params.id;
    const event = await companyModel
      .findById(companyId)
      .populate("images")
      .populate("category")
      .populate("phoneNumbers")
      .populate("owner")
      .populate("services")
      .exec();

    // res.render("profile/event-share", {
    //   title: event.name,
    //   event,
    //   images,
    //   imageHeader:event.images[0].name,
    //   imageHeader,
    //   baseUrl,
    //   category:event.category.name,
    //   meta: {
    //     title: event.name,
    //     description: event.description || "Check out this event on AllEven",
    //     image: `https://alleven.ru/${event.images[0].name}`,
    //     url: `https://alleven.ru/event/${req.params.id}`,
    //   },
    // });

    res.render("profile/company-share", {
      title: event.companyName,
      event,
      imageHeader:event.images[0].url,
      image: event.images[0],
      images: event.images,
      phone_number:event.owner.phone_number,
      category: event.category.name,
      phone: event.phoneNumbers[0],
      services:event.services,

    });
  };

  serviceIndex = async (req, res) => {
    const serviceId = req.params.id;
    const event = await CompanyServiceModel.findById(serviceId).populate(
      "images"
    );
    const images = [];
    for (let i = 0; i < event.images.length; i++) {
      const obj = {
        url: event.images[i],
      };
      images.push(obj);
    }

    res.render("share/service", {
      title: event.type,
      event,
      image: event.images[0],
      images,
    });
  };

  indexshare = async (req, res) => {
    const eventId = req.params.id;
    console.log(eventId,"eventId");
    
    const event = await this.EventService.findAndLean(eventId);
    console.log(event,"event");

    const images = event.images;
    
    const imageHeader = event.images[0].name;
    const baseUrl = req.protocol + "://" + req.get("host");
    const date=event.started_time.split(" ")[0]
    const time=event.started_time.split(" ")[1]
    res.render("profile/event-share", {
      title: event.name,
      event,
      date,
      time,
      images,
      phone_number:event.owner.phone_number,
      imageHeader: event.images[0].name,
      imageHeader,
      baseUrl,
      category: event.category.name,
      meta: {
        title: event.name,
        description: event.description || "Check out this event on AllEven",
        image: `https://alleven.ru/${event.images[0].name}`,
        url: `https://alleven.ru/event/${req.params.id}`,
      },
    });
  };
}

export default new ShareEventController();
