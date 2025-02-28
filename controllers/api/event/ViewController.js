// import EventService from "../../../services/EventService.js";

// class ViewController{
//     constructor(){
//         this.EventService = new EventService()
//     }

//     store = async (req,res) => {
//         const {event_id} = req.body;
//         let view = await this.EventService.existsReturnCreated(event_id,req.user.id,'views')
//         return res.json({'status':'success','message':view ? 'успешно добавлено': 'данные существуют'})
//     }

// }


// export default new ViewController();