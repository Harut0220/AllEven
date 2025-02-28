import mongoose from 'mongoose';
const { Schema,model } = mongoose;

const EventComment = new Schema({
    text:{
        type: String,
        required : true,
    },
    user:{
        type: mongoose.Schema.ObjectId,
        ref: 'User', 
    },
    event:{
            type: mongoose.Schema.ObjectId,
            ref: 'Event', 
    },
    answer:[
        {
            type: mongoose.Schema.ObjectId,
            ref: 'event_comment_answer',    
        }
    ],
    likes:[
        {
            type: mongoose.Schema.ObjectId,
            ref: 'event_comment_likes',    
        }
    ],
    date:{type:String,
    required:true},
    isLike:{type:Boolean,default:false} 
}, {
    timestamps: true
})


// const autoPopulateChildrens = function (next) {
//     this.populate('childs');
//     next();
// };

// const autoPopulateUser = function (next) {
//     this.populate('user',['name','surname','email','phone_number','avatar']);
//     next();
// };

// EventComment
//     .pre('findOne', autoPopulateChildrens)
//     .pre('find', autoPopulateChildrens)
//     .pre('findOne', autoPopulateUser)
//     .pre('find', autoPopulateUser)

export default model('event_comment',EventComment)