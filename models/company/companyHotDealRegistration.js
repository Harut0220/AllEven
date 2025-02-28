import mongoose from "mongoose";
const { Schema, model } = mongoose;

const companyHotDealRegistrations = new Schema({
  dealId:{type: Schema.Types.ObjectId, ref: 'company_hot_deals' },
  user:{type: Schema.Types.ObjectId, ref: 'User' },
  startTime:{type:String,required:true},
}, {
  timestamps: true // This will add createdAt and updatedAt fields
});

export default model("company_hot_deals_registrations", companyHotDealRegistrations);
