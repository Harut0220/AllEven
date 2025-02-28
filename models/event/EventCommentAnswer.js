import mongoose from 'mongoose';
const { Schema,model } = mongoose;

const EventCommentAnswer = new Schema({
  user:{type: Schema.Types.ObjectId, ref: 'User' },
  commentId:{ type: Schema.Types.ObjectId, ref: 'event_comment' },
  text: {type:String,
  required:true},
  date:{type:String,  required:true},
  likes:[{type:Schema.Types.ObjectId,ref:"event_answer_likes"}],
  isLike:{type:Boolean,default:false}
}, {
  timestamps: true // This will add createdAt and updatedAt fields
})

export default model('event_comment_answer', EventCommentAnswer)