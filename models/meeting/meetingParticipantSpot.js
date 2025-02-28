import mongoose from 'mongoose';
const { Schema,model } = mongoose;

const MeetingParticipantsSpot = new Schema({
    user:{type:Schema.Types.ObjectId,ref:"User"},
    meetingId:{type:Schema.Types.ObjectId,ref:"Meeting"}
 },{
    timestamps: true // This will add createdAt and updatedAt fields
  })



export default model('meeting_participants_spot',MeetingParticipantsSpot)