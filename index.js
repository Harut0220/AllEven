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
import { reportRoutes } from "./routes/report.js";
import seedRouter from "./routes/seed.js";
import reedRouter from "./routes/reed.js";
import { dateNow } from "./config/timestamps.js";
import moment from "moment-timezone";
import shareRoutes from "./routes/share.js";
import fs from "fs";


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.set("etag", false);

// Disable Last-Modified header
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
app.use("/report", reportRoutes);
app.use("/seed", seedRouter);
app.use(reedRouter);
app.get("/some-route", (req, res) => {
  res.render("someTemplate", { url: process.env.URL });
});
app.get('/page/:num/', async function (req, res) {
  let path = __dirname + '/public/' + req.params.num + '.html';

  try {
      await fs.promises.access(path, fs.constants.F_OK);
      res.sendFile(path);
  } catch (error) {
      res.status(404).send('not found');
  }
});

const lastDate = moment("2025-01-22T10:49:19.299+00:00", "YYYY-MM-DDTHH:mm");
console.log("2222222222");

// const dateNowd = moment();
// console.log(dateNow,"dateNowd");
// const difference = dateNow.diff(lastDate);
// console.log(difference,"difference");
// const differenceInHours = Math.round(moment.duration(difference).asHours());
// console.log(differenceInHours,"differenceInHours");






















const start = async () => {
  await connect();
  app.listen(process.env.PORT, () =>
    console.log(`Server started ${process.env.PORT}`)
  );
};

start();
