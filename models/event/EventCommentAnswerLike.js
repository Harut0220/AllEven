import mongoose from 'mongoose';
const { Schema,model } = mongoose;

const EventAnswerLikes = new Schema({
  user:{type: Schema.Types.ObjectId, ref: 'User' },
  answerId:{ type: Schema.Types.ObjectId, ref: 'event_comment_answer' },
  date:{type:String,
  required:true}
}, {
  timestamps: true // This will add createdAt and updatedAt fields
})

export default model('event_answer_likes',EventAnswerLikes)