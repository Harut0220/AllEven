import mongoose from 'mongoose';
const { Schema,model } = mongoose;

const EventLikes = new Schema({
  user:{type: Schema.Types.ObjectId, ref: 'User' },
  eventId:{ type: Schema.Types.ObjectId, ref: 'Event' },
  date:{type:String,
  required:true}
}, {
  timestamps: true // This will add createdAt and updatedAt fields
})

export default model('event_likes',EventLikes)