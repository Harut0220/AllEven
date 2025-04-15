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
import Agenda from "agenda";
import notifEvent from "./events/NotificationEvent.js";
import adminNotifStore from "./helper/adminNotifStore.js";

const __filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(__filename);
dotenv.config();

const app = express();
app.get("/test/admin",async(req,res)=>{
      notifEvent.emit(
        "send",
        "ADMIN",
        JSON.stringify({
          type: "Новая события",
          message: "name new",
          data: {name:"Event state",_id:"67f64d6c18383402c4184f71"},
        })
      );
      await adminNotifStore({
        type: "Новая события",
        message: "name new",
        data: {name:"Event state",_id:"67f64d6c18383402c4184f71"},
      });
      res.send("1")
})
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
export const agenda = new Agenda({
  db: {
    address: process.env.MONGO_URL,
    collection: "agendaJobs",
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },
});
agenda.on("ready", () => {
  console.log("✅ Agenda connected to MongoDB");
});

agenda.on("error", (err) => {
  console.error("❌ Agenda connection error:", err);
});

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

const start = async () => {
  await connect();
  app.listen(process.env.PORT, () =>
    console.log(`Server started ${process.env.PORT}`)
  );
};

start();
