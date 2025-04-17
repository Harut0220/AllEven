import moment from "moment-timezone";
import companyModel from "../../../models/company/companyModel.js";
import servicesRegistrations from "../../../models/services/servicesRegistrations.js";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import CompanyServiceModel from "../../../models/company/companyService.js";
import notifEvent from "../../../events/NotificationEvent.js";
import schedule from "node-schedule";
import companyHotDealRegistrations from "../../../models/company/companyHotDealRegistration.js";
import Notification from "../../../models/Notification.js";
import User from "../../../models/User.js";
import companyCategory from "../../../models/company/companyCategory.js";
import companyHotDeals from "../../../models/company/companyHotDeals.js";
import commission from "../../../models/commission.js";
import paysStore from "../../../models/paysStore.js";
import axios from "axios";
import companyHotDealRegistration from "../../../models/company/companyHotDealRegistration.js";
import companyParticipants from "../../../models/company/companyParticipants.js";
import companyService from "../../../models/company/companyService.js";
import { agenda } from "../../../index.js";
const { ObjectId } = mongoose.Types;

const servicesController = {
  editRegisterUser: async (req, res) => {
    try {
      const { id, text } = req.body;
      // const updatedRegister = await servicesRegistrations.findById(id);
      // updatedRegister.messages.unshift(text);
      // await updatedRegister.save();
      const updatedDoc = await servicesRegistrations
        .findByIdAndUpdate(
          id,
          {
            $push: { messages: { $each: [text], $position: 0 } },
          },
          { new: true } // Return the updated document
        )
        .populate({
          path: "user",
          select: "name surname avatar phone_number",
        })
        .populate({
          path: "serviceId",
          select: "_id type images description cost",
        })
        .lean();
      const serviceDb = await companyService
        .findById(updatedDoc.serviceId._id)
        .populate({
          path: "companyId",
          select: "_id owner",
        });

      const evLink = `alleven://myCompany/${serviceDb.companyId._id}`;

      const dataNotif = {
        status: 2,
        date_time: moment.tz(process.env.TZ).format("YYYY-MM-DD HH:mm"),
        user: serviceDb.companyId.owner.toString(),
        type: "message",
        message: `К сожалению пользователю ${updatedDoc.user.name} ${updatedDoc.user.surname} на услугу ${updatedDoc.serviceId.type} предложенное время не подходит.`,
        serviceId: updatedDoc.serviceId._id,
        register: id,
        navigate: true,
        companyId: serviceDb.companyId._id,
        // categoryIcon: service.serviceId.images[0],
        link: evLink,
      };
      const nt = new Notification(dataNotif);
      await nt.save();
      notifEvent.emit(
        "send",
        serviceDb.companyId.owner.toString(),
        JSON.stringify({
          type: "message",
          date_time: moment.tz(process.env.TZ).format("YYYY-MM-DD HH:mm"),
          message: `К сожалению пользователю ${updatedDoc.user.name} ${updatedDoc.user.surname} на услугу ${updatedDoc.serviceId.type} предложенное время не подходит.`,
          serviceId: updatedDoc.serviceId._id,
          register: id,
          navigate: true,
          // categoryIcon: service.serviceId.images[0],
          link: evLink,
        })
      );

      res.status(200).send({ message: "success", data: updatedDoc });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Server Error" });
    }
  },
  myRegisters: async (req, res) => {
    const authHeader = req.headers.authorization;
    const token = authHeader.split(" ")[1];
    const user = jwt.decode(token);
    const companyCategoryDb = await companyCategory.find();
    const result = [];
    for (let i = 0; i < companyCategoryDb.length; i++) {
      const obj = {};
      obj._id = companyCategoryDb[i]._id;
      obj.name = companyCategoryDb[i].name;
      obj.avatar = companyCategoryDb[i].avatar;
      const registersDb = await servicesRegistrations.find({
        pay: true,
        user: user.id,
        category: companyCategoryDb[i]._id,
      });
      obj.registers = registersDb;
      result.push(obj);
    }
    const dateNow = moment.tz(process.env.TZ).format("YYYY-MM-DD HH:mm");

    for (let z = 0; z < result.length; z++) {
      for (let x = 0; x < result[i].registers; x++) {
        if (!(result[i].registers[x].date > dateNow)) {
          result[i].registers[x].status = 3;
        }
      }
    }

    res.status(200).send({ message: "success", data: result });
  },
  // confirmPay: async (req, res) => {
  //   try {
  //     const authHeader = req.headers.authorization;
  //     const token = authHeader.split(" ")[1];
  //     const user = jwt.decode(token);
  //     const { id } = req.body;
  //     const registerDb = await servicesRegistrations.findById(id);
  //     const service = await CompanyServiceModel.findById(
  //       registerDb.serviceId.toString()
  //     );
  //     const prepaymentPrice = (service.cost * 10) / 100;
  //     // const servicePay = new ServicePays({
  //     //   user: user.id,
  //     //   service: registerDb.serviceId,
  //     //   registerId: id,
  //     //   prepayment: true,
  //     //   prepaymentPrice: prepaymentPrice,
  //     //   paymentPrice: service.cost,
  //     // });

  //     // await servicePay.save();
  //     res.status(200).send({ message: "success", data: servicePay });
  //   } catch (error) {
  //     console.error(error);
  //   }
  // },
  freeTimes: async (req, res) => {
    const { id, date } = req.query;

    const serviceDb = await CompanyServiceModel.findById(id);

    const companyDb = await companyModel.findById(serviceDb.companyId);

    const daysFunc = (daysDb) => {
      if (daysDb === "Пн․- Пят․") {
        return ["понедельник", "вторник", "среда", "четверг", "пятница"];
      } else if (daysDb === "Пн․- Сб.") {
        return [
          "понедельник",
          "вторник",
          "среда",
          "четверг",
          "пятница",
          "суббота",
        ];
      } else if (daysDb === "Суб․- Вс․") {
        return ["суббота", "воскресенье"];
      } else if (daysDb === "Вт․- Вс․") {
        return [
          "вторник",
          "среда",
          "четверг",
          "пятница",
          "суббота",
          "воскресенье",
        ];
      } else if (daysDb === "Пн․- Чт․") {
        return ["понедельник", "вторник", "среда", "четверг"];
      }
    };

    const dayName = moment
      .tz(date, "YYYY-MM-DD", process.env.TZ)
      .locale("ru")
      .format("dddd");

    const workingDays = daysFunc(companyDb.days);

    const ifTodayWorking = workingDays.includes(dayName);

    if (!ifTodayWorking) {
      return res.status(200).send({ message: "выходной день", data: [] });
    }

    const startTime = moment.tz(
      `${date} ${companyDb.startHour}`,
      "YYYY-MM-DD HH:mm",
      process.env.TZ
    );
    const endTime = moment.tz(
      `${date} ${companyDb.endHour}`,
      "YYYY-MM-DD HH:mm",
      process.env.TZ
    );
    let isNight = false;

    const times = [];
    let currentTime = startTime.clone();

    while (currentTime <= endTime) {
      times.push(currentTime.format("YYYY-MM-DD HH:mm"));
      currentTime.add(1, "hour");

      if (currentTime.format("HH:mm") === endTime.format("HH:mm")) {
        break;
      }
    }

    while (currentTime >= endTime) {
      if (currentTime.format("HH:mm") === endTime.format("HH:mm")) {
        break;
      }
      isNight = true;

      times.push(currentTime.format("YYYY-MM-DD HH:mm"));
      currentTime.add(1, "hour");
    }

    while (currentTime === endTime) {
      times.push(currentTime.format("YYYY-MM-DD HH:mm"));
      currentTime.add(1, "hour");
      if (currentTime.format("HH:mm") === endTime.format("HH:mm")) {
        break;
      }
    }

    const freeTimes = [];
    let arr = [];

    for (let i = 0; i < times.length; i++) {
      const datTimes = `${date}${times[i].slice(10, 16)}`;

      const registerDb = await servicesRegistrations.findOne({
        serviceId: id,
        date: datTimes,
        pay: true,
      });

      //      date: { $gt: afterDate } // $gt = "greater than"

      const sliceDate = times[i].slice(8, 10);
      const sliceDateReq = date.slice(8, 10);
      if (!registerDb && sliceDate === sliceDateReq) {
        freeTimes.push(times[i]);
      } else if (!registerDb && !(sliceDate === sliceDateReq)) {
        const dateTimeSliceDay = `${date} ${times[i].slice(11, 16)}`;

        arr.push(dateTimeSliceDay);
      }
    }
    for (let j = arr.length - 1; j >= 0; j--) {
      freeTimes.unshift(arr[j]);
    }

    // const hours = [];
    // freeTimes.forEach(time => {
    //   hours.push(time.slice(11, 16));
    // });
    //,isNight
    const dateNow = moment.tz(process.env.TZ).format("YYYY-MM-DD HH:mm");

    let availableTimes = freeTimes;
    const dateDay = dateNow.slice(0, 10);

    if (dateDay === date) {
      availableTimes = freeTimes.filter((time) =>
        moment.tz(time, "YYYY-MM-DD HH:mm", process.env.TZ).isAfter(dateNow)
      );
    }

    res
      .status(200)
      .send({ success: true, message: "success", data: availableTimes });
  },
  times: async (req, res) => {
    const { serviceId, today } = req.query;
    const serviceRegister = await servicesRegistrations.find({
      serviceId,
      pay: true,
      date: { $regex: `^${today}` },
    });
    const service = await CompanyServiceModel.findById(
      serviceRegister[0].serviceId
    );
    const companie = await companyModel.findById(service[0].companyId);
    const result = {
      startHour: service.startHour,
      endHour: service.endHour,
      days: service.days,
      company: companie,
    };
    res.status(200).send({ success: true, data: result });
  },
  edite: async (req, res) => {
    const data = req.body;

    const updatedCompany = await CompanyServiceModel.findByIdAndUpdate(
      data._id,
      { ...data, updatedAt: moment.tz(process.env.TZ).format() },
      { new: true }
    );
    res.status(200).send({ success: true, data: updatedCompany });
  },
  near: async (req, res) => {
    const id = req.params.id;
    const dbResult = await CompanyServiceModel.findById(id);
    res.status(200).send({ message: "success", data: dbResult });
  },
  registers: async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      const { companyId } = req.params;
      const { day } = req.query;

      if (!companyId && !day) {
        res.status(404).send({ message: "companyId & day not found" });
      }

      const token = authHeader.split(" ")[1];
      const user = jwt.decode(token);
      const company = await companyModel
        .findById(companyId)
        .populate("hotDeals");
      const resObj = {};
      const resToday = [];
      const inFuture = [];
      const inPast = [];
      const objectIdArray = company.services.map((id) => ObjectId(id));
      const dbResult = await servicesRegistrations
        .find({ pay: true, serviceId: { $in: objectIdArray } })
        .populate({
          path: "user",
          select: "name surname avatar phone_number",
        })
        .populate("serviceId")
        .exec();

      const formattedDate = moment.tz(process.env.TZ).format("YYYY-MM-DD");

      /////////////////////////////////////////////////////////
      function checkDateStatus(givenDateString) {
        const givenDate = new Date(givenDateString);

        if (isNaN(givenDate.getTime())) {
          throw new Error("Invalid date format");
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        givenDate.setHours(0, 0, 0, 0);

        if (givenDate < today) {
          return "The given date is in the past.";
        } else if (givenDate > today) {
          return "future";
        } else {
          return "today";
        }
      }

      if (dbResult.length !== 0) {
        for (let i = 0; i < dbResult.length; i++) {
          try {
            const status = checkDateStatus(dbResult[i].date);
            if (status === "today") {
              resToday.push(dbResult[i]);
            } else if (status === "future") {
              inFuture.push(dbResult[i]);
            } else if (status === "The given date is in the past.") {
              // inPast.push(dbResult[i]);
            }
          } catch (error) {
            console.error(error.message);
          }
        }
        resObj.inFuture = inFuture;
        resObj.resToday = resToday;
        resObj.inPast = inPast;
      }

      const resObject = {};
      if (day === "today") {
        const nowInTz = moment().tz(process.env.TZ);

        // Get start and end of day in the specified timezone
        const startOfDay = nowInTz.clone().startOf("day").toDate();
        const endOfDay = nowInTz.clone().endOf("day").toDate();
        const hotDealsDb = await companyHotDeals
          .find({
            companyId,
            createdAt: {
              $gte: startOfDay,
              $lte: endOfDay,
            },
          })
          .populate({
            path: "registration",
            populate: { path: "user", select: "name surname avatar" },
          });
        let dealRegisters = [];
        for (let i = 0; i < hotDealsDb.length; i++) {
          const element = hotDealsDb[i];

          const dealRegistersDb = await companyHotDealRegistration
            .findOne({ dealId: element._id, })
            .populate({
              path: "user",
              select: "name surname avatar phone_number",
            })
            .exec();
          if (dealRegistersDb) {
            let obj = {
              description: element.description,
              ...dealRegistersDb.toObject(),
            };

            dealRegisters.push(obj);
          }
        }

        dealRegisters.sort((a, b) => new Date(a.date) - new Date(b.date))
        // dealRegisters = hotDealsDb;
        if (resToday.length) {
          // resToday.sort((a, b) => a.dateSlice - b.dateSlice);
          resToday.sort((a, b) => new Date(a.date) - new Date(b.date))

          const resArray = [];
          for (let i = 0; i < resToday.length; i++) {
            resArray.push(resToday[i]);
          }
          resObject[resToday[0].dateSlice] = resArray;
          console.log(resArray,"resArray exist reg");
          console.log(dealRegisters,"dealRegisters exist reg");
          res
            .status(200)
            .send({ message: "success", data: resObject, dealRegisters });
        } else {
          console.log(resArray,"resArray");
          console.log(dealRegisters,"dealRegisters ");

          res
            .status(200)
            .send({ message: "success", data: resToday, dealRegisters });
        }
      } else if (day === "future") {
        if (inFuture.length) {
          inFuture.sort((a, b) => b.dateSlice - a.dateSlice);
          for (let i = 0; i < inFuture.length; i++) {
            resObject[inFuture[i].dateSlice] = [];
          }
          for (let z = 0; z < inFuture.length; z++) {
            resObject[inFuture[z].dateSlice].push(inFuture[z]);
          }
          res.status(200).send({ message: "success", data: resObject });
        } else {
          res.status(200).send({ message: "success", data: inFuture });
        }
      }
      // }
    } catch (error) {
      console.error(error);
    }
  },
  editeRegistr: async (req, res) => {
    try {
      const { id, date, text } = req.body;

      const daySlice = date.slice(8, 10);
      const monthSlice = date.slice(5, 7);
      const dateSlice = `${monthSlice}.${daySlice}`;

      if (date && text && id) {
        const service = await servicesRegistrations
          .findById(id)
          .populate("serviceId")
          .populate("user");
        if (text) {
          service.dealDate = date;
          // service.dateSlice = dateSlice;
          service.messages.unshift(text);
          await service.save();
        } else {
          // service.dateSlice = dateSlice;

          service.dealDate = date;
          await service.save();
        }

        const serviceDb = await CompanyServiceModel.findById(
          service.serviceId._id
        );

        const evLink = `alleven://singleCompany/${serviceDb.companyId}`;

        const dataNotif = {
          status: 2,
          date_time: moment.tz(process.env.TZ).format("YYYY-MM-DD HH:mm"),
          user: service.user._id.toString(),
          type: "confirm_come",
          message: `Услугу ${service.serviceId.type} на которую вы записались предлагают перенести на ${date}.Причин-${text}`,
          serviceId: service.serviceId._id,
          companyId: serviceDb.companyId,
          register: id,
          navigate: false,
          // categoryIcon: service.serviceId.images[0],
          link: evLink,
        };
        const nt = new Notification(dataNotif);
        await nt.save();
        // if (service.user.notifCompany) {
        notifEvent.emit(
          "send",
          service.user._id.toString(),
          JSON.stringify({
            type: "confirm_come",
            date_time: moment.tz(process.env.TZ).format("YYYY-MM-DD HH:mm"),
            message: `Услугу ${service.serviceId.type} на которую вы записались предлагают перенести на ${date}.Причин-${text}`,
            serviceId: service.serviceId._id,
            register: id,
            navigate: false,
            // categoryIcon: service.serviceId.images[0],
            link: evLink,
          })
        );
        // }

        const updatedRegister = await servicesRegistrations
          .findById(id)
          .populate({
            path: "user",
            select: "name surname avatar phone_number",
          })
          .populate({
            path: "serviceId",
            select: "type images description cost",
          })
          .lean();
        res.status(200).send({ message: "success", data: updatedRegister });
      } else {
        res.status(400).send({ message: "id, date, text is required" });
      }
    } catch (error) {
      console.error(error);
    }
  },
  // editeService: async (req, res) => {
  //   try {
  //     const { serviceId } = req.body;
  //   } catch (error) {
  //     console.error(error);
  //   }
  // },
  confirm: async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      const token = authHeader.split(" ")[1];
      const user = jwt.decode(token);

      const { id } = req.body;

      const service = await servicesRegistrations
        .findOneAndUpdate(
          { _id: id }, // Filter criteria
          { $set: { status: 1 } }, // Update action
          { new: true } // Return the updated document
        )
        .populate({
          path: "user",
          select: "_id name surname avatar phone_number",
        })
        .populate({ path: "serviceId", select: "_id type" })
        .exec();
      const serviceDb = await CompanyServiceModel.findById(
        service.serviceId._id
      );
      const CompanyParticipants = await companyParticipants.findOne({
        user: service.user._id,
        companyId: serviceDb.companyId,
      });

      const daySlice = service.dealDate.slice(8, 10);
      const monthSlice = service.dealDate.slice(5, 7);
      const dateSlice = `${monthSlice}.${daySlice}`;

      const confirmedRegister = await servicesRegistrations
        .findOneAndUpdate(
          { _id: id },
          { $set: { dateSlice, date: service.dealDate } },
          { new: true }
        )
        .select("-dealDate")
        .populate({
          path: "user",
          select: "_id name surname avatar phone_number notifCompany",
        })
        .populate({
          path: "serviceId",
          select: "_id type images cost companyId description serviceRegister",
        })
        .exec();
      const time = confirmedRegister.date.split(" ")[1];
      if (user.id === service.user._id.toString()) {
        const notif = await Notification.findOne({
          user: user.id,
          serviceId: service.serviceId._id,
          registerId: id,
        });

        if (notif) {
          notif.confirmed = true;
          await notif.save();
        }

        const companyDb = await companyModel
          .findById(confirmedRegister.serviceId.companyId.toString())
          .populate("owner")
          .populate("images")
          .exec();
        const evLink = `alleven://myCompany/${companyDb._id}`;

        const dataNotif = {
          status: 2,
          date_time: moment.tz(process.env.TZ).format("YYYY-MM-DD HH:mm"),
          user: companyDb.owner._id.toString(),
          type: "Регистрации услугу",
          navigate: true,
          message: `Пользователь пoтвердил ваше предложение на услугу ${confirmedRegister.serviceId.type} время ${confirmedRegister.date}`,
          companyId: confirmedRegister.serviceId._id,
          cotegoryIcon: companyDb.images[0].url,
          link: evLink,
        };
        const nt = new Notification(dataNotif);
        await nt.save();
        // if (companyDb.owner.notifCompany) {
        notifEvent.emit(
          "send",
          companyDb.owner._id.toString(),
          JSON.stringify({
            type: "Регистрации услугу",
            companyId: confirmedRegister.serviceId._id,
            navigate: true,
            date_time: moment.tz(process.env.TZ).format("YYYY-MM-DD HH:mm"),
            message: `Пользователь пoтвердил ваше предложение на услугу ${confirmedRegister.serviceId.type} время ${confirmedRegister.date}`,
            serviceId: confirmedRegister.serviceId._id,
            cotegoryIcon: companyDb.images[0].url,
            link: evLink,
          })
        );
        // }
      } else {
        const companyDb = await companyModel
          .findById(confirmedRegister.serviceId.companyId.toString())
          .populate("owner")
          .populate("images")
          .exec();

        const notif = await Notification.findOne({
          user: user.id,
          serviceId: service.serviceId._id,
          registerId: id,
        });

        if (notif) {
          notif.confirmed = true;
          await notif.save();
        }
        const evLink = `alleven://singleCompany/${companyDb._id}`;

        const dataNotif = {
          status: 2,
          date_time: moment.tz(process.env.TZ).format("YYYY-MM-DD HH:mm"),
          user: confirmedRegister.user._id.toString(),
          type: "Регистрации услугу",
          message: `Организатор пoтвердил ваша запись на услугу ${confirmedRegister.serviceId.type} время ${confirmedRegister.date}`,
          companyId: confirmedRegister.serviceId._id,
          navigate: true,
          cotegoryIcon: companyDb.images[0].url,
          link: evLink,
        };
        const nt = new Notification(dataNotif);
        await nt.save();
        // if (confirmedRegister.user.notifCompany) {
        notifEvent.emit(
          "send",
          confirmedRegister.user._id.toString(),
          JSON.stringify({
            type: "Регистрации услугу",
            companyId: confirmedRegister.serviceId._id,
            date_time: moment.tz(process.env.TZ).format("YYYY-MM-DD HH:mm"),
            message: `Организатор пoтвердил ваша запись на услугу ${confirmedRegister.serviceId.type} время ${confirmedRegister.date}`,
            companyId: confirmedRegister.serviceId._id,
            navigate: true,
            cotegoryIcon: companyDb.images[0].url,
            link: evLink,
          })
        );
        // }
      }

      const dat = confirmedRegister.date;

      const registerTime = moment.tz(dat, process.env.TZ);
      const registerTimeFive = registerTime.clone().subtract(5, "minute");

      const notificationTime = registerTime.clone().subtract(1, "hour");
      if (!CompanyParticipants) {
        const newCompanyParticipants = new companyParticipants({
          user: service.user._id,
          companyId: serviceDb.companyId,
          serviceId: service.serviceId._id,
        });
        await newCompanyParticipants.save();
        await companyModel.findByIdAndUpdate(serviceDb.companyId, {
          $set: { participants: newCompanyParticipants._id },
        });
      }

      const currentTime = moment.tz(process.env.TZ).format();

      async function runAgenda(registerId, type) {
        await agenda.start(); // <-- Important!
        console.log("Agenda started!");
        const updatedRegisterForNotif = await servicesRegistrations.findById(
          id
        );
        const dat = updatedRegisterForNotif.date + ":00";

        const eventTime = moment.tz(dat, process.env.TZ);

        const eventTimeMinusFive = moment
          .tz(eventTime, process.env.TZ)
          .subtract(5, "minutes");
        console.log(eventTimeMinusFive, "Event time minus 5 minutes");

        const notificationTime = eventTime.clone().subtract(1, "hour");
        console.log(notificationTime, "Notification time hour before event");

        if (type === "participants") {
          console.log(
            "Job scheduled for notifTime hour:",
            notificationTime.toDate()
          );

          await agenda.schedule(
            notificationTime.toDate(),
            "send service notification",
            {
              registerId: registerId,
              type: "participants",
            }
          );
        }
        if (type === "participantsSpot") {
          console.log("Job scheduled for registerTime:", eventTime.toDate());

          await agenda.schedule(
            eventTimeMinusFive.toDate(),
            "send service notification",
            {
              registerId: registerId,
              type: "participantsSpot",
            }
          );
        }
      }

      agenda.define("send service notification", async (job) => {
        const { registerId, type } = job.attrs.data;

        console.log(`Job triggered: ${registerId}, type: ${type}`);
        const registerDb = await servicesRegistrations
          .findById(registerId)
          .populate("serviceId")
          .populate("user")
          .exec();
        if (type === "participants") {
          if (registerDb) {
            const evLink = `alleven://singleCompany/${registerDb.serviceId.companyId}`;
            const message = `Напоминание! Вы записаны на услугу ${registerDb.serviceId.type} сегодня в ${time}`;

            const dataNotif = {
              status: 2,
              date_time: moment.tz(process.env.TZ).format("YYYY-MM-DD HH:mm"),
              user: registerDb.user._id.toString(),
              type: "Регистрация на услугу",
              message: message,
              navigate: true,
              serviceId: registerDb.serviceId._id,
              companyId: registerDb.serviceId.companyId,
              link: evLink,
            };
            const nt = new Notification(dataNotif);
            await nt.save();
            if (registerDb.user.notifCompany) {
              notifEvent.emit(
                "send",
                registerDb.user._id.toString(),
                JSON.stringify({
                  type: "Регистрация на услугу",
                  serviceId: registerDb.serviceId._id,
                  date_time: moment
                    .tz(process.env.TZ)
                    .format("YYYY-MM-DD HH:mm"),
                  navigate: true,
                  companyId: registerDb.serviceId.companyId,
                  message: message,
                  link: evLink,
                })
              );
            }
          }
        }

        if (type === "participantsSpot") {
          if (registerDb) {
            const evLink = `alleven://singleCompany/${registerDb.serviceId.companyId}`;
            const message = `Напоминание! Вы записаны на услугу ${registerDb.serviceId.type} сегодня в ${time}`;

            const dataNotif = {
              status: 2,
              date_time: moment.tz(process.env.TZ).format("YYYY-MM-DD HH:mm"),
              user: registerDb.user._id.toString(),
              type: "Регистрация на услугу",
              message: message,
              navigate: true,
              serviceId: registerDb.serviceId._id,
              companyId: registerDb.serviceId.companyId,
              link: evLink,
            };
            const nt = new Notification(dataNotif);
            await nt.save();
            if (registerDb.user.notifCompany) {
              notifEvent.emit(
                "send",
                registerDb.user._id.toString(),
                JSON.stringify({
                  type: "Регистрация на услугу",
                  serviceId: registerDb.serviceId._id,
                  companyId: registerDb.serviceId.companyId,
                  navigate: true,
                  date_time: moment
                    .tz(process.env.TZ)
                    .format("YYYY-MM-DD HH:mm"),
                  message: message,
                  link: evLink,
                })
              );
            }
          }
        }
      });

      runAgenda(service._id.toString(), "participants")
        .then(() => console.log("Agenda job scheduled successfully"))
        .catch((error) => console.error("Error scheduling agenda job:", error));
      runAgenda(service._id.toString(), "participantsSpot")
        .then(() => console.log("Agenda job scheduled successfully"))
        .catch((error) => console.error("Error scheduling agenda job:", error));

      res
        .status(200)
        .send({ message: "запись подтверждена.", data: confirmedRegister });
    } catch (error) {
      console.error(error);
    }
  },
  registr: async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      const { serviceId, date, route } = req.body;

      const service = await CompanyServiceModel.findById(serviceId);
      const token = authHeader.split(" ")[1];
      const user = jwt.decode(token);
      const daySlice = date.slice(8, 10);
      const monthSlice = date.slice(5, 7);
      const dateSlice = `${monthSlice}.${daySlice}`;
      const companyDb = await companyModel
        .findById(service.companyId.toString())
        .populate("category")
        .populate("owner");

      const decideDay = async (daysDb, today) => {
        moment.locale("ru");
        const specificDate = moment.tz(today, process.env.TZ);
        const dayName = specificDate.format("dddd");
        const daysFunc = (daysDb) => {
          if (daysDb === "Пн․- Пят․") {
            return ["понедельник", "вторник", "среда", "четверг", "пятница"];
          } else if (daysDb === "Пн․- Сб.") {
            return [
              "понедельник",
              "вторник",
              "среда",
              "четверг",
              "пятница",
              "суббота",
            ];
          } else if (daysDb === "Суб․- Вс․") {
            return ["суббота", "воскресенье"];
          } else if (daysDb === "Вт․- Вс․") {
            return [
              "вторник",
              "среда",
              "четверг",
              "пятница",
              "суббота",
              "воскресенье",
            ];
          } else if (daysDb === "Пн․- Чт․") {
            return ["понедельник", "вторник", "среда", "четверг"];
          }
        };

        const days = daysFunc(daysDb);

        const findDay = days.filter((day) => day === dayName);

        if (findDay) {
          return true;
        } else {
          return false;
        }
      };
      const priceDb = await commission.findOne();

      const opensDays = await decideDay(companyDb.days, date);
      if (!opensDays) {
        return res.status(200).send({ message: "выходной день" });
      } else {
        const userDb = await User.findById(user.id);

        const datePayment = moment
          .tz(process.env.TZ)
          .format("YYYY-MM-DD HH:mm:ss");

        const comm = new paysStore({
          name: userDb.name,
          surname: userDb.surname,
          serviceName: service.type,
          companyName: companyDb.companyName,
          price: priceDb.price,
          // operationId: response.data.Data.operationId,
          // registerId: Db._id,
          companyId: companyDb._id,
          serviceId,
          date,
          payTime: datePayment,
        });
        await comm.save();

        const paymentData = {
          Data: {
            customerCode: process.env.CUSTOMER_CODE,
            amount: priceDb.price,
            purpose: "Перевод за оказанные услуги",
            redirectUrl: `${process.env.REDIRECT_URL}/api/pay/success/${comm._id}?name=${service.type}&date=${date}`,
            failRedirectUrl: `${process.env.REDIRECT_URL}/api/pay/reject/${comm._id}?name=${service.type}&date=${date}`,
            paymentMode: ["sbp", "card", "tinkoff"],
            saveCard: false,
          },
        };
        console.log(paymentData, "paymentData");

        const response = await axios.post(
          "https://enter.tochka.com/uapi/acquiring/v1.0/payments",
          paymentData,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${process.env.ACCESS_TOKEN}`, // Corrected header for authentication
            },
          }
        );
        // if(response.data.Data.paymentLink){

        // }
        const Db = new servicesRegistrations({
          serviceId,
          date,
          user: user.id,
          dateSlice,
          dealDate: date,
          category: companyDb.category._id,
          payStoreId: comm._id,
          operationId: response.data.Data.operationId,
        });
        await Db.save();

        service.serviceRegister.push(Db._id);
        await service.save();

        // const evLink = `alleven://myCompany/${companyDb._id}`;

        // const time = date.split(" ")[1];
        // const day = date.split(" ")[0].split("-")[2];
        // const monthName = moment(date).locale("ru").format("MMMM");

        // const dataNotif = {
        //   status: 2,
        //   date_time: moment.tz(process.env.TZ).format("YYYY-MM-DD HH:mm"),
        //   user: companyDb.owner._id.toString(),
        //   type: "Записались на услуги",
        //   message: `Пользователь ${userDb.name} ${userDb.surname} записался на услугу на ${day} ${monthName} ${time}.`,
        //   categoryIcon: service.images[0], //sarqel
        //   createId: serviceId,
        //   link: evLink,
        // };
        // const nt = new Notification(dataNotif);
        // await nt.save();
        // if (companyDb.owner.notifCompany) {
        //   notifEvent.emit(
        //     "send",
        //     companyDb.owner._id.toString(),
        //     JSON.stringify({
        //       type: "Записались на услуги",
        //       createId: serviceId,
        //       date_time: moment.tz(process.env.TZ).format("YYYY-MM-DD HH:mm"),
        //       navigate:false,
        //       message: `Пользователь ${userDb.name} ${userDb.surname} записался на услугу на ${day} ${monthName} ${time}.`,
        //       categoryIcon: service.images[0], //sarqel
        //       link: evLink,
        //     })
        //   );
        // }

        return res
          .status(200)
          .send({ message: "success", link: response.data.Data.paymentLink });
      }
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Server Error" });
    }
  },
  deleteRegistr: async (req, res) => {
    try {
      const { id } = req.body;
      await Notification.deleteMany({ register: id });
      const result = await servicesRegistrations.findByIdAndDelete(id);
      res.status(200).send({ message: "запись удалена." });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Server Error" });
    }
  },
};

export default servicesController;
