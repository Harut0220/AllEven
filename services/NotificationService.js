import Notification from "../models/Notification.js";
import Role from "../models/Role.js";
import UserService from "./UserService.js";
import FeedbackService from "./FeedbackService.js";
import notifEvent from "../events/NotificationEvent.js";
import moment from "moment";

class NotificationService{

    constructor(){
        this.UserService = new UserService();
        this.FeedbackService = new FeedbackService();
    }

    find = async (id) => {
        return Notification.findById(id).populate('sent').lean()
    }

    findByRole = async (user) => {
        // return Notification.find( { $or:[ {sent:user.role,status:2,read:{ $ne: user.id }},{user:user.id,status:2,read:{ $ne: user.id }} ]}).sort({date_time:'desc'}).select(['-sent','-status','-read','-user']).lean()
        return Notification.find( {
            $or:[ {sent:user.role,status:2},{user:user.id,status:2} ]
        }, {
            message: 1,
            type: 1,
            createdAt: 1,
            updatedAt: 1,
            eventId: "$event",
            link: 1,
            categoryIcon: 1,
            parentId: "$feedback",
            event_situation: 1,
            confirmed: 1,
            read: 1
        }).sort({createdAt:'desc'}).select(['-sent','-status','-user']).lean()

    }

    store = async (data) => {
        // let ex_notif_type = false;
        // if(data.user && data.notif_type){
        //     const user = await this.UserService.findAndLean(data.user);
        //     if(user && user.list_of_notifications && user.list_of_notifications.length){
        //         for(let l=0;l<user.list_of_notifications.length;l++){
        //             if(data.notif_type == user.list_of_notifications[l].name){
        //                 ex_notif_type = true;
        //                 break;
        //             }
        //         }
        //     }
        // }
        // const notificationLists = await this.UserService.getNotificatationListByName(data.notif_type);

        
        // if(!ex_notif_type && notificationLists  ){
        //     return 1;
        // }

        let role = await Role.findOne({name:"USER"});
        data.sent = role;
        return await Notification.create(data)
    }

    update = async (id,data) => {
        let roles = await Role.find({name:data.role},{_id:1});
        data.sent = roles[0]._id;
        return await Notification.findById(id).updateOne(data);

    }

    all = async (params = {}) => {
        const notifications = await Notification.find(params)
            .sort({date_time: 'desc'})
            .populate('sent')
            .lean()
        return notifications
    }

    allAggregate = async (params = {}) => {
        const unsortedDocuments = await Notification.find(params)
            .populate('sent')
            .lean()
        const notifications = unsortedDocuments.sort((a, b) => {
            const dateA = new Date(a.date_time);
            const dateB = new Date(b.date_time);
            return dateB - dateA;
        });
        for (const notification of notifications) {
            notification.date_time = moment(new Date(notification.date_time), "YYYY-MM-DDTHH:mm:ss.SSSZ").format('DD-MM-YYYY HH:mm')
        }
        return notifications
    }

    changeStatus = async (id) => {
        let notif = await Notification.findById(id);
        notif.status = notif.status ? 0 : 1;
        return await notif.save();
    }
    
    destroy = async (id) => {
        return await Notification.findOneAndDelete({'_id':id});
    }

    cronByDate = async (nowDate) => {
        let nots = await this.all();
        for(let n=0;n<nots.length;n++){
            // let nDate = moment(new Date(nots[n].date_time), ["YYYY-MM-DDTHH:mm:ss.SSSZ"]).format('x');
            let nDate = new Date(nots[n].date_time).getTime();

            const range = nDate - nowDate;
            if(range > 0 && range <= 600000 && nots[n].status == 1){
                let users = await this.UserService.getUsersByRoleObjId(nots[n].sent);
                for(let u =0;u<users.length;u++){
                    let f = await this.FeedbackService.store({to:users[u]._id,message:nots[n].message})
                    await Notification.create({status:2,date_time:new Date(),user:users[u]._id,type:'message',message:nots[n].message})
                    notifEvent.emit('send',users[u]._id.toString(),JSON.stringify(f))
                }

                await Notification.findByIdAndUpdate(nots[n]._id, {
                    $set: {
                        status: 3
                    }
                });
            }
        }
    }

    toRead = async (user) => {
        // const notifications = await Notification.find({sent:user.role,status:2});
        const notifications = await Notification.updateMany( { $or:[ {sent:user.role,status:2},{user:user.id,status:2} ]}, {
            $addToSet: {
                read: user.id
            }
        });
    }

    toReadOne = async (user,notif_id) => {
        const notif = await Notification.findByIdAndUpdate(
            notif_id,
            {
                $addToSet: {
                    read: user.id
                }
            },
            {
                new: true
            }
        )
    }

    storeAdmin = async (data) => {
        let roles = await Role.find({name:data.sent},{_id:1});
        data.sent = roles[0]._id;
        return await Notification.create(data)
    }

    deleteAll = async () => {
        await Notification.deleteMany({})
    }

    findById = async (id) => {
        const notif = await Notification.findById(id);
        return notif ? notif : false
    }

    changeConfirmByEventId = async (id) => {
        const newNot = await Notification.updateMany(
            {
                event: id,
                type: "confirm_come"
            },
            {
                $set: {
                    confirmed: true
                }
            },
            {new: true}
        );
    }

}

export default NotificationService;