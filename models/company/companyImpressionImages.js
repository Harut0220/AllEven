import mongoose from 'mongoose';
const { Schema,model } = mongoose;

const CompanyImpressionImage = new Schema({
    path:[{
        type: String,
        required : true,
    }],
    user:{
        type: mongoose.Schema.ObjectId,
        ref: 'User', 
    },
    companyId:{
        type: mongoose.Schema.ObjectId,
        ref: 'Company', 
    }, 
})


export default model('company_impression_image',CompanyImpressionImage)