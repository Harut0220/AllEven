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
    company:{
        type: mongoose.Schema.ObjectId,
        ref: 'Company', 
    },
    meeting:{
        type: mongoose.Schema.ObjectId,
        ref: 'Meeting', 
    },
    event_comment:{
        type: mongoose.Schema.ObjectId,
        ref: 'event_comment', 
    },
    company_comment:{
        type: mongoose.Schema.ObjectId,
        ref: 'company_comment', 
    },
    meeting_comment:{
        type: mongoose.Schema.ObjectId,
        ref: 'meeting_comment', 
    },
    event_impression:{
        type: mongoose.Schema.ObjectId,
        ref: 'event_impression_image',
    },
    company_impression:{
        type: mongoose.Schema.ObjectId,
        ref: 'company_impression_image',
    },
    meeting_impression:{
        type: mongoose.Schema.ObjectId,
        ref: 'meeting_impression_image',
    },
    report_type:{
        type: String,
        required : true,
    },

})

export default model('report',Report)