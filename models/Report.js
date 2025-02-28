import mongoose from 'mongoose';
const { Schema,model } = mongoose;

const Report = new Schema({
    name:{
        type: String,
        required : false,
    },
    surname:{
        type: String,
        required : false,
    },
    phone_number:{
        type: String,
        required : false,
    },
    text:{
        type: String,
        required : false,
    },
    event:{
        type: mongoose.Schema.ObjectId,
        ref: 'Event', 
    },
    comment:{
        type: mongoose.Schema.ObjectId,
        ref: 'event_comment', 
    },
    impression:{
        type: mongoose.Schema.ObjectId,
        ref: 'event_impression_image', 
    },

})

export default model('report',Report)