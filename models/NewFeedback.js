// import mongoose from 'mongoose';
// const { Schema,model } = mongoose;

// const NewFeedback = new Schema({
//     participants: [
//         {
//             user: {
//                 type: mongoose.Schema.Types.ObjectId,
//                 ref: 'User'
//             }
//         }
//     ],
//     topic:{
//         type: String,
//         default : null,
//     },
//     owner:{
//         type: mongoose.Schema.ObjectId,
//         ref: 'User'
//     },
//     messages:[
//         {
//             content: { type: String },
//             senderId: { type: mongoose.Schema.ObjectId, ref: 'User' },
//             timestamp: { type: Date },
//         }
//     ]
// },{
//     timestamps: true,
// })

// export default model('NewFeedback',NewFeedback)