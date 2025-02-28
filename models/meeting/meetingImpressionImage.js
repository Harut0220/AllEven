import mongoose from 'mongoose';
const { Schema,model } = mongoose;

const MeetingImpressionImage = new Schema({
    path:[{
        type: String,
        required : true,
    }],
    user:{
        type: mongoose.Schema.ObjectId,
        ref: 'User', 
    },
    meeting:{
        type: mongoose.Schema.ObjectId,
        ref: 'Meeting', 
    }, 
})


export default model('meeting_impression_image',MeetingImpressionImage)