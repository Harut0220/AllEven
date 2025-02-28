import mongoose from 'mongoose';
const { Schema,model } = mongoose;

const ImpressionEvent = new Schema({
    rating:{
        type: Number,
        required : true,
    },
    comments:{type:Array},
    images:{type:Array},
    name:{type:String},
    surname:{type:String},
    avatar:{type:String},
    eventName:{type:String},
    category:{type:String},
    eventImage:{type:String},
    event:{type:mongoose.Schema.ObjectId,ref:'Event'},
    user:{type:mongoose.Schema.ObjectId,ref:'User'},
    date:{type:String,required:true}
})



export default model('ImpressionEvent',ImpressionEvent)