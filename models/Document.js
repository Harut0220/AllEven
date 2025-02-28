import mongoose from 'mongoose';
const { Schema,model } = mongoose;

const Document = new Schema({
    path:{
        type: String,
        required : true,
    },
    owners:[
        {
            type: mongoose.Schema.ObjectId,
            ref: 'Role',
        },
    ],
    date:{
        type: String,
        default: "Date.now"
    },
    text:{type: String},
    confirmed:{type:Boolean,default:false}
})

export default model('Document',Document)