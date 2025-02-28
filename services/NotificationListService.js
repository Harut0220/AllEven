
import NotificatationList from '../models/NotificationList.js';

class NotificatationListService{

    // get = async () => {
    //   return NotificatationList.find({}).lean();
    // }
    
    getByRole = async (role) => {
      // return NotificatationList.find({role}).select('-role').lean();
      return NotificatationList.find({ $or:[ {role:role},{role:null} ]}).select('-role').lean();
    }

    store = async (data) => {
      return NotificatationList.create(data);
    }

    getAndLean = async () => {
      return NotificatationList.find({}).lean();
    }

    getByName =   async (name) => {
      return NotificatationList.findOne({name});
    }
}


export default NotificatationListService;