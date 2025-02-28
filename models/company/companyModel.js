import mongoose from "mongoose";
import { type } from "os";
// import { rating } from "../../middlewares/validate/api/event";
const { Schema, model } = mongoose;

const Company = new Schema(
  {
    category: { type: Schema.Types.ObjectId, ref: "company_category" },
    owner: { type: Schema.Types.ObjectId, ref: "User" },
    companyName: { type: String ,default:"" },
    web: { type: String,default:"" },
    latitude: { type: Number ,required:true},
    longitude: { type: Number, required: true },
    ratings: [
      {
      type:Schema.Types.ObjectId,
      ref:"company_rating",
    }],
    ratingCalculated: { type: Number, default: 0},
    comments: [{ type: Schema.Types.ObjectId, ref: "company_comment" }],
    status: { type: Number, default: 0 },
    kilometr: { type: Number, default: 0 },
    address: { type: String, default: "" },
    images: [{ type: Schema.Types.ObjectId, ref: "company_image" }],
    phoneNumbers: [{ type: Schema.Types.ObjectId, ref: "company_phone" }],
    email: { type: String ,default:"" },
    startHour: { type: String,default:"" },
    endHour: { type: String ,default:"" },
    days: { type: String,default:"" },
    onlinePay:{type:Number,default:0},
    services: [{ type: Schema.Types.ObjectId, ref: "company_service" }],
    favorites: [{ type: Schema.Types.ObjectId, ref: "company_favorites" }],
    likes: [{ type: Schema.Types.ObjectId, ref: "company_likes" }],
    open: { type: Boolean, default: false },
    view: [{ type: Schema.Types.ObjectId, ref: "company_views" }],
    impression_images:[{ type: Schema.Types.ObjectId, ref: "company_impression_image" }],
    rejectMessage: { type: String, default: "null" },
    changedStatusDate: {
      type: String,
      default: "0000-00-00T00:00:00.00+00:00",
    },
    isFavorite: { type: Boolean, default: false },
    isLike: { type: Boolean, default: false },
    isRating: { type: Boolean, default: false },
    // participantsCount:{type:Number,default:0},
    changes: {
      like: { type: Boolean, default: false },
      comment: { type: Boolean, default: false },
      participant: { type: Boolean, default: false },
      view: { type: Boolean, default: false },
      favorites: { type: Boolean, default: false },
      count: { type: Number, default: 0 },
    },
    isImpression: { type: Boolean, default: false },
    onlineReason: { type: String, default: "null" },
    hotDeals:[{ type: Schema.Types.ObjectId, ref: "company_hot_deals" }],
    isNight:{type:Boolean,required:true},
    participants:[{ type: Schema.Types.ObjectId, ref: "User" }],
    todayRegisters:{type:Number,default:0},
    afterRegisters:{type:Number,default:0},
  },
  {
    timestamps: true, // This will add createdAt and updatedAt fields
  }
);

export default model("Company", Company);
