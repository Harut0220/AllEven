import mongoose from 'mongoose';
const { Schema,model } = mongoose;

const ImpressionCompany = new Schema({
    rating:{
        type: Number,
        required : true,
    },
    comments:{type:Array},
    images:{type:Array},
    name:{type:String},
    surname:{type:String},
    avatar:{type:String},
    companyName:{type:String},
    companyCategory:{type:String},
    companyImage:{type:String},
    company:{type:mongoose.Schema.ObjectId,ref:'Company'},
})



export default model('ImpressionCompany',ImpressionCompany)