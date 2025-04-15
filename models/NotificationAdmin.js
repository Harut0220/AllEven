import mongoose from "mongoose";
const { Schema, model } = mongoose;

const NotificationAdmin = new Schema(
  {
    type: { type: String, required: true },
    message: {
      type: String,
      required: true,
      // default : null
    },
    data: {
      type: Object,
      default: false,
    },
    read:{type:Boolean,default:false}
  },
  {
    timestamps: true,
  }
);

export default model("Notification_admin", NotificationAdmin);
