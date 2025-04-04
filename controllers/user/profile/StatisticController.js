import UserService from "../../../services/UserService.js";
import EventService from "../../../services/EventService.js";
import EventCategoryService from "../../../services/EventCategoryService.js";
import moment from "moment-timezone";
import companyCategory from "../../../models/company/companyCategory.js";
import companyModel from "../../../models/company/companyModel.js";
import meetingModel from "../../../models/meeting/meetingModel.js";
class StatisticController{

    constructor(){
        this.UserService = new UserService();
        this.EventService = new EventService();
        this.EventCategoryService = new EventCategoryService();
    }

    index = async (req,res) => {
        let data = {};

        let date = new Date();

        let y = date.getFullYear();
        let m = date.getMonth();

        let secondDate = new Date();
        let thirdDate = new Date();

        secondDate.setMonth(date.getMonth() - 1)
        thirdDate.setMonth(date.getMonth() - 2)

        secondDate = secondDate.getMonth()

        thirdDate = thirdDate.getMonth()

        data.visitors = await this.UserService.getUsersCountByRole('USER');
        // data.organizers = await this.UserService.getUsersCountByRole('USER');

        data.events = {}

        const events = await this.EventService.get();

        if(events.length){

            for await(let event of events){
              let d = moment(event.started_time).utc().format("YYYY-MM").toString();
              if(!data.events[d]){
                data.events[d] = 1
                }
        
                data.events[d] = +data.events[d]+1
        
            }
        
        }


        // data.events[0] = await this.EventService.getByDate(y+'-'+m+'-'+'01',y+'-'+ (m +1)+'-'+'31');
        // data.events[1] = await this.EventService.getByDate(y+'-'+ secondDate+'-'+'01',y+'-'+ m+'-'+'31');
        // data.events[2] = await this.EventService.getByDate(y+'-'+ thirdDate+'-'+'01',y+'-'+ secondDate+'-'+'31');

        data.eventCategories = await this.EventCategoryService.getWithUtilizers()
        const compCat=await companyCategory.find({})
        let compArray=[]
        let compCatArray=[]
        for(let i=0;i<compCat.length;i++){
            
           const comp= await companyModel.find({category:compCat[i]._id})
        //    let obj={category:compCat[i].name,company:comp}  
           compArray.push(comp.length)      
           compCatArray.push(compCat[i])
        }
        
        
        data.companiesCat=compCatArray
        data.companiesLength=compArray
        const meetings=await meetingModel.find({})
        data.meetingLength=meetings.length
        // data.companys= await companyModel.find({})
        // return res.json(data);
        res.render('profile/statistic',{ layout: 'profile', title: "Statistic", user:req.user,data})
    }
}


export default new StatisticController();