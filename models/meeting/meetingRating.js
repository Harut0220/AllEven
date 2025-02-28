import mongoose from "mongoose";
const { Schema, model } = mongoose;

const MeetingRating = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    meetingId: { type: Schema.Types.ObjectId, ref: "Meeting", required: true },
    rating: { type: Number, default: 0},
    date: { type: String, required: true },
  },
  {
    timestamps: true, // This will add createdAt and updatedAt fields
  }
);

export default model("meeting_rating", MeetingRating);
