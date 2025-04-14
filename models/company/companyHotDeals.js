import mongoose from "mongoose";
const { Schema, model } = mongoose;

const companyHotDeals = new Schema(
  {
    companyId: { type: Schema.Types.ObjectId, ref: "Company" },
    description: { type: String, required: true },
    cost: { type: Number, required: true },
    date: { type: String, required: true },
    registration: { type: Schema.Types.ObjectId, ref: "company_hot_deals_registrations",default:null },
    situation:{type:String,default:"upcoming"},
    free:{type:Boolean,default:true},
    user:{type:Schema.Types.ObjectId,ref:"User"},
  },
  {
    timestamps: true, // This will add createdAt and updatedAt fields
  }
);

export default model("company_hot_deals", companyHotDeals);
