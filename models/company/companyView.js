import mongoose from 'mongoose';
const { Schema,model } = mongoose;

const CompanyViews = new Schema({
  user:{type: Schema.Types.ObjectId, ref: 'User' },
  companyId:{ type: Schema.Types.ObjectId, ref: 'Company' },
  date:{type:String,
  required:true}
}, {
  timestamps: true // This will add createdAt and updatedAt fields
})

export default model('company_views',CompanyViews)