import Agenda from "agenda";
import mongoose from "mongoose";

const connect = async () => {
  // mongoose.set("strictQuery", false);

  // mongoose
  //   .connect(process.env.MONGO_URL)
  //   .then(() => {
  //     console.log("Successfully connected to database");
  //   })
  //   .catch((err) => {
  //     console.error("Database connection error:", err);
  //   });

  // const agenda = new Agenda({
  //   db: {
  //     address: process.env.MONGO_URL,
  //     collection: "agendaJobs",
  //     options: {
  //       useNewUrlParser: true,
  //       useUnifiedTopology: true,
  //     },
  //   },
  // });
  // agenda.on("ready", () => {
  //   console.log("✅ Agenda connected to MongoDB");
  // });

  // agenda.on("error", (err) => {
  //   console.error("❌ Agenda connection error:", err);
  // });

  mongoose.set("strictQuery", false);
  await mongoose
    .connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("Successfully connected to database");
    })
    .catch((error) => {
      console.log("database connection failed. exiting now...");
      console.error(error);
      process.exit(1);
    });
};

export default connect;
