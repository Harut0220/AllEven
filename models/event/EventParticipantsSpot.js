import mongoose from 'mongoose';
const { Schema,model } = mongoose;

const EventParticipantsSpot = new Schema({
    user:{type:Schema.Types.ObjectId,ref:"User"},
    eventId:{type:Schema.Types.ObjectId,ref:"Event"}
 },{
    timestamps: true // This will add createdAt and updatedAt fields
  })



export default model('event_participants_spot',EventParticipantsSpot)