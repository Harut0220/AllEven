import mongoose from 'mongoose';
const { Schema,model } = mongoose;

const EventRating = new Schema({
    rating:{
        type: Number,
        required : true,
        min: 1, 
        max: 5 
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

export default model('event_rating',EventRating)