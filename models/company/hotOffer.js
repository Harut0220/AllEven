import mongoose from "mongoose";
export const { Schema, model } = mongoose;

const HotOffer = new Schema({
  name: {
    type: String,
    required: true,
  },
  companyId:{ type: Schema.Types.ObjectId, ref: 'Company' }
}, {
  timestamps: true // This will add createdAt and updatedAt fields
});

export default model("company_service", HotOffer);
