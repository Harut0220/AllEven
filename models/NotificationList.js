import mongoose from 'mongoose';
const { Schema,model } = mongoose;

const NotificationList = new Schema({
    name:{
        type: String,
        required : true,
        unique:true,
        min: 1, 
    },
    role: 
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Role',
    },
})

export default model('notification_list',NotificationList)