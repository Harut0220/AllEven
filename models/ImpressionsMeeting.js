import mongoose from "mongoose";
const { Schema, model } = mongoose;

const ImpressionMeeting = new Schema({
  rating: { type: Number },
  comments: { type: Array },
  images: { type: Array },
  name: { type: String },
  surname: { type: String },
  avatar: { type: String },
  meetingName: { type: String },
  meetingImage: { type: String },
  meeting: { type: mongoose.Schema.ObjectId, ref: "Meeting" },
});

export default model("ImpressionMeeting", ImpressionMeeting);
