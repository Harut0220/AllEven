import mongoose from "mongoose";
const { Schema, model } = mongoose;

const Event = new Schema(
  {
    name: {
      type: String,
      required: true,
      min: 1,
      max: 300,
    },
    description: {
      type: String,
      required: false,
      max: 50000,
      default: null,
    },
    description_visit: {
      type: String,
      required: false,
      max: 50000,
      default: null,
    },
    started_time: {
      // type:Date,
      type: String,
      required: true,
    },
    // joinng_time:{
    //     // type:Date,
    //     type:String,
    //     required:true,
    // },
    tickets_link: {
      type: String,
      required: false,
      max: 5000,
      default: null,
    },
    tickets_link_active: {
      type: Boolean,
      required: false,
      default: 0,
    },
    website_link: {
      type: String,
      required: false,
      default: null,
    },
    address: {
      type: String,
      required: false,
      default: null,
    },
    category: {
      type: mongoose.Schema.ObjectId,
      ref: "event_category",
    },
    images: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "event_image",
      },
    ],
    owner: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    likes: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "event_likes",
      },
    ],
    favorites: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "event_favorites",
      },
    ],
    participants: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "event_participants",
      },
    ],
    ratingCalculated: { type: Number, default: 0 },
    views: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "event_views",
      },
    ],
    hour: { type: Boolean, default: false },
    participantsSpot: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "event_participants_spot",
      },
    ],
    ratings: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "event_rating",
      },
    ],
    status: {
      type: Number,
      required: false,
      default: 0,
    },
    kilometr: { type: Number, default: 0 },
    comments: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "event_comment",
      },
    ],

    kilometr: {
      type: Number,
      default: 0,
    },
    situation: {
      type: String,
      // enum: ["passing", "upcoming", "passed"],
      required: true,
      default: "upcoming",
    },
    latitude:{type: Number, required: true},
    longitude:{type: Number, required: true },
    // location: {
    //   type: { type: String, enum: ["Point"], required: true },
    //   coordinates: {
    //     type: [Number],
    //     required: true,
    //   },
    // },
    changedStatusDate: {
      type: String,
      default: "0000-00-00T00:00:00.00+00:00",
    },
    impression_images: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "event_impression_image",
      },
    ],
    did_not_come_events: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "event_participants",
      },
    ],
    joinStatus: { type: Number, default: 1 },
    isFavorite: { type: Boolean, default: false },
    isLike: { type: Boolean, default: false },
    isRating: { type: Boolean, default: false },
    changes: {
      like: { type: Boolean, default: false },
      comment: { type: Boolean, default: false },
      participant: { type: Boolean, default: false },
      view: { type: Boolean, default: false },
      favorites: { type: Boolean, default: false },
      count: { type: Number, default: 0 },
      // joinStatus:{type:Number,default:1},
    },
    rejectMessage: {
      type: String,
      default: "null",
    },
  },

  {
    timestamps: true,
    // toJSON: { virtuals: true },
    // toObject: { virtuals: true },
  }
);

// Event.virtual("comments", {
//   ref: "event_comment",
//   localField: "_id",
//   foreignField: "event",
// });

// Event.virtual("ratings", {
//   ref: "event_rating",
//   localField: "_id",
//   foreignField: "event",
// });

// Event.virtual("impression_images", {
//   ref: "event_impression_image",
//   localField: "_id",
//   foreignField: "event",
// });

// Event.virtual("did_not_come_events", {
//   ref: "event_did_not_come_users",
//   localField: "_id",
//   foreignField: "event",
// });

Event.index({ location: "2dsphere" });

export default model("Event", Event);
