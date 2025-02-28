import mongoose from 'mongoose';
const { Schema,model } = mongoose;

const EventImpressionImage = new Schema({
    path:[{
        type: String,
        required : true,
    }],
    user:{
        type: mongoose.Schema.ObjectId,
        ref: 'User', 
    },
    event:{
        type: mongoose.Schema.ObjectId,
        ref: 'Event', 
    },
    
})

// const autoPopulateUser = function (next) {
//     this.populate('user',['name','surname','email','phone_number','avatar']);
//     next();
// };

// EventImpressionImage
//     .pre('findOne', autoPopulateUser)
//     .pre('find', autoPopulateUser)

export default model('event_impression_image',EventImpressionImage)