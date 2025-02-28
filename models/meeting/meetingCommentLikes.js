import mongoose from 'mongoose';
const { Schema,model } = mongoose;

const MeetingCommentLikes = new Schema({
  user:{type: Schema.Types.ObjectId, ref: 'User' },
  commentId:{ type: Schema.Types.ObjectId, ref: 'meeting_comment' },
  date:{type:String,
  required:true}
}, {
  timestamps: true // This will add createdAt and updatedAt fields
})

export default model('meetingComment_likes',MeetingCommentLikes)