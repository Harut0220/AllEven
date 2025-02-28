import companyModel from "../../models/company/companyModel.js";
import meetingModel from "../../models/meeting/meetingModel.js";
import EventService from "../../services/EventService.js";
import CompanyServiceModel from "../../models/company/companyService.js";
class ShareEventController{

    constructor(){
        this.EventService = new EventService();
    }

    index = async (req,res)=>{
        const eventId = req.params.id;
        const event = await this.EventService.findAndLean(eventId);
        const images=event.images;
        const imageHeader=event.images[0].name
        const baseUrl = req.protocol + '://' + req.get('host');
        res.render('share/event',{title: event.name, event,images,imageHeader,baseUrl});
    }

    meetIndex=async (req,res)=>{
        const meetingId = req.params.id;
        const event = await meetingModel.findById(meetingId).populate("images");
        
        
        res.render('share/meeting',{title: event.purpose, event,image:event.images[0],images:event.images});
    }

    companyIndex=async (req,res)=>{
        const companyId = req.params.id;
        const event = await companyModel.findById(companyId).populate("images").populate("category").populate("phoneNumbers")
        res.render('share/company',{title: event.companyName, event,image:event.images[0],images:event.images,category:event.category,phone:event.phoneNumbers[0]});
    }

    serviceIndex=async (req,res)=>{
        const serviceId = req.params.id;
        const event = await CompanyServiceModel.findById(serviceId).populate("images")
        const images=[]
        for (let i = 0; i < event.images.length; i++) {
            const obj={
                url:event.images[i],} 
                images.push(obj);           
        }

        res.render('share/service',{title: event.type, event,image:event.images[0],images});
    }


}

export default new ShareEventController();