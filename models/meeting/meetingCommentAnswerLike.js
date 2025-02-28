import mongoose from 'mongoose';
const { Schema,model } = mongoose;

const AnswerLikes = new Schema({
  user:{type: Schema.Types.ObjectId, ref: 'User' },
  commentId:{ type: Schema.Types.ObjectId, ref: 'meeting_comment' },
  answerId:{ type: Schema.Types.ObjectId, ref: 'meeting_comment_answer' },
  date:{type:String,
  required:true}
}, {
  timestamps: true // This will add createdAt and updatedAt fields
})

export default model('meeting_answer_likes',AnswerLikes)