import mongoose from 'mongoose';
const { Schema,model } = mongoose;

const servicesRegistrations = new Schema({
    serviceId:{type : Schema.Types.ObjectId,ref:"company_service"},
    date:{type:String,required:true},
    dealDate:{type:String,default:""},
    status:{type:Number,default:0},
    user:{ type: Schema.Types.ObjectId, ref: "User" },
    messages:{type:Array},
    dateSlice:{type:String},
    category:{type : Schema.Types.ObjectId,ref:"company_category"},
    pay:{type:Boolean,default:false},
    payStoreId:{type:Schema.Types.ObjectId,ref:"PaysStore"},
    operationId:{type:String,required:true}
}, {
    timestamps: true // This will add createdAt and updatedAt fields
  })



export default model('services_registrations',servicesRegistrations)