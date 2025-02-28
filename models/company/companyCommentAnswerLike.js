import mongoose from 'mongoose';
const { Schema,model } = mongoose;

const CommentAnswerLikes = new Schema({
  user:{type: Schema.Types.ObjectId, ref: 'User' },
  answerId:{ type: Schema.Types.ObjectId, ref: 'company_comment_answer' },
  date:{type:String,
  required:true},
  isLike:{type:Boolean,default:false}
}, {
  timestamps: true // This will add createdAt and updatedAt fields
})

export default model('comment_answer_likes',CommentAnswerLikes)