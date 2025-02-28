// import EventImpressionImageService from "../../../services/EventImpressionImageService.js"
// import jwt from 'jsonwebtoken'
// class EventImpressionImageController{
//     constructor(){
//         this.EventImpressionImageService = new EventImpressionImageService()
//     }

//     index = async (req,res) => {
        
//         // let datas = await this.EventImpressionImageService.getByCollectionId({'favorites':req.user.id})
//         return res.json({'status':'success','data':'data'})
//     }

//     store = async (req,res) => {
//         let data = {};
//         data.event = req.body.event_id;
//         const authHeader = req.headers.authorization;
//         const token = authHeader.split(" ")[1];

//         const user = jwt.decode(token);
//         data.user = user.id;
//         data.userName = user.name ? user.name : '';
//         data.userSurname = user.surname ? user.surname : '';
//         data.path = req.body.files;
//         // data.images = req.files.images;
//         const imp = await this.EventImpressionImageService.store(data)
//         return res.json({'status':'success','data':imp})
//     }

// }

// export default new EventImpressionImageController();