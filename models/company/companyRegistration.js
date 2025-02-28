import mongoose from "mongoose";
const { Schema, model } = mongoose;

const companyRegistrations = new Schema({
  user:{type: Schema.Types.ObjectId, ref: 'User' },
  serviceId:{type: Schema.Types.ObjectId, ref: 'company_service' },
  startTime:{type:String,required:true},
  status:{type:Number,default:0},
}, {
  timestamps: true // This will add createdAt and updatedAt fields
});

export default model("company_registrations", companyRegistrations);
