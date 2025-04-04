import Feedback from "../models/Feedback.js";
// import NewFeedback from "../models/NewFeedback.js";
// import Messages from "../models/FeedBackMessages.js";

class FeedbackService{

    find = async (id) => {
        return await Feedback.findById(id);
    }

    pushInCollection = async (id,col_id,col_name) => {
        try {
            let c = await this.find(id);
            await Feedback.findByIdAndUpdate(id, {
                $push: { sub_message: col_id}
            })
            // c[col_name].push(col_id);
            // await c.save()
            return 1;
        } catch (error) {
            console.error(error)
        }

    }

    store = async (data) => {
        try {
            let feedback = await Feedback.create(data);
            if(data.parent_id){
                console.log("mtav data.parent_id mej");
                
                await this.pushInCollection(data.parent_id,feedback._id,'sub_message');
                feedback.parent = data.parent_id;
                await feedback.save()
            }
            return await feedback.populate(['parent','user']);
        } catch (error) {
            console.error(error)
        }

    }

    // newStore = async (data) => {
    //     // topic
    //     // message
    //     // user
    //     // let feedback = await Feedback.create(data);
    //     if (!data.parent_id) {
    //         const feedback = new NewFeedback();

    //         feedback.participants.push({ user: data.user });

    //         const newMessage = {
    //             content: data.message,
    //             senderId: data.user
    //         };
    //         feedback.messages.push(newMessage);
    //         feedback.topic = data.topic;
    //         feedback.owner = data.user;
    //         await feedback.save()
    //         return feedback;
    //     } else {
    //         const parentChat = await NewFeedback.findById(data.parent_id);
    //         if (!parentChat) {
    //             console.log('Parent chat not found');
    //             return;
    //         }
    //         parentChat.participants.push({ user: data.user })
    //         const newMessage = {
    //             content: data.message,
    //             senderId: data.user
    //         };
    //         parentChat.messages.push(newMessage)

    //         // Create a new reply chat
    //         // const replyChat = new NewFeedback({
    //         //     parentId: parentId,
    //         //     content: replyContent,
    //         //     senderId: senderId
    //         // });

    //         // Save the reply chat
    //         // const savedReplyChat = await replyChat.save();

    //         // Update the parent chat with the reply
    //         // parentChat.replies.push(savedReplyChat);
    //         // parentChat.updatedAt = new Date();
    //         return await parentChat.save();
    //     }
    //     // let feedback = await NewFeedback.create({

    //     // });
    //     // if(data.parent_id){
    //     //     await this.pushInCollection(data.parent_id,feedback,'sub_message');
    //     //     feedback.parent = data.parent_id;
    //     //     await feedback.save()
    //     // }
    //     // return await feedback.populate(['parent','user']);
    // }

    getByuser = async (id) => {
        return await Feedback.find({parent:null,user:id}).sort({createdAt: 'desc'}).populate('sub_message').populate({
            path : 'user',
            select: { '_id': 1,'name':1,'avatar':1},
            populate : 
            [
                {
                    path : 'roles'
                }
            ]
          }).populate('to','name').lean()
    }

    getByUserId = async (id) => {
        return await Feedback.find({parent:null,user:id}).sort({createdAt: 'desc'}).populate('sub_message').populate({
            path : 'user',
            select: { '_id': 1,'name':1,'avatar':1},
            populate : 
            [
                {
                    path : 'roles'
                }
            ]
          }).populate('to','name').lean()
    }

    all = async () => {
        return await Feedback.find({parent:null}).sort({createdAt: 'desc'}).populate('sub_message').populate({
            path : 'user',
            select: { '_id': 1,'name':1,'avatar':1},
            populate : 
            [
                {
                    path : 'roles'
                }
            ]
          }).populate('to','name').lean()
    }
}

export default FeedbackService;