import notifEvent from "../events/NotificationEvent.js";
import companyCategory from "../models/company/companyCategory.js";
import CompanyServiceModel from "../models/company/companyService.js";
import Notification from "../models/Notification.js";
import User from "../models/User.js";
import moment from "moment-timezone";
import companyImage from "../models/company/companyImage.js";
import mongoose from "mongoose";
import companyPhones from "../models/company/companyPhones.js";
import CompanyComment from "../models/company/companyComment.js";
import companyFavorit from "../models/company/companyFavorit.js";
import companyRating from "../models/company/companyRating.js";
import companyComment from "../models/company/companyComment.js";
import companyCommentAnswer from "../models/company/companyCommentAnswer.js";
import CommentAnswerLikes from "../models/company/companyCommentAnswerLike.js";
import companyCommentLike from "../models/company/companyCommentLike.js";
import companyCommentAnswerLike from "../models/company/companyCommentAnswerLike.js";
import companyLikes from "../models/company/companyLikes.js";
import companyView from "../models/company/companyView.js";
import servicesRegistrations from "../models/services/servicesRegistrations.js";
import companyImpressionImages from "../models/company/companyImpressionImages.js";
import companyHotDeals from "../models/company/companyHotDeals.js";
import companyHotDealRegistrations from "../models/company/companyHotDealRegistration.js";
import companyModel from "../models/company/companyModel.js";
import commission from "../models/commission.js";
import companyParticipants from "../models/company/companyParticipants.js";
import axios from "axios";
import Report from "../models/Report.js";
import paysStore from "../models/paysStore.js";
import companyHotDealRegistration from "../models/company/companyHotDealRegistration.js";
import ImpressionsCompany from "../models/ImpressionsCompany.js";
import calculateAverageRating from "../helper/ratingCalculate.js";
import calculateDistance from "../helper/distanceCalculate.js";
import deleteImage from "../helper/imageDelete.js";
import { __dirname } from "../index.js";
import { separateUpcomingAndPassedCompany } from "../helper/upcomingAndPassed.js";

const companyService = {
  myparticipant: async (id, latitude, longitude) => {
    const results = [];
    const registrations = await servicesRegistrations
      .find({ user: id })
      .populate("serviceId");

    for (let i = 0; i < registrations.length; i++) {
      const obj = {};
      const company = await companyModel
        .findById(registrations[i].serviceId.companyId)
        .populate("images")
        .populate("category");
      obj.date = registrations[i].date;
      obj.status = registrations[i].status;
      obj.type = registrations[i].serviceId.type;
      obj.cost = registrations[i].serviceId.cost;
      obj.serviceDescription = registrations[i].serviceId.description;
      obj.companyName = company.companyName;
      obj.latitude = company.latitude;
      obj.longitude = company.longitude;
      obj.ratingCalculated = company.ratingCalculated;
      obj.address = company.address;
      obj.startHour = company.startHour;
      obj.endHour = company.endHour;
      obj.comments = company.comments;
      obj.kilometr = company.kilometr;
      obj.open = company.open;
      obj.id = company._id;
      obj.images = company.images;
      obj.category = company.category.name;
      obj.categoryId = company.category._id;
      obj.isRating = false;
      const is_rating = companyRating.find({
        companyId: company._id,
        user: id,
      });

      if (is_rating[0]) {
        obj.isRating = true;
      }
      const hours = moment.tz(process.env.TZ).format("HH:mm");

      function isCompanyOpen(startHour, closeHour, currentTime) {
        const parseTime = (time) => {
          const [hour, minute] = time.split(":").map(Number);
          return { hour, minute };
        };

        const toMinutes = ({ hour, minute }) => hour * 60 + minute;

        const start = parseTime(startHour);
        const close = parseTime(closeHour);
        const current = parseTime(currentTime);

        const startMinutes = toMinutes(start);
        const closeMinutes =
          toMinutes(close) + (close.hour < start.hour ? 24 * 60 : 0); // Handle next-day close
        const currentMinutes = toMinutes(current);

        return currentMinutes >= startMinutes && currentMinutes < closeMinutes;
      }

      const openBool = isCompanyOpen(company.startHour, company.endHour, hours);

      if (!latitude && !longitude) {
        obj.kilometr = null;
      } else {
        obj.kilometr = calculateDistance(
          latitude,
          longitude,
          company.latitude,
          company.longitude
        );
      }

      obj.open = openBool;
      results.push(obj);
    }

    const upcomPass = separateUpcomingAndPassedCompany(results);

    return {
      message: "success",
      upcoming: upcomPass.upcoming,
      passed: upcomPass.passed,
    };
  },
  // dealsRegisters: async (id) => {
  //   const result = await companyHotDeals
  //     .find({ companyId: id })
  //     .populate({path:"registration",populate:{path:"user",select:"name surname avatar phone_number"}});
  //   return result.registration;
  // },
  serviceUpdate: async (id, data) => {
    const result = await CompanyServiceModel.findByIdAndUpdate(id, data, {
      new: true,
    });
    return result;
  },
  deatRegister: async (dealId, userId) => {
    try {
      const priceDb = await commission.findOne();

      const findHotDeal = await companyHotDeals.findById(dealId);
      const dealRegister = new companyHotDealRegistrations({
        dealId,
        user: userId,
        startTime: findHotDeal.date,
        companyId: findHotDeal.companyId,
        date: findHotDeal.date,
      });
      await dealRegister.save();

      // await companyHotDeals.findByIdAndUpdate(dealId, {
      //   $push: { registration: dealRegister._id },
      //   situation: "passed",
      //   // free: false,
      // });

      // const CompanyParticipants = await companyParticipants.findOne({
      //   user: userId,
      //   companyId: findHotDeal.companyId,
      // });

      // if (!CompanyParticipants) {
      //   const newCompanyParticipants = new companyParticipants({
      //     user: userId,
      //     companyId: findHotDeal.companyId,
      //   });
      //   await newCompanyParticipants.save();
      //   await companyModel.findByIdAndUpdate(findHotDeal.companyId, {
      //     $set: { participants: newCompanyParticipants._id },
      //   });
      // }

      const paymentData = {
        Data: {
          customerCode: process.env.CUSTOMER_CODE,
          amount: priceDb.price,
          purpose: "Перевод за оказанные услуги",
          redirectUrl: `${process.env.REDIRECT_URL}/api/pay/deal/success/${dealRegister._id}`,
          failRedirectUrl: `${process.env.REDIRECT_URL}/api/pay//deal/reject/${dealRegister._id}`,
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

      return {
        success: true,
        message: "Успешно зарегистрировано",
        link: response.data.Data.paymentLink,
      };
    } catch (error) {
      console.error(
        "Payment API Error:",
        error.response?.data || error.message
      );
      return {
        success: false,
        message: "Ошибка регистрации платежа",
        error: error.response?.data || error.message,
      };
    }
  },
  addHotDeals: async (companyId, description, cost, date, user) => {
    const hotDeal = new companyHotDeals({
      companyId,
      description,
      cost,
      date,
      user,
    });
    await hotDeal.save();
    console.log(companyId, "companyId hot deal");

    const result = await companyModel.findById(companyId);
    result.hotDeals.push(hotDeal._id);
    await result.save();

    return hotDeal;
  },
  companyEdit: async (data) => {
    try {
      const companyDbforImg = await companyModel
        .findById(data._id)
        .select("images")
        .populate("images");
      console.log(companyDbforImg, "companyDbforImg");
      console.log(data.images, "data.images");

      await companyImage.deleteMany({ companyId: data._id });
      await companyModel.findByIdAndUpdate(data._id, { $set: { images: [] } });

      if (typeof data.images[0] === "string") {
        companyDbforImg.images.map(async (imgId) => {
          const imageDel = await deleteImage(__dirname, imgId.url);
        });
        for (let i = 0; i < data.images.length; i++) {
          const image = new companyImage({
            url: data.images[i],
            companyId: data._id,
          });
          console.log(image, "imagedb new");

          await image.save();
          await companyModel.findByIdAndUpdate(data._id, {
            $push: { images: image._id },
          });
        }
      } else {
        delete data.images;
      }

      await companyPhones.deleteMany({ companyId: data._id });
      for (let i = 0; i < data.phoneNumbers.length; i++) {
        const phone = new companyPhones({
          number: data.phoneNumbers[i].number,
          companyId: data._id,
          whatsApp: data.phoneNumbers[i].whatsApp,
          telegram: data.phoneNumbers[i].telegram,
        });
        await phone.save();
        await companyModel.findByIdAndUpdate(data._id, {
          $push: { phoneNumbers: phone._id },
        });
      }
      const newData = {};
      newData.companyName = data.companyName;
      newData.web = data.web;
      newData.latitude = data.latitude;
      newData.longitude = data.longitude;
      newData.address = data.address;
      // newData.email = data.email;
      newData.startHour = data.startHour;
      newData.endHour = data.endHour;
      newData.days = data.days;
      const startTime = moment.tz(data.startHour, "HH:mm", process.env.TZ);
      const endTime = moment.tz(data.endHour, "HH:mm", process.env.TZ);
      if (startTime < endTime) {
        newData.isNight = false;
      } else {
        newData.isNight = true;
      }
      const updatedCompany = await companyModel
        .findByIdAndUpdate(
          data._id,
          { ...newData, updatedAt: moment.tz(process.env.TZ).format() },
          { new: true }
        )
        .populate("services");

      return updatedCompany;
    } catch (error) {
      console.log(error);

      return false;
    }
  },
  impressionImagesStore: async (companyId, path, user) => {
    const companyImpressionImagesDb = await companyImpressionImages
      .findOne({ companyId, user: user })
      .populate({ path: "user", select: "name surname avatar" });
    const companyDb = await companyModel.findById(companyId).populate("owner");
    if (companyDb.owner._id.toString() !== user) {
      const evLink = `alleven://myCompany/${companyDb._id}`;
      const dataNotif = {
        status: 2,
        date_time: moment.tz(process.env.TZ).format("YYYY-MM-DD HH:mm"),
        user: companyDb.owner._id.toString(),
        type: "like",
        navigate: true,
        message: `У вас новое сообщение.`,
        companyId: companyDb._id,
        link: evLink,
      };
      const nt = new Notification(dataNotif);
      await nt.save();
      if (companyDb.owner.notifEvent) {
        notifEvent.emit(
          "send",
          companyDb.owner._id.toString(),
          JSON.stringify({
            type: "like",
            eventId: companyDb._id,
            navigate: true,
            date_time: moment.tz(process.env.TZ).format("YYYY-MM-DD HH:mm"),
            message: `У вас новое сообщение.`,
            link: evLink,
          })
        );
      }
    }

    if (!companyImpressionImagesDb) {
      const resultDb = new companyImpressionImages({
        path,
        user: user,
        companyId,
      });
      await resultDb.save();
      await companyModel.findByIdAndUpdate(companyId, {
        $push: { impression_images: resultDb._id },
      });
      const result = await companyImpressionImages
        .findById(resultDb._id)
        .populate({ path: "user", select: "name surname avatar" });

      return { result, bool: false };
    } else {
      for (let i = 0; i < path.length; i++) {
        companyImpressionImagesDb.path.push(path[i]);
        await companyImpressionImagesDb.save();
      }
      const result = await companyImpressionImages
        .findById(companyImpressionImagesDb._id)
        .populate({ path: "user", select: "name surname avatar" });

      return { result, bool: true };
    }
  },
  deleteService: async (id) => {
    await Notification.deleteMany({ serviceId: id });
    await Report.deleteMany({ service: id });
    await paysStore.deleteMany({ serviceId: id });
    await companyParticipants.deleteMany({ serviceId: id });
    const serviceDb = await CompanyServiceModel.findById(id);

    await companyModel.findByIdAndUpdate(serviceDb.companyId.toString(), {
      $pull: { services: id },
    });
    await servicesRegistrations.deleteMany({ serviceId: id });
    await CompanyServiceModel.findByIdAndDelete(id);
    return { success: true, message: "Услуга удалена" };
  },
  destroyCompanyImage: async (id) => {
    const dbCompanyImage = await companyImage.findById(id);
    const dbCompany = await companyModel.findByIdAndUpdate(
      dbCompanyImage.companyId,
      {
        $pull: { images: dbCompanyImage._id },
      }
    );
    await companyImage.findByIdAndDelete(id);
    return { success: true, message: "Успешно удалено" };
  },
  addImage: async (id, path) => {
    const dbCompanyImage = new companyImage({ url: path, companyId: id });
    await dbCompanyImage.save();
    await companyImage.findByIdAndUpdate(id, {
      $push: { images: dbCompanyImage._id },
    });
    return dbCompanyImage;
  },
  destroyCompany: async (des_events) => {
    if (Array.isArray(des_events)) {
      for (let i = 0; i < des_events.length; i++) {
        const company = await companyModel.findById(des_events[i]);
        await Notification.deleteMany({ companyId: des_events[i] });
        await Report.deleteMany({ company: des_events[i] });
        if (!company) {
          throw new Error("Event not found");
        }

        const comments = await companyComment.find({
          companyId: des_events[i],
        });

        for (const comment of comments) {
          await companyCommentLike.deleteMany({ commentId: comment._id });

          const answers = await companyCommentAnswer.find({
            commentId: comment._id,
          });

          for (const answer of answers) {
            await companyCommentAnswerLike.deleteMany({ answerId: answer._id });
          }

          await companyCommentAnswer.deleteMany({ commentId: comment._id });
        }
        await companyParticipants.deleteMany({ companyId: des_events[i] });
        await ImpressionsCompany.deleteMany({ company: des_events[i] });

        await companyComment.deleteMany({ companyId: des_events[i] });
        await companyImage.deleteMany({ companyId: des_events[i] });
        await companyLikes.deleteMany({ companyId: des_events[i] });
        await companyFavorit.deleteMany({ companyId: des_events[i] });
        await companyView.deleteMany({ companyId: des_events[i] });
        await companyRating.deleteMany({ companyId: des_events[i] });
        await companyPhones.deleteMany({ companyId: des_events[i] });
        await paysStore.deleteMany({ companyId: des_events[i] });
        const companyHotDealDb = await companyHotDeals.find({
          companyId: des_events[i],
        });
        for (let i = 0; i < companyHotDealDb.length; i++) {
          await companyHotDealRegistration.deleteMany({
            dealId: companyHotDealDb[i]._id,
          });
        }
        const services = await CompanyServiceModel.find({
          companyId: des_events[i],
        });
        for (let z = 0; z < services.length; z++) {
          await Notification.deleteMany({ serviceId: services[z]._id });
          await Report.deleteMany({ service: services[z]._id });
        }
        for (let j = 0; j < services.length; j++) {
          await servicesRegistrations.deleteMany({
            serviceId: services[j]._id,
          });
        }
        for (let i = 0; i < company.participants.length; i++) {
          await companyParticipants.findByIdAndDelete(company.participants[i]);
        }
        await CompanyServiceModel.deleteMany({ companyId: des_events[i] });
        await companyImpressionImages.deleteMany({ companyId: des_events[i] });
        await companyHotDeals.deleteMany({ companyId: des_events[i] });
        const UserDb = await User.findById(company.owner.toString());
        UserDb.company = null;
        await UserDb.save();
        await company.remove();
        console.log("Company and all related data deleted successfully");
      }
    }
    if (typeof des_events === "string") {
      const company = await companyModel.findById(des_events);
      await Notification.deleteMany({ companyId: des_events });
      await Report.deleteMany({ company: des_events });
      if (!company) {
        throw new Error("Meeting not found");
      }

      const comments = await companyComment.find({ companyId: des_events });

      for (const comment of comments) {
        await companyCommentLike.deleteMany({ commentId: comment._id });

        const answers = await companyCommentAnswer.find({
          commentId: comment._id,
        });

        for (const answer of answers) {
          await companyCommentAnswerLike.deleteMany({ answerId: answer._id });
        }

        await companyCommentAnswer.deleteMany({ commentId: comment._id });
      }
      await companyParticipants.deleteMany({ companyId: des_events });
      await ImpressionsCompany.deleteMany({ company: des_events });
      await companyComment.deleteMany({ companyId: des_events });
      await companyImage.deleteMany({ companyId: des_events });
      await companyLikes.deleteMany({ companyId: des_events });
      await companyFavorit.deleteMany({ companyId: des_events });
      await companyView.deleteMany({ companyId: des_events });
      await companyRating.deleteMany({ companyId: des_events });
      await companyPhones.deleteMany({ companyId: des_events });
      await paysStore.deleteMany({ companyId: des_events });
      const companyHotDealDb = await companyHotDeals.find({
        companyId: des_events,
      });
      for (let i = 0; i < companyHotDealDb.length; i++) {
        await companyHotDealRegistration.deleteMany({
          dealId: companyHotDealDb[i]._id,
        });
      }
      const services = await CompanyServiceModel.find({
        companyId: des_events,
      });
      for (let i = 0; i < services.length; i++) {
        await Notification.deleteMany({ serviceId: services[i]._id });
        await Report.deleteMany({ service: services[i]._id });
        await paysStore.deleteMany({ serviceId: services[i]._id });
      }
      for (let i = 0; i < services.length; i++) {
        await servicesRegistrations.deleteMany({ serviceId: services[i]._id });
      }
      for (let i = 0; i < company.participants.length; i++) {
        await companyParticipants.findByIdAndDelete(company.participants[i]);
      }
      await CompanyServiceModel.deleteMany({ companyId: des_events });
      await companyHotDeals.deleteMany({ companyId: des_events });
      await companyImpressionImages.deleteMany({ companyId: des_events });
      const UserDb = await User.findById(company.owner.toString());
      UserDb.company = null;
      await UserDb.save();
      await company.remove();

      console.log("Company and all related data deleted successfully");
    }
    return { message: "success" };
  },
  commentDelete: async (id) => {
    try {
      const commentDb = await companyComment.findById(id);
      await commentDb.remove();
      const commentAnswerDb = await companyCommentAnswer.find({
        commentId: id,
      });
      await commentAnswerDb.remove();
      const commentLikesDb = await companyCommentLike.find({ commentId: id });
      await commentLikesDb.remove();
      const commentAnswerLikesDb = await CommentAnswerLikes.find({
        answerId: commentAnswerDb[0]._id,
      });
      await commentAnswerLikesDb.remove();
      const meetingDb = await companyModel.findByIdAndUpdate(
        commentDb.companyId,
        {
          $pull: { comments: commentDb._id },
        }
      );
      return {
        success: true,
        message: "Successfully deleted",
      };
    } catch (error) {
      console.error(error);
      return false;
    }
  },
  commentAnswerDelete: async (id) => {
    try {
      await CommentAnswerLikes.deleteMany({ answerId: id });
      await companyCommentAnswer.findByIdAndDelete(id);
      await companyComment.findByIdAndUpdate(id, { $pull: { answers: id } });
      return {
        success: true,
        message: "Successfully deleted",
      };
    } catch (error) {
      console.error(error);
      return false;
    }
  },
  onlinePage: async () => {
    try {
      const company = await companyModel.find({ status: 1, onlinePay: 1 });
      return company;
    } catch (error) {
      console.error(error);
      return false;
    }
  },

  commentAnswerLike: async (answerId, user) => {
    try {
      const isLike = await CommentAnswerLikes.findOne({
        user: user,
        answerId,
      });
      if (isLike) {
        await companyCommentAnswer.findByIdAndUpdate(answerId, {
          $pull: { likes: isLike._id },
        });
        await companyCommentLike.findByIdAndDelete(isLike._id);
        const answerLikeCount = await CommentAnswerLikes.find({ answerId });
        return { message: "unlike", count: answerLikeCount.length };
      } else {
        const date = moment.tz(process.env.TZ).format("YYYY-MM-DD HH:mm:ss");
        const commentAnswerLike = new CommentAnswerLikes({
          user: user,
          answerId,
          date,
        });
        await commentAnswerLike.save();
        const commentAnswerDb = await companyCommentAnswer
          .findByIdAndUpdate(answerId, {
            $push: { likes: commentAnswerLike._id },
          })
          .populate("user");
        const answerLikeCount = await CommentAnswerLikes.find({ answerId });
        const companyDb = await companyModel
          .findById(commentAnswerDb.companyId)
          .populate("owner");
        if (commentAnswerDb.user._id.toString() !== user) {
          let evLink;
          if (
            companyDb.owner._id.toString() ===
            commentAnswerDb.user._id.toString()
          ) {
            evLink = `alleven://myCompany/${companyDb._id}`;
          } else {
            evLink = `alleven://singleCompany/${companyDb._id}`;
          }
          const dataNotif = {
            status: 2,
            date_time: moment.tz(process.env.TZ).format("YYYY-MM-DD HH:mm"),
            user: commentAnswerDb.user._id.toString(),
            type: "like",
            navigate: true,
            message: `У вас новое сообщение.`,
            companyId: companyDb._id,
            link: evLink,
          };
          const nt = new Notification(dataNotif);
          await nt.save();
          if (commentAnswerDb.user.notifEvent) {
            notifEvent.emit(
              "send",
              commentAnswerDb.user._id.toString(),
              JSON.stringify({
                type: "like",
                eventId: companyDb._id,
                navigate: true,
                date_time: moment.tz(process.env.TZ).format("YYYY-MM-DD HH:mm"),
                message: `У вас новое сообщение.`,
                link: evLink,
              })
            );
          }
        }

        return { message: "like", count: answerLikeCount.length };
      }
    } catch (error) {
      console.error(error);
      return false;
    }
  },
  commentAnswer: async (commentId, user, text) => {
    try {
      const comment = await CompanyComment.findById(commentId).populate("user");
      const commentAnswer = new companyCommentAnswer({
        commentId,
        user,
        text,
        companyId: comment.companyId,
        date: moment.tz(process.env.TZ).format(),
      });
      await commentAnswer.save();
      comment.answer.push(commentAnswer._id);
      await comment.save();
      const companyDb = await companyModel
        .findById(comment.companyId)
        .populate("owner");
      if (comment.user._id.toString() !== user.toString()) {
        let evLink;
        if (companyDb.owner._id.toString() === comment.user._id.toString()) {
          evLink = `alleven://myCompany/${companyDb._id}`;
        } else {
          evLink = `alleven://singleCompany/${companyDb._id}`;
        }
        const dataNotif = {
          status: 2,
          date_time: moment.tz(process.env.TZ).format("YYYY-MM-DD HH:mm"),
          user: comment.user._id.toString(),
          type: "like",
          navigate: true,
          message: `У вас новое сообщение.`,
          companyId: companyDb._id,
          link: evLink,
        };
        const nt = new Notification(dataNotif);
        await nt.save();
        if (comment.user.notifEvent) {
          notifEvent.emit(
            "send",
            comment.user._id.toString(),
            JSON.stringify({
              type: "like",
              eventId: companyDb._id,
              navigate: true,
              date_time: moment.tz(process.env.TZ).format("YYYY-MM-DD HH:mm"),
              message: `У вас новое сообщение.`,
              link: evLink,
            })
          );
        }
      }

      return commentAnswer;
    } catch (error) {
      console.error(error);
      return false;
    }
  },
  commentLike: async (commentId, user) => {
    try {
      const isLike = await companyCommentLike.findOne({ user, commentId });
      if (isLike) {
        await companyComment.findByIdAndUpdate(commentId, {
          $pull: { likes: isLike._id },
        });
        await companyCommentLike.findByIdAndDelete(isLike._id);
        const commentLikeCount = await companyCommentLike.find({ commentId });
        return { message: "unlike", count: commentLikeCount.length };
      } else {
        const commentLike = new companyCommentLike({ user, commentId });
        await commentLike.save();
        const commentDb = await companyComment
          .findById(commentId)
          .populate("user");
        commentDb.likes.push(commentLike._id);
        await commentDb.save();
        const commentLikeCount = await companyCommentLike.find({ commentId });
        const companyDb = await companyModel
          .findById(commentDb.companyId)
          .populate("owner");

        if (commentDb.user._id.toString() !== user.toString()) {
          let evLink;
          if (
            companyDb.owner._id.toString() === commentDb.user._id.toString()
          ) {
            evLink = `alleven://myCompany/${companyDb._id}`;
          } else {
            evLink = `alleven://singleCompany/${companyDb._id}`;
          }
          const dataNotif = {
            status: 2,
            date_time: moment.tz(process.env.TZ).format("YYYY-MM-DD HH:mm"),
            user: commentDb.user._id.toString(),
            type: "like",
            navigate: true,
            message: `У вас новое сообщение.`,
            companyId: companyDb._id,
            link: evLink,
          };
          const nt = new Notification(dataNotif);
          await nt.save();
          if (commentDb.user.notifEvent) {
            notifEvent.emit(
              "send",
              commentDb.user._id.toString(),
              JSON.stringify({
                type: "like",
                eventId: companyDb._id,
                navigate: true,
                date_time: moment.tz(process.env.TZ).format("YYYY-MM-DD HH:mm"),
                message: `У вас новое сообщение.`,
                link: evLink,
              })
            );
          }
        }

        return { message: "like", count: commentLikeCount.length };
      }
    } catch (error) {
      console.log(error);
      return false;
    }
  },
  rating: async (eventId, user, rating) => {
    try {
      const ifRating = await companyRating.findOne({
        companyId: eventId,
        user,
      });

      if (ifRating) {
        // await companyRating.findByIdAndDelete(ifRating._id)
        // await companyModel.findByIdAndUpdate(eventId, {
        //   $pull: { rating: ifRating._id },
        // });
        return {
          success: false,
          message: "вы уже оценили",
        };
      } else {
        const date = moment.tz(process.env.TZ).format("YYYY-MM-DD");

        const ratingDb = new companyRating({
          companyId: eventId,
          user,
          rating,
          date,
        });
        await ratingDb.save();
        await companyModel.findByIdAndUpdate(eventId, {
          $push: { ratings: ratingDb._id },
        });
        const ratings = await companyRating.find({ companyId: eventId }).lean();

        const averageRating = calculateAverageRating(ratings);

        const newGet = await companyModel
          .findByIdAndUpdate(
            eventId,
            {
              ratingCalculated: averageRating,
            },
            { new: true }
          )
          .populate("ratings")
          .populate("owner");
        if (newGet.owner._id.toString() !== user.toString()) {
          const evLink = `alleven://myCompany/${newGet._id}`;
          const dataNotif = {
            status: 2,
            date_time: moment.tz(process.env.TZ).format("YYYY-MM-DD HH:mm"),
            user: newGet.owner._id.toString(),
            type: "message",
            navigate: true,
            message: `У вас новое сообщение.`,
            companyId: newGet._id,
            link: evLink,
          };
          const nt = new Notification(dataNotif);
          await nt.save();
          if (newGet.owner.notifEvent) {
            notifEvent.emit(
              "send",
              newGet.owner._id.toString(),
              JSON.stringify({
                type: "message",
                eventId: newGet._id,
                navigate: true,
                date_time: moment.tz(process.env.TZ).format("YYYY-MM-DD HH:mm"),
                message: `У вас новое сообщение.`,
                link: evLink,
              })
            );
          }
        }

        return { success: true, averageRating, ratings: newGet.ratings };
      }
    } catch (error) {
      console.log(error);
      return false;
    }
  },
  onlineReject: async (id, status) => {
    try {
      const companyDb = await companyModel
        .findById(id)
        .populate({ path: "owner", select: "-password" })
        .populate("category")
        .populate("images")
        .populate("services")
        .populate("phoneNumbers");
      companyDb.onlinePay = 3;
      companyDb.onlineReason = status;
      await companyDb.save();
      const userDb = await User.findById(companyDb.owner._id.toString());

      const evLink = `alleven://myCompany/${companyDb._id}`;

      const dataNotif = {
        status: 2,
        date_time: moment.tz(process.env.TZ).format("YYYY-MM-DD HH:mm"),
        user: userDb._id.toString(),
        type: "Онлайн оплата",
        message: `Вашей организации отклонена функция онлайн бронирования услуги, причина - ${status}`,
        companyId: companyDb._id,
        navigate: true,
        categoryIcon: companyDb.category.avatar,
        link: evLink,
      };
      const nt = new Notification(dataNotif);
      await nt.save();

      // if (userDb.notifCompany) {
      notifEvent.emit(
        "send",
        userDb._id.toString(),
        JSON.stringify({
          type: "Онлайн оплата",
          companyId: companyDb._id,
          date_time: moment.tz(process.env.TZ).format("YYYY-MM-DD HH:mm"),
          categoryIcon: companyDb.category.avatar,
          navigate: true,
          message: `Вашей организации отклонена функция онлайн бронирования услуги, причина - ${status}`,
          link: evLink,
        })
      );
      // }

      return companyDb;
    } catch (error) {
      console.error(error);
    }
  },
  reject: async (id, status) => {
    try {
      const companyDb = await companyModel
        .findById(id)
        .populate({ path: "owner", select: "-password" })
        .populate("category")
        .populate("images")
        .populate("services")
        .populate("phoneNumbers");
      companyDb.status = 2;
      if (status) {
        companyDb.rejectMessage = status;
      }
      await companyDb.save();

      const userDb = await User.findById(companyDb.owner._id.toString());

      const evLink = `alleven://myCompany/${companyDb._id}`;
      const dataNotif = {
        status: 2,
        date_time: moment.tz(process.env.TZ).format("YYYY-MM-DD HH:mm"),
        user: userDb._id.toString(),
        type: "Отклонение услуги",
        message: `К сожалению, ваше событие ${companyDb.companyName} отклонено модератором, причина - ${status}.`,
        companyId: companyDb._id,
        navigate: true,
        categoryIcon: companyDb.category.avatar,
        link: evLink,
      };
      const nt = new Notification(dataNotif);
      await nt.save();

      if (userDb.notifCompany) {
        notifEvent.emit(
          "send",
          userDb._id.toString(),
          JSON.stringify({
            type: "Отклонение услуги",
            companyId: companyDb._id,
            date_time: moment.tz(process.env.TZ).format("YYYY-MM-DD HH:mm"),
            categoryIcon: companyDb.category.avatar,
            navigate: true,
            message: `К сожалению, ваше событие ${companyDb.companyName} отклонено модератором, причина - ${status}.`,
            link: evLink,
          })
        );
      }

      return companyDb;
    } catch (error) {
      console.error(error);
    }
  },
  onlineResolve: async (id) => {
    const company = await companyModel.findById(id);
    company.onlinePay = true;
    await company.save();
    return { message: "заявка одобрена" };
  },
  resolve: async (id) => {
    const company = await companyModel.findById(id);
    company.status = 1;
    await company.save();
    return { message: "заявка одобрена" };
  },
  addCompany: async (data, user) => {
    try {
      data.user = user;
      const longitude = data.longitude;
      const latitude = data.latitude;
      const companyName = data.name;

      // Check for existing company
      const DB = await companyModel.findOne({
        longitude,
        latitude,
        companyName,
      });

      const categoryIf = await companyCategory.findById(data.category);

      async function addCompanyData(data) {
        try {
          const startTime = moment.tz(data.startHour, "HH:mm", process.env.TZ);
          const endTime = moment.tz(data.endHour, "HH:mm", process.env.TZ);

          let company = new companyModel({
            category: mongoose.Types.ObjectId(data.category),
            companyName: companyName,
            web: data.web,
            latitude: data.latitude,
            longitude: data.longitude,
            address: data.address,
            email: data.email,
            startHour: data.startHour,
            endHour: data.endHour,
            days: data.days,
            owner: user,
            isNight: startTime >= endTime,
          });

          await company.save();

          // Save images
          const imageDocs = await Promise.all(
            data.images.map(async (url) => {
              const image = new companyImage({
                url,
                companyId: company._id,
              });
              return image.save();
            })
          );

          // Save phone numbers
          const phoneDocs = await Promise.all(
            data.phoneNumbers.map(async (phoneData) => {
              const phone = new companyPhones({
                number: phoneData.number,
                whatsApp: phoneData.whatsApp,
                telegram: phoneData.telegram,
                companyId: company._id,
              });
              return phone.save();
            })
          );

          // Save services
          const serviceDocs = await Promise.all(
            data.services.map(async (serviceData) => {
              const service = new CompanyServiceModel({
                type: serviceData.type,
                description: serviceData.description,
                cost: serviceData.cost,
                images: serviceData.images,
                companyId: company._id,
              });
              return service.save();
            })
          );

          // Assign references
          company.images = imageDocs.map((img) => img._id);
          company.phoneNumbers = phoneDocs.map((ph) => ph._id);
          company.services = serviceDocs.map((svc) => svc._id);

          await company.save();

          // Update user
          await User.findByIdAndUpdate(user, {
            $set: { company: company._id },
          });

          console.log("Company and related data added successfully!");
          return company;
        } catch (error) {
          console.error("Error adding company data:", error);
          throw error;
        }
      }

      if (!DB && categoryIf) {
        const result = await addCompanyData(data);
        return { message: "company added", company: result };
      }

      return { message: "company exist" };
    } catch (error) {
      console.error("Error in addCompany:", error);
      throw error; // Ensure caller can handle it
    }
  },

  // addCompany: async (data, user) => {
  //   try {
  //     data.user = user;
  //     const longitude = data.longitude;
  //     const latitude = data.latitude;
  //     const companyName = data.name;
  //     const DB = await companyModel.findOne({
  //       longitude,
  //       latitude,
  //       companyName,
  //     });
  //     const categoryIf = await companyCategory.findById(data.category);
  //     async function addCompanyData(data) {
  //       const session = await mongoose.startSession();
  //       session.startTransaction();

  //       try {
  //         const startTime = moment.tz(data.startHour, "HH:mm", process.env.TZ);
  //         const endTime = moment.tz(data.endHour, "HH:mm", process.env.TZ);
  //         let company;
  //         if (startTime < endTime) {
  //           company = new companyModel({
  //             category: mongoose.Types.ObjectId(data.category),
  //             companyName: companyName,
  //             web: data.web,
  //             latitude: data.latitude,
  //             longitude: data.longitude,
  //             address: data.address,
  //             email: data.email,
  //             startHour: data.startHour,
  //             endHour: data.endHour,
  //             days: data.days,
  //             owner: user,
  //             isNight: false,
  //           });
  //         } else {
  //           company = new companyModel({
  //             category: mongoose.Types.ObjectId(data.category),
  //             companyName: companyName,
  //             web: data.web,
  //             latitude: data.latitude,
  //             longitude: data.longitude,
  //             address: data.address,
  //             email: data.email,
  //             startHour: data.startHour,
  //             endHour: data.endHour,
  //             days: data.days,
  //             owner: user,
  //             isNight: true,
  //           });
  //         }
  //         await company.save({ session });

  //         const imagePromises = data.images.map(async (url) => {
  //           const image = new companyImage({
  //             url,
  //             companyId: company._id,
  //           });
  //           return image.save({ session });
  //         });
  //         await User.findByIdAndUpdate(user, {
  //           $set: { company: company._id },
  //         });
  //         const images = await Promise.all(imagePromises);

  //         const phonePromises = data.phoneNumbers.map(async (phoneData) => {
  //           const phone = new companyPhones({
  //             number: phoneData.number,
  //             whatsApp: phoneData.whatsApp,
  //             telegram: phoneData.telegram,
  //             companyId: company._id,
  //           });
  //           return phone.save({ session });
  //         });
  //         const phoneNumbers = await Promise.all(phonePromises);

  //         const servicePromises = data.services.map(async (serviceData) => {
  //           const service = new CompanyServiceModel({
  //             type: serviceData.type,
  //             description: serviceData.description,
  //             cost: serviceData.cost,
  //             images: serviceData.images,
  //             companyId: company._id,
  //           });

  //           return service.save({ session });
  //         });
  //         const services = await Promise.all(servicePromises);

  //         company.images = images.map((image) => image._id);
  //         company.phoneNumbers = phoneNumbers.map((phone) => phone._id);
  //         company.services = services.map((service) => service._id);
  //         // company.comments = comments.map((comment) => comment._id);
  //         // company.likes = likes.map((like) => like._id);

  //         await company.save({ session });

  //         // Commit transaction
  //         await session.commitTransaction();
  //         session.endSession();

  //         console.log("Company and related data added successfully!");

  //         return company;
  //       } catch (error) {
  //         console.error("Error adding company data:", error);
  //         if (session) {
  //           await session.abortTransaction();
  //           session.endSession();
  //         }
  //         throw error;
  //       }
  //     }

  //     if (!DB && categoryIf) {
  //       const resultBaza = await addCompanyData(data);

  //       return { message: "company added", company: resultBaza };
  //     }

  //     return { message: "company exist" };
  //   } catch (error) {
  //     console.error(error);
  //   }
  // },
  addFavorites: async (user, companyId) => {
    try {
      const resFav = await companyFavorit.findOne({ user, companyId });
      if (!resFav) {
        const newFav = new companyFavorit({
          user,
          companyId,
        });
        await newFav.save();
        const company = await companyModel
          .findByIdAndUpdate(
            companyId,
            {
              $push: { favorites: user },
            },
            { new: true }
          )
          .populate("owner");
        await User.findByIdAndUpdate(user, {
          $push: { company_favorites: companyId },
        });

        if (company.owner._id.toString() !== user.toString()) {
          const evLink = `alleven://myCompany/${company._id}`;
          const dataNotif = {
            status: 2,
            date_time: moment.tz(process.env.TZ).format("YYYY-MM-DD HH:mm"),
            user: company.owner._id.toString(),
            type: "like",
            navigate: true,
            message: `У вас новое сообщение.`,
            companyId: company._id,
            link: evLink,
          };
          const nt = new Notification(dataNotif);
          await nt.save();
          if (company.owner.notifEvent) {
            notifEvent.emit(
              "send",
              company.owner._id.toString(),
              JSON.stringify({
                type: "like",
                eventId: company._id,
                navigate: true,
                date_time: moment.tz(process.env.TZ).format("YYYY-MM-DD HH:mm"),
                message: `У вас новое сообщение.`,
                link: evLink,
              })
            );
          }
        }

        return {
          message: "успешно добавлен в список избранных",
          favorites: company.favorites,
        };
      } else {
        await User.findByIdAndUpdate(user, {
          $pull: { company_favorites: companyId },
        });
        const company = await companyModel.findByIdAndUpdate(
          companyId,
          {
            $pull: { favorites: resFav._id },
          },
          { new: true }
        );
        await companyFavorit.findByIdAndDelete(resFav._id);
        return {
          message: "матч успешно удален из списка избранных",
          favorites: company.favorites,
        };
      }
    } catch (error) {
      console.error(error);
      return false;
    }
  },
  // editeCompany: async () => {
  //   try {
  //     return { message: "company update" };
  //   } catch (error) {
  //     console.error(error);
  //   }
  // },
  addService: async (companyId, type, description, cost, images) => {
    try {
      const company = await companyModel.findOne({ _id: companyId });

      const serviceDb = new CompanyServiceModel({
        type,
        companyId,
        description,
        cost,
        images,
      });
      await serviceDb.save();

      company.services.push(serviceDb._id);
      await company.save();

      // await companyServiceMod.save()

      return { message: "service added", data: serviceDb };
    } catch (error) {
      console.error(error);
    }
  },
  // getOne: async (companyId) => {
  //   try {
  //     const Db = await companyModel.find({ _id: companyId });

  //     return { message: "success", company: Db };
  //   } catch (error) {
  //     console.error(error);
  //   }
  // },
  // getMy: async (user) => {
  //   try {
  //     const company = await companyModel.find({ owner: user })
  //       .populate("images")
  //       .populate({ path: "services", populate: { path: "serviceRegister" } })
  //       .populate("phoneNumbers")
  //       .populate("category")
  //       .populate({ path: "owner", select: "-password" })
  //       .populate("likes")
  //       .populate("hotDeals")
  //       .populate("comments");
  //     const myLatitude = 55.7558;
  //     const myLongitude = 37.6176;

  //     company.forEach((company) => {
  //       company.kilometr = calculateDistance(
  //         myLatitude,
  //         myLongitude,
  //         company.latitude,
  //         company.longitude
  //       );
  //     });

  //     company.sort((a, b) => a.kilometr - b.kilometr);

  //     // let pastLikes;
  //     // let pastComment;
  //     // let view;
  //     // let favorites;
  //     // let pastParticipants;
  //     // let countAll = 0;
  //     // for (let i = 0; i < company.length; i++) {
  //     //   pastLikes = company[i].likes.filter((like) => {
  //     //     const parsedGivenDate = moment(like.date);

  //     //     return parsedGivenDate.isAfter(company[i].changedStatusDate);
  //     //   });

  //     //   pastComment = company[i].comments.filter((like) => {
  //     //     const parsedGivenDate = moment(like.date);

  //     //     return parsedGivenDate.isAfter(company[i].changedStatusDate);
  //     //   });

  //     //   view = company[i].view.filter((like) => {
  //     //     const parsedGivenDate = moment(like.date);

  //     //     return parsedGivenDate.isAfter(company[i].changedStatusDate);
  //     //   });

  //     //   favorites = company[i].favorites.filter((like) => {
  //     //     const parsedGivenDate = moment(like.date);

  //     //     return parsedGivenDate.isAfter(company[i].changedStatusDate);
  //     //   });

  //     //   pastParticipants = company[i].participants.filter((like) => {
  //     //     const parsedGivenDate = moment(like.date);

  //     //     return parsedGivenDate.isAfter(resDb[i].changedStatusDate);
  //     //   });

  //     //   let count =
  //     //     pastLikes.length +
  //     //     pastComment.length +
  //     //     view.length +
  //     //     pastParticipants.length +
  //     //     favorites.length;
  //     //   countAll = countAll + count;
  //     //   if (favorites.length) {
  //     //     company[i].changes.favorites = true;
  //     //   }
  //     //   if (pastLikes.length) {
  //     //     company[i].changes.like = true;
  //     //   }
  //     //   if (pastComment.length) {
  //     //     company[i].changes.comment = true;
  //     //   }
  //     //   if (pastParticipants.length) {
  //     //     company[i].changes.participant = true;
  //     //   }
  //     //   if (view.length) {
  //     //     company[i].changes.view = true;
  //     //   }
  //     //   if (count) {
  //     //     company[i].changes.count = count;
  //     //   }
  //     //   await resDb[i].save();
  //     // }
  //     // const dateChange=await companyModel.find({ owner: user });
  //     //  setTimeout(async () => {
  //     //   for (let x = 0; x < dateChange.length; x++) {
  //     //     dateChange[x].changes.comment = false;
  //     //     dateChange[x].changes.like = false;
  //     //     dateChange[x].changes.participant = false;
  //     //     dateChange[x].changes.view = false;
  //     //     dateChange[x].changes.favorites = false;
  //     //     dateChange[x].changes.count = 0;
  //     //     dateChange[x].changedStatusDate = moment.tz(process.env.TZ).format();
  //     //     await dateChange[x].save();
  //     //   }
  //     // })

  //     return company;
  //   } catch (error) {
  //     console.error(error);
  //   }
  // },
};

export default companyService;
