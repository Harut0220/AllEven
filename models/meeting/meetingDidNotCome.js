import mongoose from 'mongoose';
const { Schema,model } = mongoose;

const MeetingDidNotComeUser = new Schema({
    couse:{
        type: String,
        default: null,
    },
    user:{
        type: mongoose.Schema.ObjectId,
        ref: 'User', 
    },
    meeting:{
        type: mongoose.Schema.ObjectId,
        ref: 'Meeting', 
    },
})

export default model('meeting_did_not_come_users',MeetingDidNotComeUser)