import mongoose from "mongoose";
const { Schema, model } = mongoose;

const CompanyCategory = new Schema({
  name: { type: String ,required:true},
  avatar:{type:String,required:true}
}, {
  timestamps: true // This will add createdAt and updatedAt fields
});

export default model("company_category", CompanyCategory);
