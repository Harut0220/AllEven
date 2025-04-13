import companyModel from "../../models/company/companyModel.js";
import meetingModel from "../../models/meeting/meetingModel.js";
import EventService from "../../services/EventService.js";
import CompanyServiceModel from "../../models/company/companyService.js";
class ShareEventController {
  constructor() {
    this.EventService = new EventService();
  }



  meetIndex = async (req, res) => {
    const meetingId = req.params.id;

    const event = await meetingModel.findById(meetingId).populate("images").populate({path:"user",select:"phone_number"});
    const date=event.date.split(" ")[0]
    const time=event.date.split(" ")[1]


    const countLength=54
    let resultName;
    if(event.purpose.length>countLength){
      resultName = x.slice(0, countLength)+"...";
    }else if(event.purpose.length===countLength||event.purpose.length<countLength){
      resultName=event.purpose
    }
    let resultDescription;
    if(event.description.length>countLength){
      resultDescription = x.slice(0, countLength)+"...";
    }else if(event.description.length===countLength||event.description.length<countLength){
      resultDescription=event.description
    }
    
    res.render("profile/meeting-share", {
      title: resultName,
      event,
      date,
      time,
      description:resultDescription,
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
    //     image: `https://chatapi.trigger.ltd/${event.images[0].name}`,
    //     url: `https://chatapi.trigger.ltd/event/${req.params.id}`,
    //   },
    // });
    let arr=[]

    event.services.map((el)=>{
      arr.push(el.type)
    })
    const serviceName=arr.join(" , ")

    const countLength=54
    let resultName;
    if(event.companyName.length>countLength){
      resultName = event.companyName.slice(0, countLength)+"...";
    }else if(event.companyName.length===countLength||event.companyName.length<countLength){
      resultName=event.companyName
    }
    let resultDescription;
    if(serviceName.length>countLength){
      resultDescription = serviceName.slice(0, countLength)+"...";
    }else if(serviceName.length===countLength||serviceName.length<countLength){
      resultDescription=serviceName
    }

    res.render("profile/company-share", {
      title: resultName,
      event,
      imageHeader:event.images[0].url,
      image: event.images[0],
      images: event.images,
      phone_number:event.owner.phone_number,
      category: event.category.name,
      phone: event.phoneNumbers[0],
      services:event.services,
      serviceName:resultDescription
    });
  };

  indexshare = async (req, res) => {
    const eventId = req.params.id;
    
    const event = await this.EventService.findAndLean(eventId);

    const images = event.images;
    const countLength=54
    let resultName;
    if(event.name.length>countLength){
      resultName = event.name.slice(0, countLength)+"...";
    }else if(event.name.length===countLength||event.name.length<countLength){
      resultName=event.name
    }
    let resultDescription;
    if(event.description.length>countLength){
      resultDescription = event.description.slice(0, countLength)+"...";
    }else if(event.description.length===countLength||event.description.length<countLength){
      resultDescription=event.description
    }


    const imageHeader = event.images[0].name;
    const baseUrl = req.protocol + "://" + req.get("host");
    const date=event.started_time.split(" ")[0]
    const time=event.started_time.split(" ")[1]
    res.render("profile/event-share", {
      title: resultName,
      event,
      date,
      time,
      images,
      phone_number:event.owner.phone_number,
      imageHeader: event.images[0].name,
      imageHeader,
      baseUrl,
      description:resultDescription,
      category: event.category.name,
      meta: {
        title: event.name,
        description: event.description || "Check out this event on AllEven",
        image: `https://chatapi.trigger.ltd/${event.images[0].name}`,
        url: `https://chatapi.trigger.ltd/event/${req.params.id}`,
      },
    });
  };
}

export default new ShareEventController();
