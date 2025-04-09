import companyCategory from "../../../models/company/companyCategory.js";
import calendar from "../../../public/calendar/calendar.js";
import companyService from "../../../services/CompanyService.js";
import Company from "../../../models/company/companyModel.js";
import notifEvent from "../../../events/NotificationEvent.js";
import companyServiceDb from "../../../models/company/companyService.js";
import Role from "../../../models/Role.js";
import Notification from "../../../models/Notification.js";
import User from "../../../models/User.js";
import moment from "moment-timezone";
import jwt from "jsonwebtoken";
import companyLikes from "../../../models/company/companyLikes.js";
import companyComment from "../../../models/company/companyComment.js";
import CompanyFavorites from "../../../models/company/companyFavorit.js";
import companyModel from "../../../models/company/companyModel.js";
import companyFavorit from "../../../models/company/companyFavorit.js";
import companyRating from "../../../models/company/companyRating.js";
import servicesRegistrations from "../../../models/services/servicesRegistrations.js";
import companyView from "../../../models/company/companyView.js";
import companyImage from "../../../models/company/companyImage.js";
import companyImpressionImages from "../../../models/company/companyImpressionImages.js";
import companyCommentAnswerLike from "../../../models/company/companyCommentAnswerLike.js";
import companyCommentLike from "../../../models/company/companyCommentLike.js";
import companyCommentAnswer from "../../../models/company/companyCommentAnswer.js";
import companyHotDeals from "../../../models/company/companyHotDeals.js";
import companyPhones from "../../../models/company/companyPhones.js";
import ImpressionsCompany from "../../../models/ImpressionsCompany.js";
// import companyPays from "../../../models/company/companyPays.js";
import commission from "../../../models/commission.js";
import paysStore from "../../../models/paysStore.js";
import CompanyServiceModel from "../../../models/company/companyService.js";
import companyHotDealRegistration from "../../../models/company/companyHotDealRegistration.js";
import Report from "../../../models/Report.js";
import companyParticipants from "../../../models/company/companyParticipants.js";
import calculateAverageRating from "../../../helper/ratingCalculate.js";
import calculateDistance from "../../../helper/distanceCalculate.js";

const companyController = {
  deleteServiceImage: async (req, res) => {
    try {
      await CompanyServiceModel.findByIdAndUpdate(req.params.id, {
        $pull: { images: req.query.path },
      });
      res.status(200).send({ message: "success" });
    } catch (error) {
      console.error(error);
      res.status(200).send({ message: "Server Error" });
    }
  },
  priceEdit: async (req, res) => {
    try {
      const price = req.body.price;

      const id = req.params.id;
      const priceDb = await commission.findById(id);
      if (!price) {
        res.render("profile/commission", {
          layout: "profile",
          title: "Company Pays",
          user: req.user,
          event: priceDb,
        });
      } else {
        const priceUpdate = await commission.findByIdAndUpdate(
          id,
          { $set: { price } },
          { new: true }
        );
        res.render("profile/commission", {
          layout: "profile",
          title: "Company Pays",
          user: req.user,
          event: priceUpdate,
        });
      }
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Server Error" });
    }
  },
  pricePage: async (req, res) => {
    try {
      const price = await commission.find();
      res.render("profile/commission", {
        layout: "profile",
        title: "Company Pays",
        user: req.user,
        event: price[0],
      });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Server Error" });
    }
  },
  pays: async (req, res) => {
    try {
      //   const event = await companyModel
      //   .findById(req.params.id)
      //   .populate("images")
      //   .populate("services")
      //   .populate("phoneNumbers")
      //   .populate("category")
      //   .populate({ path: "owner", select: "-password" })
      //   .populate("likes")
      //   .populate("comments");
      // // const user=await User.findById(event.owner)
      // const comments = await companyComment
      //   .find({ companyId: event._id, user: event.owner })
      //   .populate({ path: "user", select: "-password" });

      // res.render("profile/company-show", {
      //   layout: "profile",
      //   title: "Company Show",
      //   user: req.user,
      //   event,
      //   eventCat: event.category,
      //   // eventCats,
      //   services: event.services,
      //   images: event.images,
      //   phone_numbers: event.phoneNumbers,
      //   userOwner: event.owner,
      //   comments: comments,
      // });
      const { id } = req.params;
      const events = await paysStore.find({ companyId: id, status: 1 });
      const deals = await companyHotDealRegistration
        .find({ companyId: id, pay: true })
        .populate("companyId")
        .populate("user");
      for (let i = 0; i < deals.length; i++) {
        let obj = {};
        obj.name = deals[i].user.name;
        obj.surname = deals[i].user.surname;
        obj.companyName = deals[i].companyId.companyName;
        obj.date = deals[i].date;
        events.push(obj);
      }
      events.sort((a, b) => new Date(b.date) - new Date(a.date));
      res.render("profile/company-pays", {
        layout: "profile",
        title: "Company Pays",
        user: req.user,
        events,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Server error" });
    }
  },
  myImpressions: async (req, res) => {
    const authHeader = req.headers.authorization;
    const token = authHeader.split(" ")[1];
    const user = jwt.decode(token);

    const likes = await companyLikes.find({ user: user.id }).populate({
      path: "companyId",
      select:
        "_id companyName address images likes favorites ratingCalculated view services category",
      populate: { path: "images category" },
    });
    const likeResult = [];
    const favoritesResult = [];
    const impressionResult = [];
    if (likes.length) {
      for (let i = 0; i < likes.length; i++) {
        const like = likes[i];
        const obj = {};
        const rating = await companyRating.findOne({
          user: user.id,
          companyId: like.companyId._id,
        });
        // const comments=await companyComment.find({user:user.id,companyId:like.companyId._id})
        const ifFavorit = await companyFavorit.findOne({
          user: user.id,
          companyId: like.companyId._id,
        });
        obj.isFavorite = false;

        if (ifFavorit) {
          obj.isFavorite = true;
        } else {
          obj.isFavorite = false;
        }

        const ifLike = await companyLikes.findOne({
          user: user.id,
          companyId: like.companyId._id,
        });
        obj.isLike = false;

        if (ifLike) {
          obj.isLike = true;
        } else {
          obj.isLike = false;
        }

        obj.name = like.companyId.companyName;
        obj.address = like.companyId.address;
        if (rating) {
          obj.rating = rating.rating;
        } else {
          obj.rating = null;
        }
        // if(comments.length){
        //   obj.comments=comments
        // }else{
        //   obj.comments=null
        // }
        obj._id = like.companyId._id;

        obj.url = like.companyId.images[0].url;
        obj.likes = like.companyId.likes.length;
        obj.favorites = like.companyId.favorites.length;
        obj.rating = like.companyId.ratingCalculated;
        obj.views = like.companyId.view.length;
        let count = 0;
        let regLatests = [];
        for (let z = 0; z < like.companyId.services.length; z++) {
          const service = like.companyId.services[z];
          const registers = await servicesRegistrations.find({
            serviceId: service,
          });
          count = count + registers.length;
          const latestRegistration = await servicesRegistrations
            .findOne({ user: user.id, serviceId: service })
            .sort({ createdAt: -1 }); // Sort by createdAt in descending order
          if (latestRegistration) {
            regLatests.push(latestRegistration);
          }
        }
        obj.date = null;
        if (regLatests.length) {
          regLatests.sort((a, b) => new Date(b.date) - new Date(a.date));
          obj.date = regLatests[0].date;
        }

        obj.participants = count;
        obj.category = like.companyId.category.name;

        likeResult.push(obj);
      }
    }

    const favorites = await companyFavorit.find({ user: user.id }).populate({
      path: "companyId",
      select:
        "_id companyName address images likes favorites ratingCalculated view services category",
      populate: { path: "images category" },
    });
    if (favorites.length) {
      for (let i = 0; i < favorites.length; i++) {
        const favorite = favorites[i];
        const obj = {};
        const rating = await companyRating.findOne({
          user: user.id,
          companyId: favorite.companyId._id,
        });
        const ifFavorit = await companyFavorit.findOne({
          user: user.id,
          companyId: favorite.companyId._id,
        });
        obj.isFavorite = false;

        if (ifFavorit) {
          obj.isFavorite = true;
        } else {
          obj.isFavorite = false;
        }

        const ifLike = await companyLikes.findOne({
          user: user.id,
          companyId: favorite.companyId._id,
        });
        obj.isLike = false;

        if (ifLike) {
          obj.isLike = true;
        } else {
          obj.isLike = false;
        }
        obj._id = favorite.companyId._id;

        obj.name = favorite.companyId.companyName;
        obj.address = favorite.companyId.address;
        if (rating) {
          obj.rating = rating.rating;
        } else {
          obj.rating = null;
        }
        let count = 0;
        let regLatests = [];
        for (let z = 0; z < favorite.companyId.services.length; z++) {
          const service = favorite.companyId.services[z];
          const registers = await servicesRegistrations.find({
            serviceId: service,
          });
          count = count + registers.length;
          const latestRegistration = await servicesRegistrations
            .findOne({ user: user.id, serviceId: service })
            .sort({ createdAt: -1 }); // Sort by createdAt in descending order
          if (latestRegistration) {
            regLatests.push(latestRegistration);
          }
        }
        obj.participants = count;
        obj.url = favorite.companyId.images[0].name;
        obj.likes = favorite.companyId.likes.length;
        obj.favorites = favorite.companyId.favorites.length;
        obj.rating = favorite.companyId.ratingCalculated;
        obj.views = favorite.companyId.view.length;
        obj.category = favorite.companyId.category.name;
        obj.date = null;
        if (regLatests.length) {
          regLatests.sort((a, b) => new Date(b.date) - new Date(a.date));
          obj.date = regLatests[0].date;
        }

        favoritesResult.push(obj);
      }
    }

    const impressions = await companyImpressionImages
      .find({ user: user.id })
      .populate({
        path: "companyId",
        select:
          "_id companyName address images likes favorites ratingCalculated view services category",
        populate: { path: "images category" },
      });
    if (impressions.length) {
      for (let i = 0; i < impressions.length; i++) {
        const impression = impressions[i];
        const obj = {};
        const rating = await companyRating.findOne({
          user: user.id,
          companyId: impression.companyId._id,
        });
        const comments = await companyComment.find({
          user: user.id,
          companyId: impression.companyId._id,
        });

        const ifFavorit = await companyFavorit.findOne({
          user: user.id,
          companyId: impression.companyId._id,
        });
        obj.isFavorite = false;

        if (ifFavorit) {
          obj.isFavorite = true;
        } else {
          obj.isFavorite = false;
        }

        const ifLike = await companyLikes.findOne({
          user: user.id,
          companyId: impression.companyId._id,
        });
        obj.isLike = false;

        if (ifLike) {
          obj.isLike = true;
        } else {
          obj.isLike = false;
        }

        obj._id = impression.companyId._id;

        obj.name = impression.companyId.companyName;
        obj.address = impression.companyId.address;
        if (rating) {
          obj.rating = rating.rating;
        } else {
          obj.rating = null;
        }
        if (comments.length) {
          obj.comments = comments;
        } else {
          obj.comments = null;
        }
        obj.url = impression.companyId.images[0].name;
        obj.path = impression.path;
        obj.likes = impression.companyId.likes.length;
        obj.favorites = impression.companyId.favorites.length;
        obj.rating = impression.companyId.ratingCalculated;
        obj.views = impression.companyId.view.length;

        let count = 0;
        let regLatests = [];
        for (let z = 0; z < impression.companyId.services.length; z++) {
          const service = impression.companyId.services[z];
          const registers = await servicesRegistrations.find({
            serviceId: service,
          });
          count = count + registers.length;
          const latestRegistration = await servicesRegistrations
            .findOne({ user: user.id, serviceId: service })
            .sort({ createdAt: -1 }); // Sort by createdAt in descending order
          if (latestRegistration) {
            regLatests.push(latestRegistration);
          }
        }
        obj.participants = count;
        obj.category = impression.companyId.category.name;
        obj.date = null;
        if (regLatests.length) {
          regLatests.sort((a, b) => new Date(b.date) - new Date(a.date));
          obj.date = regLatests[0].date;
        }
        // obj.participants=impression.companyId.participants.length

        impressionResult.push(obj);
      }
    }

    res.status(200).send({
      message: "success",
      likes: likeResult,
      favorites: favoritesResult,
      impressions: impressionResult,
    });
  },
  myCompanyImpressions: async (req, res) => {
    const authHeader = req.headers.authorization;
    const token = authHeader.split(" ")[1];
    const user = jwt.decode(token);
    const company = await Company.findOne({ owner: user.id }).populate(
      "images"
    );
    if (company) {
      const impressions = await ImpressionsCompany.find({
        company: company._id,
      });
      res.status(200).send({ message: "success", impressions });
    } else {
      res.status(200).send({ message: "success", impressions: [] });
    }
  },
  myparticipant: async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      const token = authHeader.split(" ")[1];
      const user = jwt.decode(token);
      const { latitude, longitude } = req.query;
      const result = await companyService.myparticipant(
        user.id,
        latitude,
        longitude
      );
      res.status(200).send(result);
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Server error" });
    }
  },
  getHotDeals: async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      let result;
      const { latitude, longitude } = req.query;
      if (authHeader && latitude && longitude) {
        const token = authHeader.split(" ")[1];
        const user = jwt.decode(token);
        result = await companyHotDeals
          .find({ user: { $ne: user.id }, free: true })
          .populate({
            path: "companyId",
            select:
              "companyName ratingCalculated address images kilometr latitude longitude open startHour endHour category",
            populate: {
              path: "images category", // The field within `companyId` to populate
            },
          });

        result.forEach((company) => {
          company.companyId.kilometr = calculateDistance(
            latitude,
            longitude,
            company.latitude,
            company.longitude
          );
        });
        result.sort((a, b) => a.kilometr - b.kilometr);
        for (let z = 0; z < result.length; z++) {
          // const hours = moment.tz(process.env.TZ).format("HH:mm");
          // const splitOpen = result[z].companyId.startHour.split(":");
          // const splitClose = result[z].companyId.endHour.split(":");

          // if (
          //   Number(hours) >= Number(splitOpen[0]) &&
          //   Number(hours) < Number(splitClose[0])
          // ) {
          //   result[z].open = true;
          // }
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

            return (
              currentMinutes >= startMinutes && currentMinutes < closeMinutes
            );
          }

          const openBool = isCompanyOpen(
            result[z].companyId.startHour,
            result[z].companyId.endHour,
            hours
          );
          result[z].open = openBool;
        }
      } else if (latitude && longitude && !authHeader) {
        result = await companyHotDeals.find({ free: true }).populate({
          path: "companyId",
          select:
            "companyName ratingCalculated address images kilometr latitude longitude open startHour endHour category",
          populate: {
            path: "images category", // The field within `companyId` to populate
          },
          // populate: {
          //   path: "category",
          // }
        });

        result.forEach((company) => {
          company.companyId.kilometr = calculateDistance(
            latitude,
            longitude,
            company.latitude,
            company.longitude
          );
        });
        result.sort((a, b) => a.kilometr - b.kilometr);
        for (let z = 0; z < result.length; z++) {
          // const hours = moment.tz(process.env.TZ).format("HH:mm");
          // const splitOpen = result[z].companyId.startHour.split(":");
          // const splitClose = result[z].companyId.endHour.split(":");

          // if (
          //   Number(hours) >= Number(splitOpen[0]) &&
          //   Number(hours) < Number(splitClose[0])
          // ) {
          //   result[z].companyId.open = true;
          // }
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

            return (
              currentMinutes >= startMinutes && currentMinutes < closeMinutes
            );
          }

          const openBool = isCompanyOpen(
            result[z].companyId.startHour,
            result[z].companyId.endHour,
            hours
          );
          result[z].open = openBool;
        }
      } else if (authHeader && !latitude && !longitude) {
        const token = authHeader.split(" ")[1];
        const user = jwt.decode(token);
        result = await companyHotDeals
          .find({ user: { $ne: user.id }, free: true })
          .populate({
            path: "companyId",
            select:
              "companyName ratingCalculated address images kilometr latitude longitude open startHour endHour category",
            populate: {
              path: "images category", // The field within `companyId` to populate
            },
            // populate: {
            //   path: "category",
            // }
          });

        const myLatitude = 55.7558;
        const myLongitude = 37.6173;
        result.forEach((company) => {
          company.companyId.kilometr = calculateDistance(
            myLatitude,
            myLongitude,
            company.latitude,
            company.longitude
          );
        });
        result.sort((a, b) => a.kilometr - b.kilometr);
        for (let z = 0; z < result.length; z++) {
          // const hours = moment.tz(process.env.TZ).format("HH:mm");
          // const splitOpen = result[z].companyId.startHour.split(":");
          // const splitClose = result[z].companyId.endHour.split(":");

          // if (
          //   Number(hours) >= Number(splitOpen[0]) &&
          //   Number(hours) < Number(splitClose[0])
          // ) {
          //   result[z].open = true;
          // }
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

            return (
              currentMinutes >= startMinutes && currentMinutes < closeMinutes
            );
          }

          const openBool = isCompanyOpen(
            result[z].companyId.startHour,
            result[z].companyId.endHour,
            hours
          );
          result[z].open = openBool;
        }
      } else {
        result = await companyHotDeals.find({ free: true }).populate({
          path: "companyId",
          select:
            "companyName ratingCalculated address images kilometr latitude longitude open startHour endHour category",
          populate: {
            path: "images category", // The field within `companyId` to populate
          },
          // populate: {
          //   path: "category",
          // }
        });

        const myLatitude = 55.7558;
        const myLongitude = 37.6173;
        result.forEach((company) => {
          company.companyId.kilometr = calculateDistance(
            myLatitude,
            myLongitude,
            company.latitude,
            company.longitude
          );
        });
        result.sort((a, b) => a.kilometr - b.kilometr);
        for (let z = 0; z < result.length; z++) {
          // const hours = moment.tz(process.env.TZ).format("HH:mm");
          // const splitOpen = result[z].companyId.startHour.split(":");
          // const splitClose = result[z].companyId.endHour.split(":");

          // if (
          //   Number(hours) >= Number(splitOpen[0]) &&
          //   Number(hours) < Number(splitClose[0])
          // ) {
          //   result[z].open = true;
          // }
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

            return (
              currentMinutes >= startMinutes && currentMinutes < closeMinutes
            );
          }

          const openBool = isCompanyOpen(
            result[z].companyId.startHour,
            result[z].companyId.endHour,
            hours
          );
          result[z].open = openBool;
        }
      }

      const upcomingDeals = result.filter((el) => {
        return moment
          .tz(el.date, "YYYY-MM-DD HH:mm", process.env.TZ)
          .isAfter(moment.tz(process.env.TZ).format("YYYY-MM-DD HH:mm"));
      });

      res.status(200).send({ message: "success", data: upcomingDeals });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Server error" });
    }
  },
  // dealsRegisters: async (req, res) => {
  //   const { id } = req.params;
  //   const result = await companyService.dealsRegisters(id);
  //   res.status(200).send({message:"success",data:result});
  // },
  serviceUpdate: async (req, res) => {
    try {
      const { id, data } = req.body;
      const result = await companyService.serviceUpdate(id, data);
      res.status(200).send(result);
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Server error" });
    }
  },
  deatRegister: async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      const token = authHeader.split(" ")[1];
      const user = jwt.decode(token);
      const { dealId } = req.body;
      const result = await companyService.deatRegister(dealId, user.id);
      res.status(200).send(result);
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Server error" });
    }
  },
  addHotDeals: async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      // if(authHeader){
      const token = authHeader.split(" ")[1];
      const user = jwt.decode(token);
      const { companyId, description, cost, date } = req.body;

      const result = await companyService.addHotDeals(
        companyId,
        description,
        cost,
        date,
        user.id
      );
      res.status(200).send(result);
      // }else{
      //   res.status(400).send({message:"Authorization error"});
      // }
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Server error" });
    }
  },
  companyEdit: async (req, res) => {
    try {
      const data = req.body;

      const result = await companyService.companyEdit(data);
      if (result) {
        res.status(200).send(result);
      } else {
        res.status(400).send({ message: "Company not found" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Server error" });
    }
  },
  impressionImagesStore: async (req, res) => {
    const authHeader = req.headers.authorization;
    const token = authHeader.split(" ")[1];
    const user = jwt.decode(token);
    const { id, path } = req.body;
    const result = await companyService.impressionImagesStore(
      id,
      path,
      user.id
    );

    const data = await companyImpressionImages
      .findById(result._id)
      .populate({ path: "user", select: "name surname avatar" });

    const ifImpressions = await ImpressionsCompany.findOne({
      company: id,
      user: user.id,
    });
    const date = moment.tz(process.env.TZ).format("YYYY-MM-DD HH:mm");
    const userDb = await User.findById(user.id);
    const companyDb = await Company.findById(id)
      .populate("images")
      .populate("category");
    if (ifImpressions) {
      for (let i = 0; i < path.length; i++) {
        await ImpressionsCompany.findByIdAndUpdate(ifImpressions._id, {
          $push: { images: path[i] },
          $set: { date },
        });
      }
    } else {
      const companyImpression = new ImpressionsCompany({
        rating,
        comments: [],
        images: path,
        name: userDb.name,
        surname: userDb.surname,
        avatar: userDb.avatar,
        companyName: companyDb.companyName,
        companyImage: companyDb.images[0].name,
        companyCategory: companyDb.category.name,
        company: companyDb._id,
        user: user.id,
        date,
      });
      await companyImpression.save();
    }

    return res
      .status(200)
      .send({ updated: result.bool, success: true, data: result.result });
  },
  deleteService: async (req, res) => {
    const serviceId = req.params.id;
    const result = await companyService.deleteService(serviceId);
    return res.status(200).send(result);
  },
  destroyCompanyImage: async (req, res) => {
    const result = await companyService.destroyCompanyImage(req.params.id);
    return res.status(200).send(result);
  },
  addImage: async (req, res) => {
    const { id, path } = req.body;
    const result = await companyService.addImage(id, path);
    return res.status(200).send(result);
  },
  destroyCompany: async (req, res) => {
    const des_events = req.body.des_events;
    let event = await companyService.destroyCompany(des_events);
    return res.redirect("back");
  },
  companyShow: async (req, res) => {
    const event = await companyModel
      .findById(req.params.id)
      .populate("images")
      .populate("services")
      .populate("phoneNumbers")
      .populate("category")
      .populate({ path: "owner", select: "-password" })
      .populate("likes")
      .populate("comments");
    // const user=await User.findById(event.owner)
    const comments = await companyComment
      .find({ companyId: event._id, user: event.owner })
      .populate({ path: "user", select: "-password" });

    res.render("profile/company-show", {
      layout: "profile",
      title: "Company Show",
      user: req.user,
      event,
      eventCat: event.category,
      // eventCats,
      services: event.services,
      images: event.images,
      phone_numbers: event.phoneNumbers,
      userOwner: event.owner,
      comments: comments,
    });
    // res.render("profile/company-show", {
    //   layout: "profile",
    //   title: "Company View",
    //   user: req.user,
    //   event,
    //   q: req.query,
    // });
  },
  singleCompany: async (req, res) => {
    let template = "profile/company-single";
    let event = await companyModel
      .findById(req.params.id)
      .populate("images")
      .populate("services")
      .populate("phoneNumbers");

    const services = await companyServiceDb.find({ companyId: event._id });
    let registr = 0;
    for (let i = 0; i < services.length; i++) {
      const serviceRegistr = await servicesRegistrations.find({
        serviceId: services[i]._id,
      });
      registr = registr + serviceRegistr.length;
    }
    let eventCat = await companyCategory.findById(event.category);
    const user = await User.findById(event.owner);
    const favorite = await companyFavorit.find({ companyId: req.params.id });
    // let eventCats= await companyCategory.find()
    if (event.status && event.status != 0 && event.status != 1) {
      template += "-rejected";
    }

    res.render(template, {
      layout: "profile",
      title: "Company Single",
      user: req.user,
      userOwner: user,
      event,
      eventCat,
      // eventCats,
      services: event.services,
      images: event.images,
      phone_numbers: event.phoneNumbers,
      favorite: favorite.length,
      likes: event.likes.length,
      registr,
      statusMessage: event.rejectMessage,
      participants: event.participants.length,
      views: event.view.length,
      favorits: event.favorites.length,
      rejectMessage: event.rejectMessage,
    });
  },
  commentDelete: async (req, res) => {
    try {
      const { id } = req.body;
      const result = await companyService.commentDelete(id);
      res.status(200).send(result);
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Server error" });
    }
  },
  commentAnswerDelete: async (req, res) => {
    try {
      const { id } = req.body;
      const result = await companyService.commentAnswerDelete(id);
      res.status(200).send(result);
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Server error" });
    }
  },
  OnlineReject: async (req, res) => {
    try {
      const id = req.params.id;
      let status = req.body.status;
      const event = await companyService.onlineReject(id, status);
      let template = "profile/companyPay-single-rejected";
      let participants = 0;
      event.services.forEach((el) => {
        participants = participants + el.serviceRegister.length;
      });

      res.render(template, {
        layout: "profile",
        title: "Company Show",
        user: req.user,
        userOwner: event.owner,
        event: event,
        services: event.services,
        images: event.images,
        phone_numbers: event.phoneNumbers,
        eventCat: event.category.name,
        onlineReason: event.onlineReason,
        favorites: event.favorites.length,
        views: event.view.length,
        likes: event.likes.length,
        participants,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Server error" });
    }
  },
  OnlineResolve: async (req, res) => {
    try {
      const id = req.params.id;
      const result = await companyService.onlineResolve(id);
      let template = "profile/companyPay-single";
      const dbCompany = await Company.findByIdAndUpdate(
        id,
        { onlinePay: 2 },
        { new: true }
      )
        .populate("images")
        .populate("services")
        .populate("phoneNumbers")
        .populate({ path: "owner", select: "-password" });

      const user = await User.findById(dbCompany.owner);
      const eventCat = await companyCategory.findById(dbCompany.category);
      const evLink = `alleven://myCompany/${dbCompany._id}`;

      const dataNotif = {
        status: 2,
        date_time: moment.tz(process.env.TZ).format("YYYY-MM-DD HH:mm"),
        user: dbCompany.owner._id.toString(),
        type: "Онлайн оплата",
        message: `Онлайн бронирование ваших услуг подключено.`,
        navigate: true,
        companyId: dbCompany._id,
        categoryIcon: eventCat.avatar,
        link: evLink,
      };
      const nt = new Notification(dataNotif);
      await nt.save();
      notifEvent.emit(
        "send",
        dbCompany.owner._id.toString(),
        JSON.stringify({
          type: "Онлайн оплата",
          status: 2,
          date_time: moment.tz(process.env.TZ).format("YYYY-MM-DD HH:mm"),
          user: dbCompany.owner._id.toString(),
          message: `Онлайн бронирование ваших услуг подключено.`,
          companyId: dbCompany._id,
          navigate: true,
          categoryIcon: eventCat.avatar,
          link: evLink,
        })
      );
      res.render(template, {
        layout: "profile",
        title: "Company Show",
        user: req.user,
        userOwner: dbCompany.owner,
        event: dbCompany,
        services: dbCompany.services,
        images: dbCompany.images,
        phone_numbers: dbCompany.phoneNumbers,
        eventCat,
        onlinePay: dbCompany.onlinePay,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Server error" });
    }
  },
  OnlineSingleCompany: async (req, res) => {
    try {
      let template = "profile/companyPay-single";
      let event = await companyModel
        .findById(req.params.id)
        .populate("images")
        .populate("services")
        .populate("phoneNumbers");
      const services = await companyServiceDb.find({ companyId: event._id });
      let registr = 0;
      for (let i = 0; i < services.length; i++) {
        const serviceRegistr = await servicesRegistrations.find({
          serviceId: services[i]._id,
        });
        registr = registr + serviceRegistr.length;
      }
      let eventCat = await companyCategory.findById(event.category);
      const user = await User.findById(event.owner);
      const favorite = await companyFavorit.find({ companyId: req.params.id });
      if (event.onlinePay == 3) {
        template += "-rejected";
      }

      res.render(template, {
        layout: "profile",
        title: "Company Single",
        user: req.user,
        userOwner: user,
        event,
        eventCat,
        services: event.services,
        images: event.images,
        phone_numbers: event.phoneNumbers,
        favorite: favorite.length,
        favorites: event.favorites.length,
        likes: event.likes.length,
        registr,
        statusMessage: event.rejectMessage,
        onlineReason: event.onlineReason,
        onlinePay: event.onlinePay,
        views: event.view.length,
        participants: event.participants.length,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Server error" });
    }
  },
  // singlePay: async (req, res) => {
  //   try {
  //     let template = "profile/company-single-pay";
  //     let event = await companyModel.findById(req.params.id).populate("images").populate("services").populate("phoneNumbers");
  //     const services=await companyServiceDb.find({companyId:event._id})
  //     let registr=0;
  //     for(let i=0;i<services.length;i++){
  //       const serviceRegistr=await servicesRegistrations.find({serviceId:services[i]._id})
  //       registr=registr+serviceRegistr.length
  //     }
  //     let eventCat = await companyCategory.findById(event.category);
  //     const user=await User.findById(event.owner)
  //     const favorite=await companyFavorit.find({companyId:req.params.id})
  //     // let eventCats= await companyCategory.find()
  //     if (event.status && event.status != 0 && event.status != 1) {
  //       template += "-rejected";
  //     }

  //     res.render(template, {
  //       layout: "profile",
  //       title: "Company Single",
  //       user:req.user,
  //       userOwner:user,
  //       event,
  //       eventCat,
  //       // eventCats,
  //       services:event.services,
  //       images:event.images,
  //       phone_numbers:event.phoneNumbers,
  //       favorite:favorite.length,
  //       likes:event.likes.length,
  //       registr,
  //       statusMessage:event.rejectMessage
  //     });
  //   } catch (error) {
  //     console.error(error);
  //     res.status(500).json({ message: "Server error" });
  //   }
  // },
  onlinePage: async (req, res) => {
    try {
      const { name, category, date_from } = req.query;
      let params = {};
      let events;
      if (name) {
        params.name = name;
        events = await Company.find({
          companyName: name,
          onlinePay: { $ne: 0 },
        })
          .populate({ path: "owner", select: "-password" })
          .populate("images")
          .populate("phoneNumbers")
          .populate("services")
          .populate("likes")
          .populate("category");
      }

      if (category) {
        const eventCats = await companyCategory.findById(category);
        params.category = category;
        events = await Company.find({
          category: eventCats._id,
          onlinePay: { $ne: 0 },
        })
          .populate({ path: "owner", select: "-password" })
          .populate("images")
          .populate("phoneNumbers")
          .populate("services")
          .populate("likes")
          .populate("category");
      }

      if (!category && !name) {
        events = await Company.find({ onlinePay: { $ne: 0 } })
          .populate({ path: "owner", select: "-password" })
          .populate("images")
          .populate("phoneNumbers")
          .populate("services")
          .populate("likes")
          .populate("category");
      }

      // if (date_from) {
      //   params.started_time = {
      //     $gte: new Date(date_from).toISOString(),
      //   };
      // }

      const eventCats = await companyCategory.find();
      events.reverse();

      res.render("profile/companyPay", {
        layout: "profile",
        title: "Company",
        user: req.user,
        events,
        eventCats,
        q: req.query,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Server Error" });
    }
  },
  online: async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      const token = authHeader.split(" ")[1];
      const user = jwt.decode(token);
      const { id } = req.body;

      const companyDb = await Company.findById(id);
      let company;
      if (companyDb.onlinePay == 0 || companyDb.onlinePay == 3) {
        company = await Company.findByIdAndUpdate(
          id,
          { onlinePay: 1 },
          { new: true }
        );
      } else if (companyDb.onlinePay == 2) {
        company = await Company.findByIdAndUpdate(
          id,
          { onlinePay: 0 },
          { new: true }
        );
      }

      const evLink = `alleven://myCompany/${company._id}`;

      notifEvent.emit(
        "send",
        "ADMIN",
        JSON.stringify({
          type: "Онлайн оплата",
          message: "event",
          data: company,
        })
      );
      res
        .status(200)
        .send({ message: "success", onlinePay: company.onlinePay });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Server Error" });
    }
  },
  commentAnswerLike: async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      const token = authHeader.split(" ")[1];
      const user = jwt.decode(token);
      const { answerId } = req.body;
      const result = await companyService.commentAnswerLike(answerId, user.id);
      if (result) {
        res.status(200).send(result);
      } else {
        res.status(401).send({
          message: "error",
        });
      }
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Server Error" });
    }
  },
  commentAnswer: async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      const token = authHeader.split(" ")[1];
      const user = jwt.decode(token);
      const { commentId, text } = req.body;

      const result = await companyService.commentAnswer(
        commentId,
        user.id,
        text
      );
      if (result) {
        const answer = await companyCommentAnswer
          .findById(result._id)
          .populate({ path: "user", select: "name surname avatar" });
        res.status(200).send({ success: true, answer });
      } else {
        res.status(401).send({
          success: false,
          message: "error",
        });
      }
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Server Error" });
    }
  },
  commentLike: async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      const token = authHeader.split(" ")[1];
      const user = jwt.decode(token);
      const { commentId } = req.body;
      const result = await companyService.commentLike(commentId, user.id);
      if (result) {
        res.status(200).send(result);
      } else {
        res.status(401).send({
          message: "error",
        });
      }
    } catch (error) {
      console.error(error);
      res.status(500).send({
        message: "Server Error",
      });
    }
  },
  rating: async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      const token = authHeader.split(" ")[1];
      const user = jwt.decode(token);
      const { id, rating } = req.body;

      const result = await companyService.rating(id, user.id, rating);
      const ifImpressions = await ImpressionsCompany.findOne({
        company: id,
        user: user.id,
      });
      const date = moment.tz(process.env.TZ).format("YYYY-MM-DD HH:mm");
      const userDb = await User.findById(user.id);
      const companyDb = await Company.findById(id)
        .populate("images")
        .populate("category");
      if (ifImpressions) {
        await ImpressionsCompany.findByIdAndUpdate(ifImpressions._id, {
          $set: { date, rating },
        });
      } else {
        const companyImpression = new ImpressionsCompany({
          rating,
          comments: [],
          images: [],
          name: userDb.name,
          surname: userDb.surname,
          avatar: userDb.avatar,
          companyName: companyDb.companyName,
          companyImage: companyDb.images[0].name,
          company: companyDb._id,
          companyCategory: companyDb.category.name,
          user: user.id,
          date,
        });
        await companyImpression.save();
      }
      if (result) {
        res.status(200).send(result);
      } else {
        res.status(401).send({
          message: "error",
        });
      }
    } catch (error) {
      console.error(error);
      res.status(500).send({
        message: "Server Error",
      });
    }
  },
  reject: async (req, res) => {
    try {
      const id = req.params.id;
      let status = req.body.status;
      const event = await companyService.reject(id, status);

      let template = "profile/company-single-rejected";
      let participants = event.participants.length;

      res.render(template, {
        layout: "profile",
        title: "Company Show",
        user: req.user,
        userOwner: event.owner,
        event: event,
        services: event.services,
        images: event.images,
        phone_numbers: event.phoneNumbers,
        eventCat: event.category.name,
        participants,
        likes: event.likes.length,
        views: event.view.length,
        favorits: event.favorites.length,
        rejectMessage: event.rejectMessage,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Server Error" });
    }
  },
  resolve: async (req, res) => {
    try {
      const id = req.params.id;
      const result = await companyService.resolve(id);
      let template = "profile/company-single";
      const dbCompany = await Company.findByIdAndUpdate(id)
        .populate("images")
        .populate("services")
        .populate("phoneNumbers")
        .populate({ path: "owner", select: "-password" })
        .populate("category");
      const user = await User.findById(dbCompany.owner);
      const eventCat = await companyCategory.findById(dbCompany.category);

      const evLink = `alleven://myCompany/${dbCompany._id}`;

      const dataNotif = {
        status: 2,
        date_time: moment.tz(process.env.TZ).format("YYYY-MM-DD HH:mm"),
        user: dbCompany.owner._id.toString(),
        type: "Новая услуга",
        navigate: true,
        message: `${dbCompany.companyName} и услуги добавлены в приложение.`,
        companyId: dbCompany._id,
        categoryIcon: dbCompany.category.avatar, //sarqel
        link: evLink,
      };
      const nt = new Notification(dataNotif);
      await nt.save();
      if (dbCompany.owner.notifCompany) {
        notifEvent.emit(
          "send",
          dbCompany.owner._id.toString(),
          JSON.stringify({
            type: "Новая услуга",
            status: 2,
            date_time: moment.tz(process.env.TZ).format("YYYY-MM-DD HH:mm"),
            user: dbCompany.owner._id.toString(),
            message: `${dbCompany.companyName} и услуги добавлены в приложение.`,
            companyId: dbCompany._id,
            navigate: true,
            categoryIcon: dbCompany.category.avatar, //sarqel
            link: evLink,
          })
        );
      }

      res.render(template, {
        layout: "profile",
        title: "Company Show",
        user: req.user,
        userOwner: dbCompany.owner,
        event: dbCompany,
        services: dbCompany.services,
        images: dbCompany.images,
        phone_numbers: dbCompany.phoneNumbers,
        eventCat,
      });
    } catch (error) {
      console.error(error);
    }
  },
  opportunity: async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      const token = authHeader.split(" ")[1];

      const user = jwt.decode(token);

      const userDb = await User.findById(user.id);
      if (userDb) {
        if (userDb.eventCompany) {
          userDb.eventCompany = false;
          await userDb.save();
        } else {
          userDb.eventCompany = true;
          await userDb.save();
        }
        res.status(200).send({ message: "success" });
      } else {
        res.status(403).send({ message: "User not found" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Server Error" });
    }
  },
  deleteCompany: async (req, res) => {
    try {
      const company = await Company.findById(req.params.id);

      if (!company) {
        throw new Error("Company not found");
      }

      // Find all related comments
      const comments = await companyComment.find({ companyId: req.params.id });

      // For each comment, delete related answers and likes
      for (const comment of comments) {
        // Delete all likes related to the comment
        await companyCommentLike.deleteMany({ commentId: comment._id });

        // Find all answers related to the comment
        const answers = await companyCommentAnswer.find({
          commentId: comment._id,
        });

        // For each answer, delete related likes
        for (const answer of answers) {
          await companyCommentAnswerLike.deleteMany({ answerId: answer._id });
        }

        // Delete all answers related to the comment
        await companyCommentAnswer.deleteMany({ commentId: comment._id });
      }

      // Delete all related services registers
      // const services=await companyServiceDb.find({ companyId: req.params.id });
      // for (let i = 0; i < services.length; i++) {
      //   const serviceRegistr = await servicesRegistrations.findOneAndRemove({
      //     serviceId: services[i]._id,
      //   });
      // }
      await ImpressionsCompany.deleteMany({ company: req.params.id });
      await companyParticipants.deleteMany({ companyId: req.params.id });
      await companyComment.deleteMany({ companyId: req.params.id });
      await companyImage.deleteMany({ companyId: req.params.id });
      await companyLikes.deleteMany({ companyId: req.params.id });
      await companyFavorit.deleteMany({ companyId: req.params.id });
      await companyView.deleteMany({ companyId: req.params.id });
      await companyRating.deleteMany({ companyId: req.params.id });
      await companyPhones.deleteMany({ companyId: req.params.id });
      await paysStore.deleteMany({ companyId: req.params.id });
      const companyHotDealDb = await companyHotDeals.find({
        companyId: req.params.id,
      });
      for (let i = 0; i < companyHotDealDb.length; i++) {
        await companyHotDealRegistration.deleteMany({
          dealId: companyHotDealDb[i]._id,
        });
      }
      await companyHotDeals.deleteMany({ companyId: req.params.id });
      await Notification.deleteMany({ companyId: req.params.id });

      const services = await companyServiceDb.find({
        companyId: req.params.id,
      });
      for (let i = 0; i < services.length; i++) {
        const serviceRegistr = await servicesRegistrations.deleteMany({
          serviceId: services[i]._id,
        });
      }
      await companyServiceDb.deleteMany({ companyId: req.params.id });
      await Report.deleteMany({ company: req.params.id });
      await companyImpressionImages.deleteMany({ companyId: req.params.id });
      await User.findByIdAndUpdate(company.owner.toString(), {
        $set: { company: null },
        $pull: {
          company_favorites: company._id,
          company_likes: company._id,
          company_views: company._id,
          company_ratings: company._id,
        },
      });
      await company.remove();

      console.log("Company and all related data deleted successfully");

      res.status(200).send({ success: true, message: "успешно удалено" });
    } catch (error) {
      console.error(error);
      res.status(500).send({ success: false, message: "Server Error" });
    }
  },
  myFavorites: async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      let resultArr = [];

      const token = authHeader.split(" ")[1];

      const user = jwt.decode(token);
      const resultFav = await CompanyFavorites.find({ user: user.id });
      for (let i = 0; i < resultFav.length; i++) {
        const resultComp = await Company.findById(resultFav[i].companyId)
          .populate("category")
          .populate("images")
          .populate("phoneNumbers")
          .populate("services")
          .populate("likes")
          .populate("comments")
          .populate("favorites")
          .exec();
        resultArr.push(resultComp);
      }
      for (let z = 0; z < resultArr.length; z++) {
        // const hours = moment.tz(process.env.TZ).format("HH:mm");
        // const splitOpen = resultArr[z].startHour.split(":");
        // const splitClose = resultArr[z].endHour.split(":");
        const isLiked = await companyLikes.findOne({
          user: user.id,
          companyId: resultArr[z]._id,
        });
        if (isLiked) {
          resultArr[z].isLike = true;
        }
        const isFavorite = await companyFavorit.findOne({
          user: user.id,
          companyId: resultArr[z]._id,
        });
        if (isFavorite) {
          resultArr[z].isFavorite = true;
        }
        const isRating = await companyRating.findOne({
          user: user.id,
          companyId: resultArr[z]._id,
        });

        if (isRating) {
          resultArr[z].isRating = true;
        }

        // if (
        //   Number(hours) >= Number(splitOpen[0]) &&
        //   Number(hours) < Number(splitClose[0])
        // ) {
        //   resultArr[z].open = true;
        // }
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

          return (
            currentMinutes >= startMinutes && currentMinutes < closeMinutes
          );
        }

        const openBool = isCompanyOpen(
          resultArr[z].startHour,
          resultArr[z].endHour,
          hours
        );
        resultArr[z].open = openBool;
      }

      res.status(200).send(resultArr);
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Server Error" });
    }
  },
  addFavorites: async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      const token = authHeader.split(" ")[1];

      const user = jwt.decode(token);
      const { companyId } = req.body;

      const result = await companyService.addFavorites(user.id, companyId);
      if (result) {
        res.status(200).send(result);
      } else {
        res.status(400).send({ message: "error" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Server Error" });
    }
  },
  addCommets: async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      const { companyId, text } = req.body;

      if (authHeader) {
        const token = authHeader.split(" ")[1];

        const user = jwt.decode(token);

        const date = moment.tz(process.env.TZ).format("YYYY-MM-DD HH:mm:ss");
        const newComment = new companyComment({
          user: user.id,
          companyId,
          text,
          date,
        });
        await newComment.save();

        const company = await Company.findById(companyId).populate("comments");

        company.comments.push(newComment._id);
        await company.save();
        const resultChanged1 = await Company.findById(companyId)
          .populate("images")
          .populate("phoneNumbers")
          .populate("services")
          .populate("likes")
          .populate("ratings")
          .populate({
            path: "comments",
            populate: { path: "user", select: "-password" },
          });

        const sendComment = await companyComment
          .findById(newComment._id)
          .populate({ path: "user", select: "name surname avatar" });

        const userDb = await User.findById(user.id);
        const companyDb = await Company.findById(companyId)
          .populate("images")
          .populate("category")
          .populate("owner");
        const ifImpressions = await ImpressionsCompany.findOne({
          company: companyId,
          user: user.id,
        });
        const dateTime = moment.tz(process.env.TZ).format("YYYY-MM-DD HH:mm");
        if (companyDb.owner._id.toString() !== userDb._id.toString()) {
          const evLink = `alleven://myCompany/${companyDb._id}`;
          const dataNotif = {
            status: 2,
            date_time: moment.tz(process.env.TZ).format("YYYY-MM-DD HH:mm"),
            user: companyDb.owner._id.toString(),
            type: "message",
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
                type: "message",
                navigate: true,
                eventId: companyDb._id,
                date_time: moment.tz(process.env.TZ).format("YYYY-MM-DD HH:mm"),
                message: `У вас новое сообщение.`,
                link: evLink,
              })
            );
          }
        }

        if (ifImpressions) {
          await ImpressionsCompany.findByIdAndUpdate(ifImpressions._id, {
            $push: { comments: text },
            $set: { date: dateTime },
          });
        } else {
          const companyImpression = new ImpressionsCompany({
            rating: 0,
            comments: [text],
            images: [],
            name: userDb.name,
            surname: userDb.surname,
            avatar: userDb.avatar,
            companyName: companyDb.companyName,
            companyImage: companyDb.images[0].name,
            company: companyDb._id,
            companyCategory: companyDb.category.name,
            user: user.id,
            date: dateTime,
          });
          await companyImpression.save();
        }

        res.status(200).send({
          comment: sendComment,
        });
        // }
      } else {
        res.status(401).send({ message: "Unauthorized" });
      }
    } catch (error) {
      console.error("Error adding comment:", error);
      res.status(500).send({ message: "Server Error" });
    }
  },
  like: async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      const { companyId } = req.body;
      const token = authHeader.split(" ")[1];

      const userToken = jwt.decode(token);
      const user = userToken.id;
      const userDb = await User.findById(user);

      const findLike = await companyLikes.findOne({ user, companyId });
      if (!findLike) {
        console.log("new like");

        const newLike = new companyLikes({ user, companyId });
        await newLike.save();

        const company = await Company.findById(companyId)
          .populate("likes")
          .populate("owner");
        company.likes.push(newLike._id);
        await company.save();
        const companyDb = await Company.findById(companyId);
        if (companyDb.owner.toString() !== userDb._id.toString()) {
          const evLink = `alleven://myCompany/${companyDb._id}`;
          const dataNotif = {
            status: 2,
            date_time: moment.tz(process.env.TZ).format("YYYY-MM-DD HH:mm"),
            user: company.owner._id.toString(),
            type: "like",
            navigate: true,
            message: `Пользователь ${userDb.name} поставил(а) лайк компании ${companyDb.companyName}.`,
            companyId: companyDb._id,
            // categoryIcon: event.category.avatar,
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
                companyId: companyDb._id,
                navigate: true,
                date_time: moment.tz(process.env.TZ).format("YYYY-MM-DD HH:mm"),
                message: `Пользователь ${userDb.name} поставил(а) лайк компании ${companyDb.companyName}.`,
                // categoryIcon: event.category.avatar,
                link: evLink,
              })
            );
          }
        }

        res.status(200).json({
          message: "Like added successfully",
          company,
          likes: companyDb.likes,
        });
        // }
      } else {
        await companyLikes.findByIdAndDelete(findLike._id);
        const company = await Company.findByIdAndUpdate(
          companyId,
          { $pull: { likes: findLike._id } },
          { new: true }
        );

        res.status(200).json({
          message: "Like deleted successfully",
          company,
          likes: company.likes,
        });
      }
    } catch (error) {
      console.error("Error adding like:", error);
      res.status(500).json({ message: "Server Error" });
    }
  },
  near: async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      const id = req.params.id;
      const { longitude, latitude } = req.query;

      const compUpdate = await Company.findById(id);

      compUpdate.isLike = false;
      compUpdate.isRating = false;
      compUpdate.isFavorite = false;
      await compUpdate.save();
      const myLatitude = 55.7558;
      const myLongitude = 37.6173;

      if (authHeader) {
        console.log("token ka----------");

        const token = authHeader.split(" ")[1];
        const user = jwt.decode(token);
        const result = await Company.findById(id).populate("ratings");

        let resultChanged1;
        const averageRating = calculateAverageRating(result.ratings);
        const ifView = await companyView.findOne({
          user: user.id,
          companyId: id,
        });

        if (!ifView) {
          const companyViewOne = new companyView({
            user: user.id,
            companyId: id,
            date: moment.tz(process.env.TZ).format("YYYY-MM-DD HH:mm:ss"),
          });
          await companyViewOne.save();
          resultChanged1 = await Company.findOneAndUpdate(
            { _id: id },
            {
              $push: { view: companyViewOne._id },
              $set: { rating: averageRating },
            },
            { new: true }
          )
            .populate("images")
            .populate("phoneNumbers")
            .populate("services")
            .populate("likes")
            .populate("ratings")
            .populate({
              path: "comments",
              populate: [
                {
                  path: "user",
                  select: "avatar name surname", // Select only the avatar and name fields from user
                },
                {
                  path: "answer",
                  select: "isLike text date likes",
                  populate: { path: "user", select: "avatar name surname" }, // Select only the content and likes fields from answer
                },
              ],
            })
            .populate("hotDeals")
            .populate({
              path: "impression_images",
              populate: { path: "user", select: "name surname avatar" },
            });
          for (let i = 0; i < resultChanged1.comments.length; i++) {
            for (let z = 0; z < resultChanged1.comments[i].answer.length; z++) {
              const findLike = await companyCommentAnswerLike.findOne({
                user: user.id,
                answerId: resultChanged1.comments[i].answer[z]._id,
              });
              if (findLike) {
                resultChanged1.comments[i].answer[z].isLike = true;
              }
            }
            const findCommentLike = await companyCommentLike.findOne({
              user: user.id,
              commentId: resultChanged1.comments[i]._id,
            });
            if (findCommentLike) {
              resultChanged1.comments[i].isLike = true;
            }
          }
          let upcomingDeals = [];
          for (let i = 0; i < resultChanged1.hotDeals.length; i++) {
            const fixedTime = moment.tz(
              resultChanged1.hotDeals[i].date,
              "YYYY-MM-DD HH:mm",
              process.env.TZ
            );

            // Check if the fixed time is after now
            const now = moment.tz(process.env.TZ).format("YYYY-MM-DD HH:mm");
            if (
              fixedTime.isAfter(now) &&
              resultChanged1.hotDeals[i].free === true
            ) {
              upcomingDeals.push(resultChanged1.hotDeals[i]);
            } else {
              await companyHotDeals.findByIdAndUpdate(
                resultChanged1.hotDeals[i]._id,
                { $set: { situation: "passed" } }
              );
            }
          }
          resultChanged1.hotDeals = upcomingDeals;
        } else {
          resultChanged1 = await Company.findOneAndUpdate(
            { _id: id },
            {
              $set: { rating: averageRating },
            },
            { new: true }
          )
            .populate("images")
            .populate("phoneNumbers")
            .populate("services")
            .populate("likes")
            .populate("ratings")
            .populate({
              path: "comments",
              populate: [
                {
                  path: "user",
                  select: "avatar name surname", // Select only the avatar and name fields from user
                },
                {
                  path: "answer",
                  select: "isLike text date likes",
                  populate: { path: "user", select: "avatar name surname" }, // Select only the content and likes fields from answer
                },
              ],
            })
            .populate("hotDeals")
            .populate({
              path: "impression_images",
              populate: { path: "user", select: "name surname avatar" },
            });
          let upcomingDeals = [];
          for (let i = 0; i < resultChanged1.comments.length; i++) {
            for (let z = 0; z < resultChanged1.comments[i].answer.length; z++) {
              const findLike = await companyCommentAnswerLike.findOne({
                user: user.id,
                answerId: resultChanged1.comments[i].answer[z]._id,
              });
              if (findLike) {
                resultChanged1.comments[i].answer[z].isLike = true;
              }
            }
            const findCommentLike = await companyCommentLike.findOne({
              user: user.id,
              commentId: resultChanged1.comments[i]._id,
            });
            if (findCommentLike) {
              resultChanged1.comments[i].isLike = true;
            }
          }
          for (let i = 0; i < resultChanged1.hotDeals.length; i++) {
            const fixedTime = moment.tz(
              resultChanged1.hotDeals[i].date,
              "YYYY-MM-DD HH:mm",
              process.env.TZ
            );

            const now = moment.tz(process.env.TZ);
            if (
              fixedTime.isAfter(now) &&
              resultChanged1.hotDeals[i].free === true
            ) {
              upcomingDeals.push(resultChanged1.hotDeals[i]);
            } else {
              await companyHotDeals.findByIdAndUpdate(
                resultChanged1.hotDeals[i]._id,
                { $set: { situation: "passed" } }
              );
            }
          }
          resultChanged1.hotDeals = upcomingDeals;
        }
        await resultChanged1.save();

        const isLiked = await companyLikes.findOne({
          user: user.id,
          companyId: resultChanged1._id,
        });
        if (isLiked) {
          resultChanged1.isLike = true;
        }
        const isFavorite = await companyFavorit.findOne({
          user: user.id,
          companyId: resultChanged1._id,
        });
        if (isFavorite) {
          resultChanged1.isFavorite = true;
        }

        const isRating = await companyRating.findOne({
          user: user.id,
          companyId: resultChanged1._id.toString(),
        });
        const registerArray = [];

        if (isRating) {
          resultChanged1.isRating = true;
        }

        for (let i = 0; i < resultChanged1.services.length; i++) {
          const serviceRegistr = await servicesRegistrations.findOne({
            serviceId: resultChanged1.services[i]._id,
            user: user.id,
            status: 1,
          });
          if (serviceRegistr) {
            registerArray.push(serviceRegistr);
          }
        }

        if (registerArray.length) {
          resultChanged1.isImpression = true;
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

          return (
            currentMinutes >= startMinutes && currentMinutes < closeMinutes
          );
        }

        const openBool = isCompanyOpen(
          resultChanged1.startHour,
          resultChanged1.endHour,
          hours
        );
        resultChanged1.open = openBool;
        for (let i = 0; i < resultChanged1.comments.length; i++) {
          for (let z = 0; z < resultChanged1.comments[i].answer.length; z++) {
            const findLike = await companyCommentAnswerLike.findOne({
              user: user.id,
              answerId: resultChanged1.comments[i].answer[z]._id,
            });
            if (findLike) {
              resultChanged1.comments[i].answer[z].isLike = true;
            }
          }
          const findCommentLike = await companyCommentLike.findOne({
            user: user.id,
            commentId: resultChanged1.comments[i]._id,
          });
          if (findCommentLike) {
            resultChanged1.comments[i].isLike = true;
          }
        }

        if (latitude && longitude) {
          resultChanged1.kilometr = calculateDistance(
            latitude,
            longitude,
            resultChanged1.latitude,
            resultChanged1.longitude
          );
        } else {
          resultChanged1.kilometr = calculateDistance(
            myLatitude,
            myLongitude,
            resultChanged1.latitude,
            resultChanged1.longitude
          );
        }

        res.status(200).send(resultChanged1);
      } else {
        console.log("token chka---------");

        const result = await Company.findById(id).populate("ratings");

        const averageRating = calculateAverageRating(result.ratings);

        const resultChanged1 = await Company.findOneAndUpdate(
          { _id: id },
          {
            $set: { rating: averageRating },
          },
          { new: true }
        )
          .populate("images")
          .populate("phoneNumbers")
          .populate("services")
          .populate("likes")
          .populate("ratings")
          .populate({
            path: "comments",
            populate: [
              {
                path: "user",
                select: "avatar name surname", // Select only the avatar and name fields from user
              },
              {
                path: "answer",
                select: "isLike text date likes",
                populate: { path: "user", select: "avatar name surname" }, // Select only the content and likes fields from answer
              },
            ],
          })
          .populate("hotDeals")
          .populate({
            path: "impression_images",
            populate: { path: "user", select: "name surname avatar" },
          });

        // const hours = moment.tz(process.env.TZ).format("HH:mm");
        // const splitOpen = resultChanged1.startHour.split(":");
        // const splitClose = resultChanged1.endHour.split(":");
        await resultChanged1.save();
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

          return (
            currentMinutes >= startMinutes && currentMinutes < closeMinutes
          );
        }

        const openBool = isCompanyOpen(
          resultChanged1.startHour,
          resultChanged1.endHour,
          hours
        );
        resultChanged1.open = openBool;
        // if (
        //   Number(hours) >= Number(splitOpen[0]) &&
        //   Number(hours) < Number(splitClose[0])
        // ) {
        //   resultChanged1.open = true;
        // }
        // resultChanged1.share=`/company/${resultChanged1._id}`
        // for (let i = 0; i < resultChanged1.comments.length; i++) {
        //   let object = {};
        //   const commentsLength = await companyComment.find({
        //     user: resultChanged1.comments[i].user._id.toString(),
        //     companyId: resultChanged1._id.toString(),
        //   });
        //   object.comments_count = commentsLength.length;
        //   object.avatar = resultChanged1.comments[i].user.avatar;
        //   object.name = resultChanged1.comments[i].user.name;
        //   object.surname = resultChanged1.comments[i].user.surname;
        //   object.text = resultChanged1.comments[i].text;

        //   const commRating = await companyRating.findOne({
        //     user: resultChanged1.comments[i].user._id.toString(),
        //     companyId: resultChanged1._id.toString(),
        //   });

        //   // if (commRating) {
        //   //   let ratingObject = {};
        //   //   ratingObject.date = isRating.date;
        //   //   ratingObject.rating = isRating.rating;
        //   //   object.rating = ratingObject;
        //   // } else {
        //   //   object.rating = null;
        //   // }
        //   resultChanged1.impressions.push(object);
        // }
        // resultChanged1.impressions.reverse();
        let upcomingDeals = [];
        for (let i = 0; i < resultChanged1.hotDeals.length; i++) {
          const fixedTime = moment.tz(
            resultChanged1.hotDeals[i].date,
            "YYYY-MM-DD HH:mm",
            process.env.TZ
          );

          const now = moment.tz(process.env.TZ);
          if (
            fixedTime.isAfter(now) &&
            resultChanged1.hotDeals[i].free === true
          ) {
            upcomingDeals.push(resultChanged1.hotDeals[i]);
          } else {
            await companyHotDeals.findByIdAndUpdate(
              resultChanged1.hotDeals[i]._id,
              { $set: { situation: "passed" } }
            );
          }
        }
        resultChanged1.hotDeals = upcomingDeals;

        if (latitude && longitude) {
          resultChanged1.kilometr = calculateDistance(
            latitude,
            longitude,
            resultChanged1.latitude,
            resultChanged1.longitude
          );
        } else {
          resultChanged1.kilometr = calculateDistance(
            myLatitude,
            myLongitude,
            resultChanged1.latitude,
            resultChanged1.longitude
          );
        }

        res.status(200).send(resultChanged1);
      }
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Server Error" });
    }
  },
  popular: async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      const { latitude, longitude } = req.query;
      const mskLatitude = 55.7558;
      const mskLongitude = 37.6173;

      if (!authHeader) {
        let dbObj = [];
        const resultCategory = await companyCategory.find();
        for (let i = 0; i < resultCategory.length; i++) {
          let obj = {};
          obj.category = resultCategory[i].name;
          obj.avatar = resultCategory[i].avatar;
          obj.id = resultCategory[i]._id;

          let cats = resultCategory[i];
          const resultCompany = await Company.find({
            category: resultCategory[i]._id,
          })
            .populate("images")
            .populate("services")
            .populate({
              path: "category",
              select: "name avatar",
            })
            // .populate("phoneNumbers")
            // .populate("likes")
            .populate("hotDeals");
          // .populate("comments");

          for (let z = 0; z < resultCompany.length; z++) {
            if (latitude && longitude) {
              resultCompany[z].kilometr = calculateDistance(
                latitude,
                longitude,
                resultCompany[z].latitude,
                resultCompany[z].longitude
              );
            } else {
              resultCompany[z].kilometr = calculateDistance(
                mskLatitude,
                mskLongitude,
                resultCompany[z].latitude,
                resultCompany[z].longitude
              );
            }

            let upcomingDeals = [];
            for (let i = 0; i < resultCompany[z].hotDeals.length; i++) {
              const dealTime = "2024-12-02 15:00";
              const fixedTime = moment.tz(
                resultCompany[z].hotDeals[i].date,
                "YYYY-MM-DD HH:mm",
                process.env.TZ
              );

              const now = moment.tz(process.env.TZ);
              if (fixedTime.isAfter(now)) {
                upcomingDeals.push(resultCompany[z].hotDeals[i]);
              } else {
                await companyHotDeals.findByIdAndUpdate(
                  resultCompany[z].hotDeals[i]._id,
                  { $set: { situation: "passed" } }
                );
              }
            }
            resultCompany[z].hotDeals = upcomingDeals;
            // const hours = moment.tz(process.env.TZ).format("HH:mm");
            // const splitOpen = resultCompany[z].startHour.split(":");
            // const splitClose = resultCompany[z].endHour.split(":");

            // if (
            //   Number(hours) >= Number(splitOpen[0]) &&
            //   Number(hours) < Number(splitClose[0])
            // ) {
            //   resultCompany[z].open = true;
            // }
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

              return (
                currentMinutes >= startMinutes && currentMinutes < closeMinutes
              );
            }

            const openBool = isCompanyOpen(
              resultCompany[z].startHour,
              resultCompany[z].endHour,
              hours
            );
            resultCompany[z].open = openBool;
          }
          obj.company = resultCompany;
          dbObj.push(obj);
        }

        const sortArray = dbObj.sort((a, b) => {
          return b.company.length - a.company.length;
        });

        res.status(200).send({ message: "access", data: sortArray });
      } else {
        const token = authHeader.split(" ")[1];

        const user = jwt.decode(token);
        // const user = { id: "656ecb2e923c5a66768f4cd3" };

        let dbObj = [];
        const resultCategory = await companyCategory.find();
        for (let i = 0; i < resultCategory.length; i++) {
          let obj = {};
          obj.category = resultCategory[i].name;
          obj.avatar = resultCategory[i].avatar;
          obj.id = resultCategory[i]._id;

          let cats = resultCategory[i];
          const resultCompany = await Company.find({
            category: resultCategory[i]._id,
            owner: { $ne: user.id },
          })
            .populate("images")
            .populate({
              path: "category",
              select: "name avatar",
            })
            .populate("services")
            .populate("hotDeals");

          for (let z = 0; z < resultCompany.length; z++) {
            if (latitude && longitude) {
              resultCompany[z].kilometr = calculateDistance(
                latitude,
                longitude,
                resultCompany[z].latitude,
                resultCompany[z].longitude
              );
            } else {
              resultCompany[z].kilometr = calculateDistance(
                mskLatitude,
                mskLongitude,
                resultCompany[z].latitude,
                resultCompany[z].longitude
              );
            }

            let upcomingDeals = [];
            for (let i = 0; i < resultCompany[z].hotDeals.length; i++) {
              const dealTime = "2024-12-02 15:00";
              const fixedTime = moment.tz(
                resultCompany[z].hotDeals[i].date,
                "YYYY-MM-DD HH:mm",
                process.env.TZ
              );

              const now = moment.tz(process.env.TZ);
              if (fixedTime.isAfter(now)) {
                upcomingDeals.push(resultCompany[z].hotDeals[i]);
              } else {
                await companyHotDeals.findByIdAndUpdate(
                  resultCompany[z].hotDeals[i]._id,
                  { $set: { situation: "passed" } }
                );
              }
            }
            resultCompany[z].hotDeals = upcomingDeals;

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

              return (
                currentMinutes >= startMinutes && currentMinutes < closeMinutes
              );
            }

            const openBool = isCompanyOpen(
              resultCompany[z].startHour,
              resultCompany[z].endHour,
              hours
            );
            resultCompany[z].open = openBool;
          }
          obj.company = resultCompany;
          dbObj.push(obj);
        }

        const sortArray = dbObj.sort((a, b) => {
          return b.company.length - a.company.length;
        });

        res.status(200).send({ message: "access", data: sortArray });
      }
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Server Error" });
    }
  },
  getCompanys: async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      const myLatitude = 55.7558;
      const myLongitude = 37.6173;
      if (authHeader) {
        const token = authHeader.split(" ")[1];

        const user = jwt.decode(token);
        const result = await Company.find({ owner: { $ne: user.id } })
          .populate("images")
          // .populate("services")
          // .populate("phoneNumbers")
          // .populate("likes")
          // .populate("comments")
          .populate("hotDeals")
          .populate("category");

        result.forEach((company) => {
          company.kilometr = calculateDistance(
            myLatitude,
            myLongitude,
            company.latitude,
            company.longitude
          );
        });
        for (let z = 0; z < result.length; z++) {
          // const now = new Date();
          let upcomingDeals = [];
          for (let i = 0; i < result[z].hotDeals.length; i++) {
            const dealTime = "2024-12-02 15:00";
            const fixedTime = moment.tz(
              result[z].hotDeals[i].date,
              "YYYY-MM-DD HH:mm",
              process.env.TZ
            );

            // Check if the fixed time is after now
            const now = moment.tz(process.env.TZ);
            if (fixedTime.isAfter(now)) {
              upcomingDeals.push(result[z].hotDeals[i]);
            } else {
              await companyHotDeals.findByIdAndUpdate(
                result[z].hotDeals[i]._id,
                { $set: { situation: "passed" } }
              );
            }
          }
          result[z].hotDeals = upcomingDeals;
          // const hours = now.getHours();
          // const hours = moment.tz(process.env.TZ).format("HH:mm");
          // const splitOpen = result[z].startHour.split(":");
          // const splitClose = result[z].endHour.split(":");

          // if (
          //   Number(hours) >= Number(splitOpen[0]) &&
          //   Number(hours) < Number(splitClose[0])
          // ) {
          //   result[z].open = true;
          // }
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

            return (
              currentMinutes >= startMinutes && currentMinutes < closeMinutes
            );
          }

          const openBool = isCompanyOpen(
            result[z].startHour,
            result[z].endHour,
            hours
          );
          result[z].open = openBool;
        }

        result.sort((a, b) => a.kilometr - b.kilometr);
        res.status(200).send({ message: "access", data: result });
      } else {
        const result = await Company.find()
          .populate("images")
          // .populate("services")
          // .populate("phoneNumbers")
          // .populate("likes")
          // .populate("comments")
          .populate("hotDeals")
          .populate("category");

        result.forEach((company) => {
          company.kilometr = calculateDistance(
            myLatitude,
            myLongitude,
            company.latitude,
            company.longitude
          );
        });
        for (let z = 0; z < result.length; z++) {
          // const now = new Date();
          let upcomingDeals = [];
          for (let i = 0; i < result[z].hotDeals.length; i++) {
            const dealTime = "2024-12-02 15:00";
            const fixedTime = moment.tz(
              result[z].hotDeals[i].date,
              "YYYY-MM-DD HH:mm",
              process.env.TZ
            );

            // Check if the fixed time is after now
            const now = moment.tz(process.env.TZ);
            if (fixedTime.isAfter(now)) {
              upcomingDeals.push(result[z].hotDeals[i]);
            } else {
              await companyHotDeals.findByIdAndUpdate(
                result[z].hotDeals[i]._id,
                { $set: { situation: "passed" } }
              );
            }
          }
          resultCompany[z].hotDeals = upcomingDeals;
          // const hours = now.getHours();
          // const hours = moment.tz(process.env.TZ).format("HH:mm");
          // const splitOpen = result[z].startHour.split(":");
          // const splitClose = result[z].endHour.split(":");

          // if (
          //   Number(hours) >= Number(splitOpen[0]) &&
          //   Number(hours) < Number(splitClose[0])
          // ) {
          //   result[z].open = true;
          // }
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

            return (
              currentMinutes >= startMinutes && currentMinutes < closeMinutes
            );
          }

          const openBool = isCompanyOpen(
            result[z].startHour,
            result[z].endHour,
            hours
          );
          result[z].open = openBool;
        }
        result.sort((a, b) => a.kilometr - b.kilometr);
        res.status(200).send({ message: "access", data: result });
      }
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Server Error" });
    }
  },
  singl: async () => {
    try {
      let template = "profile/company-single";
      let event = await this.EventService.getById(req.params.id);
      let eventCats = await this.EventCategoryService.get();
      if (event.status && event.status != 0 && event.status != 1) {
        template += "-rejected";
      }

      res.render(template, {
        layout: "profile",
        title: "Event Single",
        user: req.user,
        event,
        eventCats,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Server Error" });
    }
  },
  single: async (req, res) => {
    try {
      const authHeader = req.headers.authorization;

      const token = authHeader.split(" ")[1];
      const user = jwt.decode(token);

      const userDb = await User.findById(user.id).populate("company");
      const compUpdate = await Company.findById(userDb.company._id);
      compUpdate.isLike = false;
      compUpdate.isRating = false;
      compUpdate.isFavorite = false;
      await compUpdate.save();
      const result = await Company.findById(userDb.company._id)
        .populate("ratings")
        .exec();

      const averageRating = calculateAverageRating(result.ratings);

      const resultChanged1 = await Company.findOneAndUpdate(
        { _id: userDb.company._id },
        {
          $set: { rating: averageRating }, // Set new rating
        },
        { new: true } // Return the updated document
      )
        .populate("images")
        .populate({ path: "category", select: "name avatar" })
        .populate("phoneNumbers")
        .populate("services")
        .populate("likes")
        .populate("ratings")
        .populate("hotDeals")
        .populate({
          path: "participants",
          populate: {
            path: "user",
            select: "name surname avatar phone_number",
          },
        })
        .populate({
          path: "comments",
          populate: [
            {
              path: "user",
              select: "avatar name surname", // Select only the avatar and name fields from user
            },
            {
              path: "answer",
              select: "isLike text date likes",
              populate: { path: "user", select: "avatar name surname" }, // Select only the content and likes fields from answer
            },
          ],
        })
        .populate({
          path: "impression_images",
          populate: { path: "user", select: "name surname avatar" },
        });

      const isLiked = await companyLikes.findOne({
        user: user.id,
        companyId: resultChanged1._id,
      });
      if (isLiked) {
        resultChanged1.isLike = true;
      }
      const isFavorite = await companyFavorit.findOne({
        user: user.id,
        companyId: resultChanged1._id,
      });
      if (isFavorite) {
        resultChanged1.isFavorite = true;
      }
      const isRating = await companyRating.findOne({
        user: user.id,
        companyId: resultChanged1._id,
      });

      if (isRating) {
        resultChanged1.isRating = true;
      }

      await resultChanged1.save();

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

      const openBool = isCompanyOpen(
        resultChanged1.startHour,
        resultChanged1.endHour,
        hours
      );
      resultChanged1.open = openBool;

      for (let i = 0; i < resultChanged1.comments.length; i++) {
        for (let z = 0; z < resultChanged1.comments[i].answer.length; z++) {
          const findLike = await companyCommentAnswerLike.findOne({
            user: user.id,
            answerId: resultChanged1.comments[i].answer[z]._id,
          });
          if (findLike) {
            resultChanged1.comments[i].answer[z].isLike = true;
          }
        }
        const findCommentLike = await companyCommentLike.findOne({
          user: user.id,
          commentId: resultChanged1.comments[i]._id,
        });
        if (findCommentLike) {
          resultChanged1.comments[i].isLike = true;
        }
      }
      let upcomingDeals = [];
      for (let i = 0; i < resultChanged1.hotDeals.length; i++) {
        const todayDate= moment.tz(process.env.TZ).format("YYYY-MM-DD");
        const dealDateSpl= resultChanged1.hotDeals[i].date.split(" ")[0]
        if(dealDateSpl===todayDate){
          upcomingDeals.push(resultChanged1.hotDeals[i]);
        }

        const fixedTime = moment.tz(
          resultChanged1.hotDeals[i].date,
          "YYYY-MM-DD HH:mm",
          process.env.TZ
        );
        const now= moment.tz(process.env.TZ).format("YYYY-MM-DD HH:mm");

        if (!fixedTime.isAfter(now)) {
          await companyHotDeals.findByIdAndUpdate(
            resultChanged1.hotDeals[i]._id,
            {
              $set: {
                situation: "passed",
              },
            }
          );
        }
      }
      resultChanged1.hotDeals = upcomingDeals;
      const today = moment.tz(process.env.TZ).format("YYYY-MM-DD");
      const tomorrow = moment
        .tz(process.env.TZ)
        .add(1, "day")
        .format("YYYY-MM-DD");

      let countToday = [];
      let countAfter = [];
      for (let i = 0; i < resultChanged1.services.length; i++) {
        const serviceRegisterToday = await servicesRegistrations.find({
          serviceId: resultChanged1.services[i]._id,
          pay: true,
          date: { $regex: `^${today}` },
        });

        const serviceRegisterAfter = await servicesRegistrations.find({
          serviceId: resultChanged1.services[i],
          pay: true,
          date: { $gt: tomorrow }, // Matches today and dates after today
        });

        countAfter.push(serviceRegisterAfter.length);
        countToday.push(serviceRegisterToday.length);
      }
      console.log(resultChanged1.hotDeals,"resultChanged1.hotDeals");
      
      for (let i = 0; i < resultChanged1.hotDeals.length; i++) {
        if (resultChanged1.hotDeals[i].registration) {
          console.log("hotDeals registration", resultChanged1.hotDeals[i]);
          
          countToday.push(1);
          console.log(countToday,"countToday deal +1");
          
        }
      }
      console.log(countToday,"countToday resalt");

      resultChanged1.todayRegisters = countToday.reduce((a, b) => a + b, 0);
      resultChanged1.afterRegisters = countAfter.reduce((a, b) => a + b, 0);

      // resultChanged1.todayRegisters = countToday;
      // resultChanged1.afterRegisters = countAfter;
      function removeDuplicatesByUser(data) {
        const uniqueEntries = {};

        data.forEach((item) => {
          uniqueEntries[item.user] = item; // Overwrite to keep the last occurrence
        });

        return Object.values(uniqueEntries);
      }
      resultChanged1.participants = removeDuplicatesByUser(
        resultChanged1.participants
      );

      res.status(200).send(resultChanged1);
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Server error" });
    }
  },
  getCategory: async (req, res) => {
    try {
      const dbResult = await companyCategory.find();
      res.status(200).send({ message: "success", categories: dbResult });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Server error" });
    }
  },
  days: async (req, res) => {
    try {
      res.status(200).send(calendar);
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Server error" });
    }
  },
  addCompany: async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      const token = authHeader.split(" ")[1];

      const user = jwt.decode(token);
      const userDB = await User.findById(user.id);
      const companyDb = await companyModel
        .findOne({
          owner: userDB._id.toString(),
        })
        .populate("category");

      if (!companyDb) {
        const data = req.body;

        const result = await companyService.addCompany(data, user.id);

        const db = await Company.findById(result.company._id)
          .populate("owner")
          .populate("images");
        const evLink = `alleven://myCompany/${db._id}`;
        const categor = await companyCategory.findById(db.category.toString());

        const dataNotif = {
          status: 2,
          date_time: moment.tz(process.env.TZ).format("YYYY-MM-DD HH:mm:ss"),
          user: user.id,
          type: "Новая услуга",
          message: `Ваше ${db.companyName} и услуги находится на модерации`,
          companyId: db._id,
          navigate: true,
          categoryIcon: categor.avatar,
          link: evLink,
        };
        let role = await Role.findOne({ name: "USER" });
        dataNotif.sent = role;
        const nt = new Notification(dataNotif);
        await nt.save();
        if (db.owner.notifCompany) {
          notifEvent.emit(
            "send",
            db.owner._id.toString(),
            JSON.stringify({
              type: "Новая услуга",
              date_time: moment
                .tz(process.env.TZ)
                .format("YYYY-MM-DD HH:mm:ss"),
              message: `Ваше ${db.companyName} и услуги находится на модерации`,
              categoryIcon: categor.avatar,
              companyId: db._id,
              navigate: true,
              status: 2,
              user: user.id,
              link: evLink,
            })
          );
        }

        notifEvent.emit(
          "send",
          "ADMIN",
          JSON.stringify({
            type: "Новая услуга",
            message: "event",
            data: db,
          })
        );

        res.status(200).send(result);
      } else {
        res.status(200).send({ message: "у вас уже добавлена ​​услуга" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Server Error" });
    }
  },
  // editeCompany: async (req, res) => {
  //   try {
  //     const result = await companyService.editeCompany();
  //     res.status(200).send(result);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // },
  addService: async (req, res) => {
    try {
      const { companyId, type, description, cost, images } = req.body;

      const result = await companyService.addService(
        companyId,
        type,
        description,
        cost,
        images
      );
      res.status(200).send(result);
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Server error" });
    }
  },
  index: async (req, res) => {
    try {
      const { name, category, date_from } = req.query;
      let params = {};
      let events;
      if (name) {
        params.name = name;
        events = await Company.find({ companyName: name })
          .populate({ path: "owner", select: "-password" })
          .populate("images")
          .populate("phoneNumbers")
          .populate("services")
          .populate("likes")
          .populate("category");
      }

      if (category) {
        const eventCats = await companyCategory.findById(category);
        params.category = category;
        events = await Company.find({ category: eventCats._id })
          .populate({ path: "owner", select: "-password" })
          .populate("images")
          .populate("phoneNumbers")
          .populate("services")
          .populate("likes")
          .populate("category");
      }

      if (!category && !name) {
        events = await Company.find()
          .populate({ path: "owner", select: "-password" })
          .populate("images")
          .populate("phoneNumbers")
          .populate("services")
          .populate("likes")
          .populate("category");
      }

      // if (date_from) {
      //   params.started_time = {
      //     $gte: new Date(date_from).toISOString(),
      //   };
      // }

      const eventCats = await companyCategory.find();
      events.sort(
        (a, b) => moment(a.createdAt).valueOf() - moment(b.createdAt).valueOf()
      );
      events.reverse();
      res.render("profile/company", {
        layout: "profile",
        title: "Company",
        user: req.user,
        events,
        eventCats,
        q: req.query,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Server error" });
    }
  },
  radius: async (req, res) => {
    try {
      const authHeader = req.headers.authorization;

      const { longitude, latitude } = req.query;

      if (authHeader && longitude && latitude) {
        const token = authHeader.split(" ")[1];
        const user = jwt.decode(token);

        const myLatitude = latitude;
        const myLongitude = longitude;
        const compCategory = await companyCategory.find();
        let arrResult = [];

        for (let z = 0; z < compCategory.length; z++) {
          let obj = {};

          const company = await Company.find({
            owner: { $ne: user.id },
            status: { $eq: 1 },
          })
            .populate("images")
            .populate({
              path: "services",
              populate: { path: "serviceRegister" },
            })
            .populate("phoneNumbers")
            .populate("category")
            .populate({ path: "owner", select: "-password" })
            .populate("likes")
            .populate("hotDeals")
            .populate("comments");

          company.forEach((company) => {
            company.kilometr = calculateDistance(
              myLatitude,
              myLongitude,
              company.latitude,
              company.longitude
            );
          });

          company.sort((a, b) => a.kilometr - b.kilometr);

          for (let z = 0; z < company.length; z++) {
            // const now = new Date();
            let upcomingDeals = [];
            for (let i = 0; i < company[z].hotDeals.length; i++) {
              const dealTime = "2024-12-02 15:00";
              const fixedTime = moment.tz(
                company[z].hotDeals[i].date,
                "YYYY-MM-DD HH:mm",
                process.env.TZ
              );

              // Check if the fixed time is after now
              const now = moment.tz(process.env.TZ);
              if (fixedTime.isAfter(now)) {
                upcomingDeals.push(company[z].hotDeals[i]);
              } else {
                await companyHotDeals.findByIdAndUpdate(
                  company[z].hotDeals[i]._id,
                  { $set: { situation: "passed" } }
                );
              }
            }
            company[z].hotDeals = upcomingDeals;
            // const hours = now.getHours();
            // const hours = moment.tz(process.env.TZ).format("HH:mm");
            // const splitOpen = company[z].startHour.split(":");
            // const splitClose = company[z].endHour.split(":");

            // if (
            //   Number(hours) >= Number(splitOpen[0]) &&
            //   Number(hours) < Number(splitClose[0])
            // ) {
            //   company[z].open = true;
            // }
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

              return (
                currentMinutes >= startMinutes && currentMinutes < closeMinutes
              );
            }

            const openBool = isCompanyOpen(
              company[z].startHour,
              company[z].endHour,
              hours
            );
            company[z].open = openBool;
          }
          obj.category = compCategory[z].name;
          obj.avatar = compCategory[z].avatar;
          obj.id = compCategory[z]._id;
          obj.company = company;
          arrResult.push(obj);
        }

        res.status(200).send(arrResult);
      } else if (authHeader && longitude === "" && latitude === "") {
        const myLatitude = 55.7558;
        const myLongitude = 37.6173;
        const token = authHeader.split(" ")[1];
        const user = jwt.decode(token);
        const compCategory = await companyCategory.find();
        let arrResult = [];

        for (let z = 0; z < compCategory.length; z++) {
          let obj = {};

          const company = await Company.find({
            owner: { $ne: user.id },
            status: { $eq: 1 },
          })
            .populate("images")
            .populate({
              path: "services",
              populate: { path: "serviceRegister" },
            })
            .populate("phoneNumbers")
            .populate("category")
            .populate({ path: "owner", select: "-password" })
            .populate("likes")
            .populate("hotDeals")
            .populate("comments");

          company.forEach((company) => {
            company.kilometr = calculateDistance(
              myLatitude,
              myLongitude,
              company.latitude,
              company.longitude
            );
          });

          company.sort((a, b) => a.kilometr - b.kilometr);

          for (let z = 0; z < company.length; z++) {
            // const hours = moment.tz(process.env.TZ).format("HH:mm");
            // const splitOpen = company[z].startHour.split(":");
            // const splitClose = company[z].endHour.split(":");
            let upcomingDeals = [];
            for (let i = 0; i < company[z].hotDeals.length; i++) {
              const dealTime = "2024-12-02 15:00";
              const fixedTime = moment.tz(
                company[z].hotDeals[i].date,
                "YYYY-MM-DD HH:mm",
                process.env.TZ
              );

              // Check if the fixed time is after now
              const now = moment.tz(process.env.TZ);
              if (fixedTime.isAfter(now)) {
                upcomingDeals.push(company[z].hotDeals[i]);
              } else {
                await companyHotDeals.findByIdAndUpdate(
                  company[z].hotDeals[i]._id,
                  { $set: { situation: "passed" } }
                );
              }
            }
            company[z].hotDeals = upcomingDeals;
            // if (
            //   Number(hours) >= Number(splitOpen[0]) &&
            //   Number(hours) < Number(splitClose[0])
            // ) {
            //   company[z].open = true;
            // }

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

              return (
                currentMinutes >= startMinutes && currentMinutes < closeMinutes
              );
            }

            const openBool = isCompanyOpen(
              company[z].startHour,
              company[z].endHour,
              hours
            );
            company[z].open = openBool;
          }
          obj.category = compCategory[z].name;
          obj.avatar = compCategory[z].avatar;
          obj.id = compCategory[z]._id;

          obj.company = company;
          arrResult.push(obj);
        }

        res.status(200).send(arrResult);
      } else if (!authHeader && longitude && latitude) {
        const myLatitude = latitude;
        const myLongitude = longitude;
        const compCategory = await companyCategory.find();
        let arrResult = [];

        for (let z = 0; z < compCategory.length; z++) {
          let obj = {};

          const company = await Company.find({
            status: { $eq: 1 },
          })
            .populate("images")
            .populate({
              path: "services",
              populate: { path: "serviceRegister" },
            })
            .populate("phoneNumbers")
            .populate("hotDeals")
            .populate("category")
            .populate({ path: "owner", select: "-password" })
            .populate("likes")
            .populate("comments");

          company.forEach((company) => {
            company.kilometr = calculateDistance(
              myLatitude,
              myLongitude,
              company.latitude,
              company.longitude
            );
          });

          company.sort((a, b) => a.kilometr - b.kilometr);

          for (let z = 0; z < company.length; z++) {
            // const hours = moment.tz(process.env.TZ).format("HH:mm");
            // const splitOpen = company[z].startHour.split(":");
            // const splitClose = company[z].endHour.split(":");
            let upcomingDeals = [];
            for (let i = 0; i < company[z].hotDeals.length; i++) {
              const dealTime = "2024-12-02 15:00";
              const fixedTime = moment.tz(
                company[z].hotDeals[i].date,
                "YYYY-MM-DD HH:mm",
                process.env.TZ
              );

              const now = moment.tz(process.env.TZ);
              if (fixedTime.isAfter(now)) {
                upcomingDeals.push(company[z].hotDeals[i]);
              } else {
                await companyHotDeals.findByIdAndUpdate(
                  company[z].hotDeals[i]._id,
                  { $set: { situation: "passed" } }
                );
              }
            }
            company[z].hotDeals = upcomingDeals;
            // if (
            //   Number(hours) >= Number(splitOpen[0]) &&
            //   Number(hours) < Number(splitClose[0])
            // ) {
            //   company[z].open = true;
            // }
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

              return (
                currentMinutes >= startMinutes && currentMinutes < closeMinutes
              );
            }

            const openBool = isCompanyOpen(
              company[z].startHour,
              company[z].endHour,
              hours
            );
            company[z].open = openBool;
          }
          obj.category = compCategory[z].name;
          obj.avatar = compCategory[z].avatar;
          obj.id = compCategory[z]._id;

          obj.company = company;
          arrResult.push(obj);
        }

        res.status(200).send(arrResult);
      } else if (!authHeader && longitude === "" && latitude === "") {
        const myLatitude = 55.7558;
        const myLongitude = 37.6173;
        const compCategory = await companyCategory.find();
        let arrResult = [];

        for (let z = 0; z < compCategory.length; z++) {
          let obj = {};

          const company = await Company.find({
            status: { $eq: 1 },
          })
            .populate("images")
            .populate({
              path: "services",
              populate: { path: "serviceRegister" },
            })
            .populate("phoneNumbers")
            .populate("category")
            .populate("hotDeals")
            .populate({ path: "owner", select: "-password" })
            .populate("likes")
            .populate("comments");

          company.forEach((company) => {
            company.kilometr = calculateDistance(
              myLatitude,
              myLongitude,
              company.latitude,
              company.longitude
            );
          });

          company.sort((a, b) => a.kilometr - b.kilometr);

          for (let z = 0; z < company.length; z++) {
            // const hours = moment.tz(process.env.TZ).format("HH:mm");
            // const splitOpen = company[z].startHour.split(":");
            // const splitClose = company[z].endHour.split(":");
            let upcomingDeals = [];
            for (let i = 0; i < company[z].hotDeals.length; i++) {
              const dealTime = "2024-12-02 15:00";
              const fixedTime = moment.tz(
                company[z].hotDeals[i].date,
                "YYYY-MM-DD HH:mm",
                process.env.TZ
              );

              // Check if the fixed time is after now
              const now = moment.tz(process.env.TZ);
              if (fixedTime.isAfter(now)) {
                upcomingDeals.push(company[z].hotDeals[i]);
              } else {
                await companyHotDeals.findByIdAndUpdate(
                  company[z].hotDeals[i]._id,
                  { $set: { situation: "passed" } }
                );
              }
            }
            company[z].hotDeals = upcomingDeals;
            // if (
            //   Number(hours) >= Number(splitOpen[0]) &&
            //   Number(hours) < Number(splitClose[0])
            // ) {
            //   company[z].open = true;
            // }
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

              return (
                currentMinutes >= startMinutes && currentMinutes < closeMinutes
              );
            }

            const openBool = isCompanyOpen(
              company[z].startHour,
              company[z].endHour,
              hours
            );
            company[z].open = openBool;
          }
          obj.category = compCategory[z].name;
          obj.avatar = compCategory[z].avatar;
          obj.id = compCategory[z]._id;
          obj.company = company;
          arrResult.push(obj);
        }

        res.status(200).send(arrResult);
      } else {
        res.status(400).send({
          message: "Error",
        });
      }
    } catch (error) {
      console.error(error);
      res.status(500).send({
        message: "Server Error",
      });
    }
  },
};

export default companyController;
