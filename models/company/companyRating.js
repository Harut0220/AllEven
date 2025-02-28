import mongoose from 'mongoose';
const { Schema,model } = mongoose;

const CompanyRating = new Schema({
  user:{type: Schema.Types.ObjectId, ref: 'User' },
  companyId:{ type: Schema.Types.ObjectId, ref: 'Company' },
  rating:{ type: Number, default: 0 },
  date:{type:String,required:true},
}, {
  timestamps: true // This will add createdAt and updatedAt fields
})

export default model('company_rating',CompanyRating)