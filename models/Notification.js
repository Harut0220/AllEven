import mongoose from "mongoose";
const { Schema, model } = mongoose;

const Notification = new Schema(
  {
    message: {
      type: String,
      required: true,
      // default : null
    },
    type: {
      type: String,
      enum: [
        "system",
        "participation",
        "participationSpot",
        "general",
        "advertising",
        "confirm_come",
        "feedback",
        "message",
        "create_new",
        "confirm_passport",
        "meeting_participant",
        "impression",
        "Новая события",
        "Новая услуга",
        "Новая встреча",
        "Онлайн оплата",
        "Предлагают перенести",
        "Регистрации услугу",
        "Регистрация на услугу",
        "like",
        "Записались на услуги",
        "Подтверждение событий",
        "Отклонение событий",
        "Отклонение услуги",
        "Присоединение",
        "Записались на горящие предложения",
      ],
      default: "system",
    },
    date_time: {
      type: String,
      required: true,
    },
    status: {
      type: Number,
      default: 1,
    },
    link: {
      type: String,
      required: true,
    },
    eventId: {
      type: mongoose.Schema.ObjectId,
      ref: "Event",
    },
    meetingId: {
      type: mongoose.Schema.ObjectId,
      ref: "Meeting",
    },
    companyId: {
      type: mongoose.Schema.ObjectId,
      ref: "Company",
    },
    // createId:{type:mongoose.Schema.ObjectId,required:false},
    serviceId: {
      type: mongoose.Schema.ObjectId,
      ref: "company_service",
    },
    register: {
      type: mongoose.Schema.ObjectId,
      ref: "services_registrations",
    },
    feedback: {
      type: mongoose.Schema.ObjectId,
      ref: "Feedback",
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    read: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
    ],
    sent: {
      type: mongoose.Schema.ObjectId,
      ref: "Role",
    },
    situation: {
      type: String,
      required: false,
    },
    serviceName: { type: String, required: false },
    categoryIcon: {
      type: String,
      required: false,
    },
    confirmed: {
      type: Boolean,
      default: false,
    },
    navigate: {
      type: Boolean,
      default: false,
    },
    dealDate: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

export default model("Notification", Notification);
