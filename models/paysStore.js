import mongoose, { Types } from "mongoose";
const { Schema, model } = mongoose;

const PaysStore = new Schema(
  {
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    name: {
      type: String,
      required: true,
    },
    surname: {
      type: String,
      required: true,
    },
    companyName: {
      type: String,
      required: true,
    },
    serviceName: {
      type: String,
      required: true,
    },
    operationId: {
      type: String,
      required: false,
    },
    status: {
      type: Number,
      default: 0,
    },
    registerId: {
      type: Schema.Types.ObjectId,
      ref: "services_registrations",
      required: false,
    },
    companyId: {
      type: Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    serviceId: {
      type: Schema.Types.ObjectId,
      ref: "company_service",
      required: true,
    },
    date:{
      type: String,
      default:"0000-00-00 00:00:00"
    },
    payTime:{
      type: String,
      default:"0000-00-00 00:00:00"
    }
  },
  {
    timestamps: true, // This will add createdAt and updatedAt fields
  }
);

export default model("PaysStore", PaysStore);
