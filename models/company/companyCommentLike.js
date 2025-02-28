import mongoose from "mongoose";
const { Schema, model } = mongoose;

const CompanyCommentLikes = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User" },
    commentId: { type: Schema.Types.ObjectId, ref: "meeting_comment_answer" },
  },
  {
    timestamps: true, // This will add createdAt and updatedAt fields
  }
);

export default model("companyComment_likes", CompanyCommentLikes);
