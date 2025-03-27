import mongoose from "mongoose";
const { Schema, model } = mongoose;

const companyHotDealRegistrations = new Schema(
  {
    dealId: { type: Schema.Types.ObjectId, ref: "company_hot_deals" },
    user: { type: Schema.Types.ObjectId, ref: "User" },
    startTime: { type: String, required: true },
    status: { type: Boolean, default: false },
    pay: { type: Boolean, default: false },
    companyId: { type: Schema.Types.ObjectId, ref: "Company" },
    date: { type: String, required: true },
    payTime: { type: String, default: "0000-00-00 00:00:00" },
  },
  {
    timestamps: true, // This will add createdAt and updatedAt fields
  }
);

export default model(
  "company_hot_deals_registrations",
  companyHotDealRegistrations
);
