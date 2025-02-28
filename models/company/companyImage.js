import mongoose from 'mongoose';
const { Schema,model } = mongoose;

const CompanyImage = new Schema({
  url: {type:String,required:true},
  companyId:{ type: Schema.Types.ObjectId, ref: 'Company' }
}, {
  timestamps: true // This will add createdAt and updatedAt fields
})

export default model('company_image',CompanyImage)