import mongoose from "mongoose";
import Role from "./Role.js";
const { Schema } = mongoose;

const User = new Schema(
  {
    name: {
      type: String,
      required: false,
      max: 65,
      default: null,
    },
    surname: {
      type: String,
      required: false,
      max: 65,
      default: null,
    },
    // imagePath: {
    //   type: String,
    //   required: false,
    //   max: 65,
    // },
    middlename: {
      type: String,
      required: false,
      max: 65,
      default: null,
    },
    email: {
      type: String,
      // trim: true,
      // lowercase: true,
      // unique: true,
      required: false,
      // match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
      default: null,
    },
    password: {
      type: String,
      required: false,
      max: 20,
      default: null,
    },
    phone_number: {
      type: Number,
      required: false,
      default: null,
    },
    gender: {
      type: String,
      required: false,
      enum: ["male", "female", "other"],
      default: "male",
    },
    dob: {
      type: Date,
      required: false,
    },
    avatar: {
      type: String,
      required: false,
    },
    block: {
      type: Number,
      required: false,
      default: 1,
    },
    fcm_token: [
      {
        type: String,
      },
    ],
    roles: {
      type: mongoose.Schema.ObjectId,
      ref: "Role",
    },
    events: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Event",
      },
    ],
    company:
      {
        type: mongoose.Schema.ObjectId,
        ref: "Company",
      },
    event_categories: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "event_category",
      },
    ],
    event_likes: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Event",
      },
    ],
    event_favorites: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Event",
      },
    ],
    company_favorites: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Company",
      },
    ],
    meeting_favorites: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Meeting",
      },
    ],
    event_visits: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Event",
      },
    ],
    event_in_place: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Event",
      },
    ],
    meetings:[{type:Schema.Types.ObjectId,ref:"Meeting"}],
    documents: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Document",
      },
    ],
    event_favorite_categories: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "event_category",
      },
    ],
    company_favorite_categories: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "company_category",
      },
    ],
    list_of_notifications: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "notification_list",
      },
    ],
    last_event_date: {
      type: Date,
      required: false,
    },
    last_meeting_date: {
      type: Date,
      required: false,
    },
    last_company_date: {
      type: Date,
      required: false,
    },
    unread_notifications: {type:Number,default:0},
    statusMeeting:{type:String,default:"noVerified"},
    notifEvent: { type: Boolean, default: true },
    notifCompany:{type:Boolean,default:true},
    notifMeeting:{type:Boolean,default:true},
    notifHotOffer:{type:Boolean,default:true}
  },
  {
    timestamps: true,
  }
);

User.virtual("event_rating", {
  ref: "event_rating",
  localField: "_id",
  foreignField: "user",
});

User.virtual("event_comment", {
  ref: "event_comment",
  localField: "_id",
  foreignField: "user",
});

User.virtual("event_impression_image", {
  ref: "event_impression_image",
  localField: "_id",
  foreignField: "user",
});

User.virtual("event_comment_like", {
  ref: "event_comment",
  localField: "_id",
  foreignField: "likes",
});

User.virtual("did_not_come", {
  ref: "event_did_not_come_users",
  localField: "_id",
  foreignField: "user",
});

export default mongoose.model("User", User);
