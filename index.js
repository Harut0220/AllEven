import express from "express";
import dotenv from "dotenv";
import { engine, create } from "express-handlebars";
import { webRoutes } from "./routes/web.js";
import { apiRoutes } from "./routes/api.js";
import { wsRoutes } from "./routes/ws.js";
import connect from "./db/db.js";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import { fileURLToPath } from "url";
import { dirname } from "path";
import h from "./helper/global.js";
import fileupload from "express-fileupload";
import expressWs from "express-ws";
import cors from "cors";
import path from "path";
import seedRouter from "./routes/seed.js";
import reedRouter from "./routes/reed.js";
import shareRoutes from "./routes/share.js";
import fs from "fs";
import notifEvent from "./events/NotificationEvent.js";
import Notification from "./models/Notification.js";
import moment from "moment-timezone";
import companyModel from "./models/company/companyModel.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.set("etag", false);

app.use((req, res, next) => {
  res.setHeader("Cache-Control", "no-store"); // Prevent caching
  res.setHeader("Pragma", "no-cache"); // Older browsers
  res.removeHeader("Last-Modified"); // Remove the last-modified header
  next();
});

expressWs(app);
const hbs = create({
  defaultLayout: "main",
  extname: "hbs",
  helpers: h,
  partialsDir: __dirname + "/views/partials/",
  // allowProtoPropertiesByDefault: true,
  // allowProtoMethodsByDefault: true
});

app.use(cors({ origin: "*" }));
app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");
app.set("views", "./views");
app.use(
  fileupload({
    defCharset: "utf8",
    defParamCharset: "utf8",
  })
);
app.use(
  "/tinymce",
  express.static(path.join(__dirname, "node_modules", "tinymce"))
);
app.use(express.static(__dirname + "/public"));
app.use("/uploads", express.static("uploads"));
app.use("/categories", express.static("categories"));

app.use(cookieParser({ secret: process.env.API_TOKEN }));
app.use(bodyParser.json({ limit: "500mb", parameterLimit: 10000 }));
app.use(bodyParser.raw({ limit: "500mb", parameterLimit: 100000 }));
app.use(bodyParser.text({ limit: "500mb", parameterLimit: 10000 }));
app.use(bodyParser.urlencoded({ limit: "500mb", extended: true }));
// app.get('/',(req,res)=>{
//   res.redirect('/admin/login');
// });
app.use(shareRoutes);
app.use("/admin", webRoutes);
app.use(wsRoutes);
app.use("/api", apiRoutes);
app.use("/seed", seedRouter);
app.use(reedRouter);
app.get("/some-route", (req, res) => {
  res.render("someTemplate", { url: process.env.URL });
});
app.get("/page/:num/", async function (req, res) {
  let path = __dirname + "/public/" + req.params.num + ".html";

  try {
    await fs.promises.access(path, fs.constants.F_OK);
    res.sendFile(path);
  } catch (error) {
    res.status(404).send("not found");
  }
});



// app.get("/create/meeting", async (req, res) => {
//   const evLink = `alleven://createEvent`;
//   const date_time = moment.tz(process.env.TZ).format();
//   const dataNotif = {
//     status: 2,
//     date_time: moment.tz(process.env.TZ).format("YYYY-MM-DD HH:mm"),
//     user: "67ad9c03a219da26a4a315a1",
//     type: "create_new",
//     navigate: true,
//     message: `Разместите информацию о вашем будущем событии.`,
//     link: evLink,
//   };
//   const nt = new Notification(dataNotif);
//   await nt.save();

//   notifEvent.emit(
//     "send",
//     "67ad9c03a219da26a4a315a1",
//     JSON.stringify({
//       type: "create_new",
//       navigate: true,
//       date_time: new Date(),
//       message: `Разместите информацию о вашем будущем событии.`,
//       link: evLink,
//     })
//   );
//   res.send({ message: "success" });
//   // }
// });

// app.get("/test/event", async (req, res) => {
//   const idMeet = "67e9b926dcbf708e7ec0d906";
//   const eventDb = await Event
//     .findById(idMeet)
//     .populate({
//       path: "participants",
//       populate: { path: "user", select: "_id fcm_token notifEvent" },
//     })
//     .populate({
//       path: "participantsSpot",
//       populate: { path: "user", select: "_id fcm_token notifEvent" },
//     })
//     .exec();

//   const evLink = `alleven://singleEvent/${eventDb._id}`;
//   const date_time = moment.tz(process.env.TZ).format();
//   const dataNotif = {
//     status: 2,
//     date_time: moment.tz(process.env.TZ).format("YYYY-MM-DD HH:mm"),
//     user: "6763ec4fbed192bc99eaf23d",
//     type: "confirm_come",
//     navigate: true,
//     message: `Событие ${eventDb.name} начнется через час. Не пропустите.`,
//     situation:"upcoming",
//     // categoryIcon: eventDb.category.avatar,
//     eventId: eventDb._id.toString(),
//     link: evLink,
//   };
//   // Событие ${eventDb.name} начнется через час. Не пропустите.
//   const nt = new Notification(dataNotif);
//   await nt.save();
//   notifEvent.emit(
//     "send",
//     "6763ec4fbed192bc99eaf23d",
//     JSON.stringify({
//       type: "confirm_come",
//       date_time,
//       navigate: true,
//       user: "6763ec4fbed192bc99eaf23d",
//       eventId: eventDb._id.toString(),
//       situation:"upcoming",
//       message: `Событие ${eventDb.name} начнется через час. Не пропустите.`,
//       // categoryIcon: eventDb.category.avatar,
//       link: evLink,
//     })
//   );

//   return res.send("Test");
// });

// app.get("/test/notif", async (req, res) => {
//   const idMeet = "67adef36cd710d9318475a14";
//   const eventDb = await meetingModel
//     .findById(idMeet)
//     .populate({
//       path: "participants",
//       populate: { path: "user", select: "_id fcm_token notifEvent" },
//     })
//     .populate({
//       path: "participantSpot",
//       populate: { path: "user", select: "_id fcm_token notifEvent" },
//     })
//     .exec();

//   const evLink = `alleven://singleMeeting/${eventDb._id}`;
//   const date_time = moment.tz(process.env.TZ).format();
//   const dataNotif = {
//     status: 2,
//     date_time: moment.tz(process.env.TZ).format("YYYY-MM-DD HH:mm"),
//     user: "67ad9c03a219da26a4a315a1",
//     type: "confirm_come",
//     navigate: true,
//     message: `Событие ${eventDb.purpose} начнется через час. Не пропустите.`,
//     situation:"upcoming",
//     // categoryIcon: eventDb.category.avatar,
//     meetingId: eventDb._id.toString(),
//     link: evLink,
//   };
//   // Событие ${eventDb.name} начнется через час. Не пропустите.
//   const nt = new Notification(dataNotif);
//   await nt.save();
//   notifEvent.emit(
//     "send",
//     "67ad9c03a219da26a4a315a1",
//     JSON.stringify({
//       type: "confirm_come",
//       date_time,
//       navigate: true,
//       user: "67ad9c03a219da26a4a315a1",
//       meetingId: eventDb._id.toString(),
//       situation:"upcoming",
//       message: `${eventDb.purpose} начнется через час. Не пропустите.`,
//       // categoryIcon: eventDb.category.avatar,
//       link: evLink,
//     })
//   );

//   return res.send("Test");
// });

app.get("/test/register", async (req, res) => {
  const idMeet = "67c9491ce280217a88f0a457";
  const eventDb = await companyModel
    .findById(idMeet)
    .populate("category")
    .exec();

  const evLink = `alleven://myCompany/${companyDb._id}`;

  const time = date.split(" ")[1];
  const day = date.split(" ")[0].split("-")[2];
  const monthName = moment(date).locale("ru").format("MMMM");

  const dataNotif = {
    status: 2,
    date_time: moment.tz(process.env.TZ).format("YYYY-MM-DD HH:mm"),
    user: companyDb.owner._id.toString(),
    type: "confirm_come",
    message: `Пользователь ${userDb.name} ${userDb.surname} записался на услугу на ${day} ${monthName} ${time}.`,
    registerId: registerDb._id,
    serviceId: service._id,
    link: evLink,
  };
  const nt = new Notification(dataNotif);
  await nt.save();
  if (companyDb.owner.notifCompany) {
    notifEvent.emit(
      "send",
      companyDb.owner._id.toString(),
      JSON.stringify({
        type: "confirm_come",
        serviceId: service._id,
        date_time: moment.tz(process.env.TZ).format("YYYY-MM-DD HH:mm"),
        navigate: false,
        registerId: registerDb._id,
        serviceId: service._id,
        message: `Пользователь ${userDb.name} ${userDb.surname} записался на услугу на ${day} ${monthName} ${time}.`,
        link: evLink,
      })
    );
  }

  return res.send("Test");
});

const start = async () => {
  await connect();
  app.listen(process.env.PORT, () =>
    console.log(`Server started ${process.env.PORT}`)
  );
};

start();
