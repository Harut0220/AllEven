import mongoose from 'mongoose';
const { Schema,model } = mongoose;

const CompanyFavorites = new Schema({
  user: {type: Schema.Types.ObjectId, ref: 'User' },
  companyId:{ type: Schema.Types.ObjectId, ref: 'Company' }
}, {
  timestamps: true // This will add createdAt and updatedAt fields
})

export default model('company_favorites',CompanyFavorites)