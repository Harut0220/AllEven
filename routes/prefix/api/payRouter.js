import { Router } from "express";
import paysStore from "../../../models/paysStore.js";
import servicesRegistrations from "../../../models/services/servicesRegistrations.js";
import companyService from "../../../models/company/companyService.js";
import Notification from "../../../models/Notification.js";
import moment from "moment-timezone";
import User from "../../../models/User.js";
import companyModel from "../../../models/company/companyModel.js";
// import companyHotDealRegistrations from "../../../models/company/companyHotDealRegistration.js";
import companyHotDealRegistration from "../../../models/company/companyHotDealRegistration.js";
import companyHotDeals from "../../../models/company/companyHotDeals.js";
import commission from "../../../models/commission.js";
import newAuthJWT from "../../../middlewares/newAuthJWT.js";
import notifEvent from "../../../events/NotificationEvent.js";

const payRouter = Router();

payRouter.get("/price",newAuthJWT, async (req, res) => {
try {
  const priceComm=await commission.find();
  res.status(200).send({message:"success",price:priceComm[0].price});
} catch (error) {
  res.status(500).send({message:"Server Error"});
}});

payRouter.get("/success/:id", async (req, res) => {
  console.log("success");

  console.log(req.params, "req.params");
  const date = req.query.date;
  const payStoreDB = await paysStore.findById(req.params.id);
  const registerDb = await servicesRegistrations.findOne({
    payStoreId: req.params.id,
  });
  payStoreDB.operationId = registerDb.operationId;
  payStoreDB.registerId = registerDb._id;
  payStoreDB.status = 1;
  await payStoreDB.save();

  registerDb.payStoreId = payStoreDB._id;
  registerDb.pay = true;
  await registerDb.save();

  const service = await companyService.findById(registerDb.serviceId);
  const userDb = await User.findById(registerDb.user);
  const companyDb = await companyModel
    .findById(payStoreDB.companyId)
    .populate("owner");
  const evLink = `alleven://myCompany/${companyDb._id}`;

  const time = date.split(" ")[1];
  const day = date.split(" ")[0].split("-")[2];
  const monthName = moment(date).locale("ru").format("MMMM");

  const dataNotif = {
    status: 2,
    date_time: moment.tz(process.env.TZ).format("YYYY-MM-DD HH:mm"),
    user: companyDb.owner._id.toString(),
    type: "Записались на услуги",
    message: `Пользователь ${userDb.name} ${userDb.surname} записался на услугу на ${day} ${monthName} ${time}.`,
    register: registerDb._id,
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
        type: "Записались на услуги",
        serviceId: service._id,
        date_time: moment.tz(process.env.TZ).format("YYYY-MM-DD HH:mm"),
        navigate: false,
        register: registerDb._id,
        serviceId: service._id,
        message: `Пользователь ${userDb.name} ${userDb.surname} записался на услугу на ${day} ${monthName} ${time}.`,
        link: evLink,
      })
    );
  }

  const mobileLink = `alleven://singleCompany/${payStoreDB.companyId}?status=success&name=${req.query.name}&date=${req.query.date}&id=${payStoreDB.companyId}`;

  res.send(`
        <html>
            <head>
                <script type="text/javascript">
                    // Redirect to mobile deep link
                    window.location.href = '${mobileLink}';
                </script>
            </head>
            <body>
                Redirecting to mobile app...
            </body>
        </html>
    `);
});

payRouter.get("/reject/:id", async (req, res) => {
  console.log("reject");

  const result = req.query.result;
  const pdfPath = req.query.pdf;
  console.log(req.params, "req.params");
  const payStoreDB = await paysStore.findById(req.params.id);
  const registerDb = await servicesRegistrations.findOne({
    payStoreId: req.params.id,
  });
  payStoreDB.operationId = registerDb.operationId;
  payStoreDB.registerId = registerDb._id;
  await payStoreDB.save();

  registerDb.payStoreId = payStoreDB._id;
  await registerDb.save();
  const mobileLink = `alleven://singleCompany/${payStoreDB.companyId}?status=reject&name=${req.query.name}&date=${req.query.date}&id=${payStoreDB.companyId}`;

  res.send(`
        <html>
            <head>
                <script type="text/javascript">
                    // Redirect to mobile deep link
                    window.location.href = '${mobileLink}';
                </script>
            </head>
            <body>
                Redirecting to mobile app...
            </body>
        </html>
    `);
});

payRouter.get("/deal/success/:id", async (req, res) => {
  console.log("success");

  console.log(req.params, "req.params");

  const dealRegistr = await companyHotDealRegistration
    .findById(req.params.id)
    .populate("user");
  dealRegistr.status = true;
  dealRegistr.pay=true;
  dealRegistr.free=false
  dealRegistr.payTime=moment.tz(process.env.TZ).format("YYYY-MM-DD HH:mm:ss")
  await dealRegistr.save();
  const dealDb = await companyHotDeals.findById(dealRegistr.dealId);
  dealDb.free=false
  await dealDb.save();
  const companyDb = await companyModel
    .findById(dealDb.companyId)
    .populate("owner")
    .populate("images");
  const userDB = await User.findById(dealRegistr.user);
  const evLink = `alleven://singleCompany/${dealDb.companyId}`;
  const time = dealDb.date.split(" ")[1];
  const dataNotif = {
    status: 2,
    date_time: moment.tz(process.env.TZ).format("YYYY-MM-DD HH:mm"),
    user: companyDb.owner._id.toString(),
    type: "Присоединение",
    navigate: true,
    message: `Пользователь ${userDB.name} ${userDB.surname} записался на ваше горящее предложение в ${time}.`,
    categoryIcon: companyDb.images[0].url, //sarqel
    link: evLink,
  };
  const nt = new Notification(dataNotif);
  await nt.save();
  if (companyDb.owner.notifCompany) {
    notifEvent.emit(
      "send",
      companyDb.owner._id.toString(),
      JSON.stringify({
        type: "Присоединение",
        date_time: moment.tz(process.env.TZ).format("YYYY-MM-DD HH:mm"),
        navigate: true,
        message: `Пользователь ${userDB.name} ${userDB.surname} записался на ваше горящее предложение в ${time}.`,
        categoryIcon: companyDb.images[0].url, //sarqel
        link: evLink,
      })
    );
  }

  const mobileLink = `alleven://singleCompany/${dealDb.companyId}?date=${dealRegistr.startTime}`;

  res.send(`
        <html>
            <head>
                <script type="text/javascript">
                    // Redirect to mobile deep link
                    window.location.href = '${mobileLink}';
                </script>
            </head>
            <body>
                Redirecting to mobile app...
            </body>
        </html>
    `);
});

payRouter.get("/deal/reject/:id", async (req, res) => {
  console.log("deal reject");

  console.log(req.params, "req.params deal reject");

  const dealRegistr = await companyHotDealRegistration
    .findById(req.params.id)
    .populate("user");
  const dealDb = await companyHotDeals.findById(dealRegistr.dealId);

  const mobileLink = `alleven://singleCompany/${dealDb.companyId}`;

  res.send(`
        <html>
            <head>
                <script type="text/javascript">
                    // Redirect to mobile deep link
                    window.location.href = '${mobileLink}';
                </script>
            </head>
            <body>
                Redirecting to mobile app...
            </body>
        </html>
    `);
});

export default payRouter;
