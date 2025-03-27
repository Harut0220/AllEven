import mongoose from 'mongoose';
const { Schema,model } = mongoose;

const CompanyParticipants = new Schema({
  user:{type: Schema.Types.ObjectId, ref: 'User' },
  serviceId:{ type: Schema.Types.ObjectId, ref: 'company_service',required:false },
  companyId:{ type: Schema.Types.ObjectId, ref: 'Company' }
}, {
  timestamps: true // This will add createdAt and updatedAt fields
})

export default model('company_participants',CompanyParticipants)