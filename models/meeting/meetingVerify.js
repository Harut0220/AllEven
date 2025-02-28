import mongoose from 'mongoose';
const { Schema,model } = mongoose;

const MeetingVerify = new Schema({
    user:{type:Schema.Types.ObjectId,ref:"User"},
    name:{type:String,required:true},
    family:{type:String,required:true},
    surname:{type:String,required:true},
    passport:{type:String,required:true},
    term:{type:String,required:true},
    passportImage:{type: String,required:true},
    status:{type:Number,default:0}
  }, {
    timestamps: true // This will add createdAt and updatedAt fields
  })



export default model('Meeting_verify',MeetingVerify)