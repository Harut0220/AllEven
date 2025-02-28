import mongoose from "mongoose";
const { Schema, model } = mongoose;

const Commission = new Schema(
  {
    price: {
      type: Number,
      required: true,
      default:0
    }
  },
  {
    timestamps: true, // This will add createdAt and updatedAt fields
  }
);

export default model("Commission", Commission);
