import mongoose from 'mongoose';
const { Schema,model } = mongoose;

const EventDidNotComeUser = new Schema({
    couse:{
        type: String,
        default: null,
    },
    user:{
        type: mongoose.Schema.ObjectId,
        ref: 'User', 
    },
    event:{
        type: mongoose.Schema.ObjectId,
        ref: 'Event', 
    },
})

export default model('event_did_not_come_users',EventDidNotComeUser)