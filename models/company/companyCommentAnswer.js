import mongoose from 'mongoose';
const { Schema,model } = mongoose;

const CompanyCommentAnswer = new Schema({
  user:{type: Schema.Types.ObjectId, ref: 'User' },
  commentId:{ type: Schema.Types.ObjectId, ref: 'company_comment' },
  companyId:{ type: Schema.Types.ObjectId, ref: 'Company' },
  text: {type:String,
  required:true},
  date:{type:String,
  required:true},
  likes:[{type:Schema.Types.ObjectId,ref:"comment_answer_likes"}],
  isLike:{type:Boolean,default:false}
}, {
  timestamps: true // This will add createdAt and updatedAt fields
})

export default model('company_comment_answer', CompanyCommentAnswer)