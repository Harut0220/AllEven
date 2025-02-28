import mongoose from 'mongoose';
const { Schema,model } = mongoose;

const Role = new Schema({
    name:{
        type: String,
        required : true,
        unique:true,
        min: 1, 
        max: 65 
    }
})

export default model('Role',Role)