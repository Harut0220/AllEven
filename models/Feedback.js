import mongoose from "mongoose";
const { Schema, model } = mongoose;

const Feedback = new Schema(
  {
    topic: {
      type: String,
      default: null,
    },
    message: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    to: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    parent: {
      type: mongoose.Schema.ObjectId,
      ref: "Feedback",
    },
    sub_message: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Feedback",
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default model("Feedback", Feedback);
