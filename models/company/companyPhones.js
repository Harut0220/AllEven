import mongoose from 'mongoose';
const { Schema,model } = mongoose;

const CompanyPhone = new Schema({
  number:{type: String,required:true},
  whatsApp:{type:Boolean,required:true},
  telegram:{type:Boolean,required:true},
  companyId:{ type: Schema.Types.ObjectId, ref: 'Company' }
})

export default model('company_phone',CompanyPhone)