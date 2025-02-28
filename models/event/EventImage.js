import mongoose from 'mongoose';
const { Schema,model } = mongoose;

const EventImage = new Schema({
    name:{
        type: String,
        required : true,
        // unique:true,
        min: 1, 
        max: 20000
    }
})

export default model('event_image',EventImage)