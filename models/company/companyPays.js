import mongoose from 'mongoose';
import moment from 'moment-timezone';
const { Schema,model } = mongoose;

const ServicePays = new Schema({
  user:{type: Schema.Types.ObjectId, ref: 'User' },
  service:{ type: Schema.Types.ObjectId, ref: 'company_service' },
  registerId:{ type: Schema.Types.ObjectId, ref: 'services_registrations' },
  prepayment: { type: Boolean, default: false },
  prepaymentPrice: { type: Number, default: 0 },
  payment: { type: Boolean, default: false },
  paymentPrice: { type: Number, default: 0 },
  date: { type: Date, default: moment.tz(process.env.TZ).format("DD-MM-YYY HH:mm") }
}, {
  timestamps: true // This will add createdAt and updatedAt fields
})

export default model('service_pays',ServicePays)