import { Router } from "express";
import paysStore from "../../../models/paysStore.js";
import servicesRegistrations from "../../../models/services/servicesRegistrations.js";
import companyService from "../../../models/company/companyService.js";
import Notification from "../../../models/Notification.js";
import moment from "moment-timezone";
import User from "../../../models/User.js";
import companyModel from "../../../models/company/companyModel.js";
import companyHotDealRegistration from "../../../models/company/companyHotDealRegistration.js";
import companyHotDeals from "../../../models/company/companyHotDeals.js";
import commission from "../../../models/commission.js";
import newAuthJWT from "../../../middlewares/newAuthJWT.js";
import notifEvent from "../../../events/NotificationEvent.js";
import companyParticipants from "../../../models/company/companyParticipants.js";

const payRouter = Router();

payRouter.get("/price", newAuthJWT, async (req, res) => {
  try {
    const priceComm = await commission.find();
    res.status(200).send({ message: "success", price: priceComm[0].price });
  } catch (error) {
    res.status(500).send({ message: "Server Error" });
  }
});

payRouter.get("/success/:id", async (req, res) => {
  console.log("success");

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
    navigate: true,
    link: evLink,
  };
  const existMessage = await Notification.findOne({
    status: 2,
    user: companyDb.owner._id.toString(),
    type: "Записались на услуги",
    message: `Пользователь ${userDb.name} ${userDb.surname} записался на услугу на ${day} ${monthName} ${time}.`,
    register: registerDb._id,
    serviceId: service._id,
    navigate: true,
    link: evLink,
  });
  console.log(existMessage, "existMessage");
  
  if (!existMessage) {
    console.log("create new notification regsiter one and two");
    
    const nt = new Notification(dataNotif);
    await nt.save();
    notifEvent.emit(
      "send",
      companyDb.owner._id.toString(),
      JSON.stringify({
        type: "Записались на услуги",
        serviceId: service._id,
        date_time: moment.tz(process.env.TZ).format("YYYY-MM-DD HH:mm"),
        navigate: true,
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
  console.log("reject deal");

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
  console.log("success deal");


  const dealRegistr = await companyHotDealRegistration
    .findById(req.params.id)
    .populate("user")
    .exec();
  dealRegistr.status = true;
  dealRegistr.pay = true;
  dealRegistr.free = false;
  dealRegistr.payTime = moment.tz(process.env.TZ).format("YYYY-MM-DD HH:mm:ss");
  await dealRegistr.save();
  const dealDb = await companyHotDeals.findById(dealRegistr.dealId);
  dealDb.free = false;
  dealDb.registration = dealRegistr._id;
  dealDb.situation = "passed";
  await dealDb.save();
  const companyDb = await companyModel
    .findById(dealDb.companyId)
    .populate("owner")
    .populate("images");

 
  const userDB = await User.findById(dealRegistr.user);
  const evLink = `alleven://myCompany/${dealDb.companyId}`;
  const time = dealDb.date.split(" ")[1];
  const dataNotif = {
    status: 2,
    dealDate: dealDb.date,
    date_time: moment.tz(process.env.TZ).format("YYYY-MM-DD HH:mm"),
    user: companyDb.owner._id.toString(),
    type: "Присоединение",
    navigate: true,
    message: `Пользователь ${userDB.name} ${userDB.surname} записался(лась) на ваше горящее предложение в ${time}.`,
    link: evLink,
  };
  const existMessage = await Notification.findOne({
    status: 2,
    dealDate: dealDb.date,
    user: companyDb.owner._id.toString(),
    type: "Присоединение",
    navigate: true,
    message: `Пользователь ${userDB.name} ${userDB.surname} записался(лась) на ваше горящее предложение в ${time}.`,
    link: evLink,
  });
  console.log(existMessage, "existMessage");
  
  if (!existMessage) {
    console.log("create new notification deal regsiter one and two");

    const CompanyParticipants = await companyParticipants.findOne({
      user: dealRegistr.user._id,
      companyId: dealDb.companyId,
    });

    if (!CompanyParticipants) {
      const newCompanyParticipants = new companyParticipants({
        user: dealRegistr.user._id,
        companyId: dealDb.companyId,
      });
      await newCompanyParticipants.save();
      await companyModel.findByIdAndUpdate(dealDb.companyId, {
        $set: { participants: newCompanyParticipants._id },
      });
    }
    const nt = new Notification(dataNotif);
    await nt.save();
    notifEvent.emit(
      "send",
      companyDb.owner._id.toString(),
      JSON.stringify({
        type: "Присоединение",
        date_time: moment.tz(process.env.TZ).format("YYYY-MM-DD HH:mm"),
        navigate: true,
        message: `Пользователь ${userDB.name} ${userDB.surname} записался на ваше горящее предложение в ${time}.`,
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
