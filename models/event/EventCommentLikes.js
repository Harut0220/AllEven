import mongoose from 'mongoose';
const { Schema,model } = mongoose;

const EventCommentLikes = new Schema({
  user:{type: Schema.Types.ObjectId, ref: 'User' },
  commentId:{ type: Schema.Types.ObjectId, ref: 'event_comment' },
  date:{type:String,default:"date"}
}, {
  timestamps: true // This will add createdAt and updatedAt fields
})

export default model('event_comment_likes',EventCommentLikes)