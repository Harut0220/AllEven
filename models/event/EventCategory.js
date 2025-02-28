import mongoose from 'mongoose';
const { Schema,model } = mongoose;

const EventCategory = new Schema({
    name:{
        type: String,
        required : true,
        unique:true,
        min: 1, 
        max: 500 
    },
    avatar:{
        type: String,
        max: 300,
        required: false,
        default: null
    },
    map_avatar:{
        type: String,
        max: 300,
        required: false,
        default: null
    },
    description:{
        type: String,
        required: false,
        max: 50000,
        default: null
    },
    status:{
        type: Number,
        required : false,
        default: 0
    },
    owner:
    {
        type: mongoose.Schema.ObjectId,
        ref: 'User', 
    }

},{
    timestamps: true,
})

EventCategory.virtual('utilizers',{
    ref: 'Event',
    localField: '_id',
    foreignField: 'category',
    count: true
})

export default model('event_category',EventCategory)