import mongoose from "mongoose";
export const { Schema, model } = mongoose;

const CompanyServiceModel = new Schema({
  type: {type:String,default:""},
  description: {type:String,default:""},
  images: {type:Array,required:true},
  cost: {type:Number,default:0},
  companyId:{ type: Schema.Types.ObjectId, ref: 'Company' },
  serviceRegister:[{ type: Schema.Types.ObjectId, ref: "services_registrations" }]
}, {
  timestamps: true // This will add createdAt and updatedAt fields
});

export default model("company_service", CompanyServiceModel);
